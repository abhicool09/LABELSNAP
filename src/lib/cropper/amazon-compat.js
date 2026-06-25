/**
 * Compatibility cropper for newer compact Amazon Easy Ship labels.
 *
 * The existing Amazon detector remains the primary detector. Some valid,
 * image-only labels use a lighter compact layout and narrowly miss its dark
 * pixel threshold. This wrapper retries only those textless pages with a
 * conservative visual check, while continuing to skip invoice text pages.
 */

import { loadPdf, renderPageToCanvas, getPageText } from './pdf-utils.js';
import { detectAmazonLabel } from './amazon.js';
import { UnsupportedLabelFormat } from './flipkart.js';
import { createThermalPdf, createA4SheetPdf } from './layout.js';

const RENDER_SCALE = 4;

export async function cropAmazonPdfCompat(file, marketplace, layout, onProgress) {
  if (!file) throw new Error('cropAmazonPdfCompat: file is required');
  if (marketplace !== 'amazon') {
    throw new Error(`cropAmazonPdfCompat: unsupported marketplace '${marketplace}'`);
  }
  if (!['thermal', 'a4'].includes(layout)) {
    throw new Error(`cropAmazonPdfCompat: unsupported layout '${layout}'`);
  }

  const pdfDoc = await loadPdf(file);
  const detections = [];
  const croppedCanvases = [];
  const skipReasons = [];

  for (let pageNumber = 1; pageNumber <= pdfDoc.numPages; pageNumber += 1) {
    onProgress?.({ page: pageNumber, total: pdfDoc.numPages });

    const page = await pdfDoc.getPage(pageNumber);
    const pageHeight = page.getViewport({ scale: 1 }).height;
    const textItems = await getPageText(page);
    const fullCanvas = await renderPageToCanvas(page, RENDER_SCALE);

    let detection;
    try {
      detection = detectAmazonLabel(
        textItems,
        pageHeight,
        pageNumber,
        fullCanvas,
        RENDER_SCALE,
      );
    } catch (error) {
      if (!(error instanceof UnsupportedLabelFormat)) throw error;

      detection = detectCompactImageLabel(
        textItems,
        pageHeight,
        pageNumber,
        fullCanvas,
        RENDER_SCALE,
      );

      if (!detection) {
        skipReasons.push(error.message);
        continue;
      }
    }

    detections.push(detection);
    croppedCanvases.push(cropCanvas(fullCanvas, detection.box, RENDER_SCALE));
  }

  if (croppedCanvases.length === 0) {
    throw new UnsupportedLabelFormat(
      `No labels detected. Info: ${skipReasons.join(' | ')}`,
    );
  }

  const blob =
    layout === 'thermal'
      ? createThermalPdf(croppedCanvases)
      : createA4SheetPdf(croppedCanvases);

  return {
    blob,
    pageCount: croppedCanvases.length,
    detections,
  };
}

function detectCompactImageLabel(
  textItems,
  pageHeight,
  pageNumber,
  canvas,
  renderScale,
) {
  // Amazon invoices expose selectable text. The compatibility check is only
  // for image-only shipping labels, so invoices cannot enter this path.
  if (textItems.length > 0) return null;

  const analysis = analyzeCanvas(canvas);
  const isCompactLabel =
    analysis.darkPercent >= 5 &&
    analysis.denseBlocks >= 800 &&
    analysis.middleDenseBlocks >= 250 &&
    analysis.contentWidthRatio >= 0.7 &&
    analysis.contentHeightRatio >= 0.7;

  if (!isCompactLabel) return null;

  return {
    pageNumber,
    box: contentBox(analysis, pageHeight, renderScale),
    anchors: [
      'Amazon compact image label',
      'barcode/QR density',
      'text invoice excluded',
    ],
    compatibilityDetection: true,
  };
}

function analyzeCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const rowCounts = new Uint32Array(height);
  const colCounts = new Uint32Array(width);
  const blockSize = Math.max(16, Math.round(width / 85));
  let denseBlocks = 0;
  let middleDenseBlocks = 0;
  let darkPixels = 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      const pixelLuma = luma(data, index);
      if (pixelLuma < 90) darkPixels += 1;
      if (pixelLuma < 210) {
        rowCounts[y] += 1;
        colCounts[x] += 1;
      }
    }
  }

  for (let y = 0; y <= height - blockSize; y += blockSize) {
    for (let x = 0; x <= width - blockSize; x += blockSize) {
      let blockDark = 0;

      for (let by = 0; by < blockSize; by += 1) {
        const rowStart = ((y + by) * width + x) * 4;
        for (let bx = 0; bx < blockSize; bx += 1) {
          if (luma(data, rowStart + bx * 4) < 90) blockDark += 1;
        }
      }

      if (blockDark / (blockSize * blockSize) > 0.22) {
        denseBlocks += 1;
        if (height * 0.35 <= y && y <= height * 0.68) {
          middleDenseBlocks += 1;
        }
      }
    }
  }

  const minPixels = Math.max(5, Math.round(width * 0.004));
  const horizontalBounds = findBounds(colCounts, minPixels);
  const verticalBounds = findBounds(rowCounts, minPixels);

  return {
    data,
    width,
    height,
    rowCounts,
    colCounts,
    darkPercent: (darkPixels / (width * height)) * 100,
    denseBlocks,
    middleDenseBlocks,
    minX: horizontalBounds.min,
    maxX: horizontalBounds.max,
    minY: verticalBounds.min,
    maxY: verticalBounds.max,
    contentWidthRatio:
      horizontalBounds.min === -1
        ? 0
        : (horizontalBounds.max - horizontalBounds.min + 1) / width,
    contentHeightRatio:
      verticalBounds.min === -1
        ? 0
        : (verticalBounds.max - verticalBounds.min + 1) / height,
  };
}

function findBounds(counts, threshold) {
  let min = -1;
  let max = -1;

  for (let index = 0; index < counts.length; index += 1) {
    if (counts[index] > threshold) {
      if (min === -1) min = index;
      max = index;
    }
  }

  return { min, max };
}

function contentBox(analysis, pageHeight, renderScale) {
  const { width, height, minX, maxX, minY, maxY } = analysis;
  if (minX === -1 || minY === -1) {
    throw new UnsupportedLabelFormat('Could not find compact Amazon label content.');
  }

  const pad = Math.round(renderScale * 2);
  const x0 = Math.max(0, minX - pad) / renderScale;
  const top = Math.max(0, minY - pad) / renderScale;
  const x1 = Math.min(width, maxX + 1 + pad) / renderScale;
  const bottom = Math.min(
    pageHeight,
    Math.min(height, maxY + 1 + pad) / renderScale,
  );

  return {
    x0,
    top,
    x1,
    bottom,
    width: x1 - x0,
    height: bottom - top,
  };
}

function cropCanvas(fullCanvas, box, scale) {
  const sx = Math.max(0, Math.round(box.x0 * scale));
  const sy = Math.max(0, Math.round(box.top * scale));
  const width = Math.round((box.x1 - box.x0) * scale);
  const height = Math.round((box.bottom - box.top) * scale);
  const clampedWidth = Math.min(width, fullCanvas.width - sx);
  const clampedHeight = Math.min(height, fullCanvas.height - sy);

  const cropped = document.createElement('canvas');
  cropped.width = clampedWidth;
  cropped.height = clampedHeight;
  cropped
    .getContext('2d')
    .drawImage(
      fullCanvas,
      sx,
      sy,
      clampedWidth,
      clampedHeight,
      0,
      0,
      clampedWidth,
      clampedHeight,
    );

  return cropped;
}

function luma(data, index) {
  return (
    data[index] * 0.299 +
    data[index + 1] * 0.587 +
    data[index + 2] * 0.114
  );
}
