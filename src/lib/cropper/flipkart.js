/**
 * flipkart.js — Flipkart shipping-label detection.
 *
 * Detects the bordered Flipkart label rectangle and verifies text anchors.
 *
 * Coordinate convention: top-left origin (same as pdfplumber / pdf-utils.js).
 */

import { getTextInBox } from './pdf-utils.js';

// ── Anchor strings (must appear inside the label border) ──────────────────────
const FLIPKART_ANCHORS = [
  'STD',
  'E-Kart Logistics',
  'AWB',
  'Shipping/Customer address',
  'SKU',
  'Not for resale',
];

const REQUIRED_ANCHORS = new Set([
  'STD',
  'E-Kart Logistics',
  'AWB',
  'Shipping/Customer address',
  'SKU',
]);

// ── Detection ─────────────────────────────────────────────────────────────────

/**
 * Detect the Flipkart shipping-label rectangle on a single page.
 *
 * @param {Array<{x0:number,top:number,x1:number,bottom:number,width:number,height:number}>} rects
 * @param {Array<{str:string,x0:number,top:number,x1:number,bottom:number}>} textItems
 * @param {number} pageHeight  Page height in points (for reference / messages).
 * @param {number} pageNumber  1-based page number.
 * @returns {{ pageNumber:number, box:{x0:number,top:number,x1:number,bottom:number,width:number,height:number}, anchors:string[] }}
 * @throws {UnsupportedLabelFormat}
 */
export function detectFlipkartLabel(rects, textItems, pageHeight, pageNumber) {
  // ── Step 1: classify lines ────────────────────────────────────────────────
  const verticals = [];
  const horizontals = [];

  for (const r of rects) {
    const w = r.width;
    const h = r.height;

    // Vertical border lines  (Python: width <= 2, 320 <= height <= 380, top <= 90)
    if (w <= 2.0 && h >= 320 && h <= 380 && r.top <= 90) {
      verticals.push(r);
    }

    // Horizontal border lines (Python: height <= 2, 190 <= width <= 240, top <= 410)
    if (h <= 2.0 && w >= 190 && w <= 240 && r.top <= 410) {
      horizontals.push(r);
    }
  }

  // ── Step 2: pair verticals to form box candidates ─────────────────────────
  /** @type {Array<{x0:number,top:number,x1:number,bottom:number,width:number,height:number}>} */
  const candidates = [];

  for (const left of verticals) {
    for (const right of verticals) {
      // right must be to the right of left
      if (right.x0 <= left.x0) continue;

      const sameTop = Math.abs(left.top - right.top) <= 2;
      const sameBottom = Math.abs(left.bottom - right.bottom) <= 2;
      if (!(sameTop && sameBottom)) continue;

      const labelWidth = right.x1 - left.x0;
      const labelHeight =
        Math.max(left.bottom, right.bottom) - Math.min(left.top, right.top);

      // Python: 200 <= label_width <= 230 and 330 <= label_height <= 370
      if (!(labelWidth >= 200 && labelWidth <= 230 && labelHeight >= 330 && labelHeight <= 370))
        continue;

      const box = {
        x0: left.x0,
        top: Math.min(left.top, right.top),
        x1: right.x1,
        bottom: Math.max(left.bottom, right.bottom),
      };
      box.width = box.x1 - box.x0;
      box.height = box.bottom - box.top;

      // Verify matching horizontal lines at box top and bottom
      const hasTop = hasMatchingHorizontal(horizontals, box, box.top);
      const hasBottom = hasMatchingHorizontal(horizontals, box, box.bottom);
      if (hasTop && hasBottom) {
        candidates.push(box);
      }
    }
  }

  // ── Step 3: sort candidates (top then left) and verify anchors ────────────
  candidates.sort((a, b) => a.top - b.top || a.x0 - b.x0);

  for (const box of candidates) {
    const anchors = anchorsInside(textItems, box);
    if (isFlipkartLabel(anchors)) {
      return { pageNumber, box, anchors };
    }
  }

  throw new UnsupportedLabelFormat(
    `Page ${pageNumber}: no supported Flipkart label border was detected`,
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Check whether any horizontal line matches the given y-position and spans
 * the box width (within tolerance).
 *
 * Python: abs(top - y) <= 2 or abs(bottom - y) <= 2, and
 *         x0 <= box.x0 + 3  and  x1 >= box.x1 - 3
 */
function hasMatchingHorizontal(horizontals, box, y) {
  for (const h of horizontals) {
    if (Math.abs(h.top - y) <= 2 || Math.abs(h.bottom - y) <= 2) {
      if (h.x0 <= box.x0 + 3 && h.x1 >= box.x1 - 3) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Collect anchor strings found in the text inside `box`.
 */
function anchorsInside(textItems, box) {
  const text = getTextInBox(textItems, box);
  const normalised = text.replace(/\s+/g, ' ');
  const found = [];
  for (const anchor of FLIPKART_ANCHORS) {
    if (normalised.includes(anchor)) {
      found.push(anchor);
    }
  }
  return found;
}

/**
 * Are all required Flipkart anchors present?
 */
function isFlipkartLabel(anchors) {
  const set = new Set(anchors);
  for (const req of REQUIRED_ANCHORS) {
    if (!set.has(req)) return false;
  }
  return true;
}

// ── Error class (also re-exported from engine.js) ─────────────────────────────
export class UnsupportedLabelFormat extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnsupportedLabelFormat';
  }
}
