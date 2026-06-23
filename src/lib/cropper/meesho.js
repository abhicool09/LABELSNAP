/**
 * Meesho label detection.
 *
 * Mirrors the proven Y-coordinate crop flow used by existing Meesho croppers:
 * read PDF text coordinates, crop the shipping label from the "Original for
 * Recipient" anchor, and optionally crop the invoice as a separate page.
 */

import { UnsupportedLabelFormat } from './flipkart.js';

const PDF_CROP_WIDTH = 800;
const LABEL_CROP_HEIGHT = 1000;

/**
 * @param {Array} rects unused, kept for the shared detector signature
 * @param {Array<{str:string,top:number,bottom:number}>} textItems
 * @param {number} pageHeight
 * @param {number} pageNumber
 * @param {"standard"|"with_invoice"|"courier"|"courier_invoice"} variant
 * @returns {{ pageNumber:number, box:object, boxes?:Array, anchors:string[] }}
 */
export function detectMeeshoLabel(rects, textItems, pageHeight, pageNumber, variant = 'standard') {
  const wantsInvoice = variant === 'with_invoice' || variant === 'courier_invoice';
  const shippingPdfY = findShippingLabelPdfY(textItems, pageHeight);

  if (shippingPdfY == null) {
    throw new UnsupportedLabelFormat(`Page ${pageNumber}: no Meesho shipping label coordinate found`);
  }

  const labelBox = buildLabelBox(shippingPdfY, pageHeight);
  const boxes = [{ type: 'label', box: labelBox }];
  const anchors = ['Meesho Y-coordinate crop', 'shipping label'];

  if (wantsInvoice) {
    const invoicePdfY = findInvoicePdfY(textItems, pageHeight);

    if (invoicePdfY != null && shippingPdfY > invoicePdfY) {
      boxes.push({ type: 'invoice', box: buildInvoiceBox(shippingPdfY, invoicePdfY, pageHeight) });
      anchors.push('invoice separate page');
    } else {
      anchors.push('invoice not found');
    }
  }

  return {
    pageNumber,
    box: labelBox,
    boxes,
    anchors,
  };
}

function findShippingLabelPdfY(textItems, pageHeight) {
  if (hasText(textItems, 'customer address')) {
    const originalForRecipient = findFirstText(textItems, 'original for recipient');
    if (originalForRecipient) return toPdfY(originalForRecipient, pageHeight);
  }

  if (hasText(textItems, 'exchange') && textItems.length > 0) {
    return toPdfY(textItems[textItems.length - 1], pageHeight) - 25;
  }

  return null;
}

function findInvoicePdfY(textItems, pageHeight) {
  const reverseCharge = findFirstText(textItems, 'tax is not payable on reverse charge basis');
  return reverseCharge ? toPdfY(reverseCharge, pageHeight) : null;
}

function buildLabelBox(shippingPdfY, pageHeight) {
  return fromPdfCropBox(
    0,
    shippingPdfY - 5,
    PDF_CROP_WIDTH,
    LABEL_CROP_HEIGHT,
    pageHeight,
    'label'
  );
}

function buildInvoiceBox(shippingPdfY, invoicePdfY, pageHeight) {
  return fromPdfCropBox(
    0,
    invoicePdfY - 30,
    PDF_CROP_WIDTH,
    shippingPdfY - invoicePdfY + 45,
    pageHeight,
    'invoice'
  );
}

function fromPdfCropBox(x, y, width, height, pageHeight, type) {
  const y0 = clamp(y, 0, pageHeight);
  const y1 = clamp(y + height, 0, pageHeight);
  const top = pageHeight - y1;
  const bottom = pageHeight - y0;
  const x0 = Math.max(0, x);
  const x1 = Math.max(x0, x + width);
  const box = {
    x0,
    top,
    x1,
    bottom,
    width: x1 - x0,
    height: bottom - top,
  };

  if (box.width <= 0 || box.height <= 0) {
    throw new UnsupportedLabelFormat(`Invalid Meesho ${type} crop dimensions`);
  }

  return box;
}

function toPdfY(item, pageHeight) {
  return pageHeight - item.bottom;
}

function hasText(textItems, needle) {
  return Boolean(findFirstText(textItems, needle));
}

function findFirstText(textItems, needle) {
  const lowerNeedle = needle.toLowerCase();
  return textItems.find((item) => normalize(item.str).includes(lowerNeedle)) || null;
}

function normalize(text) {
  return String(text || '').trim().toLowerCase();
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
