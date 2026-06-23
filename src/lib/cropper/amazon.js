/**
 * Amazon shipping-label detection.
 *
 * Amazon label pages in the current samples are image-only, while invoice
 * pages usually expose text. This detector skips invoice text pages and then
 * verifies label pages visually using barcode/QR density before cropping the
 * dark content bounds.
 */

import { UnsupportedLabelFormat } from './flipkart.js';

const AMAZON_INVOICE_MARKERS = [
  'taxinvoice/billofsupply/cashmemo',
  'invoicenumber',
  'invoicedetails',
  'authorizedsignatory',
  'placeofsupply',
  'placeofdelivery',
];

/**
 * @param {Array<{str:string}>} textItems
 * @param {number} pageHeight
 * @param {number} pageNumber
 * @param {HTMLCanvasElement} fullCanvas
 * @param {number} renderScale
 * @returns {{ pageNumber:number, box:object, anchors:string[] }}
 */
export function detectAmazonLabel(textItems, pageHeight, pageNumber, fullCanvas, renderScale) {
  const textContent = textItems.map((t) => t.str).join(' ');
  const normalized = textContent.replace(/\s+/g, '').toLowerCase();

  if (isAmazonInvoicePage(normalized)) {
    throw new UnsupportedLabelFormat(`Page ${pageNumber} is an Amazon invoice. Skipping.`);
  }

  if (textItems.length > 0 && !isAmazonLabelText(normalized)) {
    throw new UnsupportedLabelFormat(`Page ${pageNumber} is not an Amazon shipping label.`);
  }

  if (!looksLikeAmazonLabel(fullCanvas)) {
    throw new UnsupportedLabelFormat(`Page ${pageNumber} does not look like an Amazon shipping label.`);
  }

  return {
    pageNumber,
    box: darkContentBox(fullCanvas, pageHeight, renderScale),
    anchors: ['Amazon visual label', 'barcode/QR density', 'invoice ignored'],
  };
}

function isAmazonInvoicePage(normalized) {
  return AMAZON_INVOICE_MARKERS.some((marker) => normalized.includes(marker));
}

function isAmazonLabelText(normalized) {
  return normalized.includes('shipto') && normalized.includes('awb') && normalized.includes('orderid');
}

function looksLikeAmazonLabel(canvas) {
  const { data, width, height } = getImageData(canvas);
  const blockSize = Math.max(16, Math.round(width / 85));
  let denseBlocks = 0;
  let middleDenseBlocks = 0;
  let darkPixels = 0;
  const totalPixels = width * height;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      if (luma(data, idx) < 90) darkPixels += 1;
    }
  }

  for (let y = 0; y <= height - blockSize; y += blockSize) {
    for (let x = 0; x <= width - blockSize; x += blockSize) {
      let blockDark = 0;
      for (let by = 0; by < blockSize; by++) {
        const rowStart = ((y + by) * width + x) * 4;
        for (let bx = 0; bx < blockSize; bx++) {
          if (luma(data, rowStart + bx * 4) < 90) blockDark += 1;
        }
      }

      const density = blockDark / (blockSize * blockSize);
      if (density > 0.22) {
        denseBlocks += 1;
        if (height * 0.35 <= y && y <= height * 0.68) {
          middleDenseBlocks += 1;
        }
      }
    }
  }

  const darkPercent = (darkPixels / totalPixels) * 100;
  return denseBlocks >= 250 && middleDenseBlocks >= 120 && darkPercent >= 8;
}

function darkContentBox(canvas, pageHeight, renderScale) {
  const { data, width, height } = getImageData(canvas);
  const rowCounts = new Uint32Array(height);
  const colCounts = new Uint32Array(width);
  const minPixels = Math.max(5, Math.round(width * 0.004));

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      if (luma(data, idx) < 210) {
        rowCounts[y] += 1;
        colCounts[x] += 1;
      }
    }
  }

  let minX = -1;
  let maxX = -1;
  let minY = -1;
  let maxY = -1;

  for (let x = 0; x < width; x++) {
    if (colCounts[x] > minPixels) {
      if (minX === -1) minX = x;
      maxX = x;
    }
  }

  for (let y = 0; y < height; y++) {
    if (rowCounts[y] > minPixels) {
      if (minY === -1) minY = y;
      maxY = y;
    }
  }

  if (minX === -1 || minY === -1) {
    throw new UnsupportedLabelFormat('Could not find Amazon label content.');
  }

  const pad = Math.round(renderScale * 2);
  const x0 = Math.max(0, minX - pad) / renderScale;
  const top = Math.max(0, minY - pad) / renderScale;
  const x1 = Math.min(width, maxX + 1 + pad) / renderScale;
  const bottom = Math.min(height, maxY + 1 + pad) / renderScale;
  const clampedBottom = Math.min(bottom, pageHeight);

  return {
    x0,
    top,
    x1,
    bottom: clampedBottom,
    width: x1 - x0,
    height: clampedBottom - top,
  };
}

function getImageData(canvas) {
  const ctx = canvas.getContext('2d');
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function luma(data, idx) {
  return data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114;
}
