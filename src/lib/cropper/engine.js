/**
 * engine.js — Main entry point for the LabelSnap cropper.
 *
 * Orchestrates: PDF loading → per-page detection → rendering → cropping → output.
 * Runs entirely in the browser.
 */

import { loadPdf, renderPageToCanvas, getPageRects, getPageText } from './pdf-utils.js';
import { detectFlipkartLabel, UnsupportedLabelFormat } from './flipkart.js';
import { detectMeeshoLabel } from './meesho.js';
import { detectAmazonLabel } from './amazon.js';
import { createThermalPdf, createA4SheetPdf } from './layout.js';

export { UnsupportedLabelFormat };

/** Render scale — matches Python RENDER_SCALE = 4 (288 dpi from a 72 dpi page). */
const RENDER_SCALE = 4;

// ── Marketplace → variant mapping ─────────────────────────────────────────────
const MEESHO_VARIANT_MAP = {
  meesho: 'standard',
  meesho_invoice: 'with_invoice',
  meesho_courier: 'courier',
  meesho_courier_invoice: 'courier_invoice',
};

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Crop shipping labels from a PDF.
 *
 * @param {File} file         Input PDF file.
 * @param {string} marketplace  One of: "flipkart", "meesho", "meesho_invoice",
 *                              "meesho_courier", "meesho_courier_invoice", "amazon".
 * @param {string} layout       "thermal" (4×6) or "a4" (4-up).
 * @param {(progress:{page:number,total:number})=>void} [onProgress]  Optional callback.
 * @returns {Promise<{blob:Blob, pageCount:number, detections:Array}>}
 */
export async function cropPdf(file, marketplace, layout, onProgress) {
  if (!file) throw new Error('cropPdf: file is required');
  if (!['thermal', 'a4'].includes(layout)) {
    throw new Error(`cropPdf: layout must be 'thermal' or 'a4', got '${layout}'`);
  }

  // ── 1. Load the PDF ───────────────────────────────────────────────────────
  const pdfDoc = await loadPdf(file);
  const totalPages = pdfDoc.numPages;

  if (totalPages === 0) {
    throw new UnsupportedLabelFormat('The PDF contains no pages');
  }

  const detections = [];
  const croppedCanvases = [];
  const skipReasons = [];

  // ── 2. Process each page ──────────────────────────────────────────────────
  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    if (onProgress) onProgress({ page: pageNum, total: totalPages });

    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1 });
    const pageHeight = viewport.height;

    // Extract vector rects and text. Amazon labels are often image-only, so
    // the rendered canvas is also passed to its detector.
    const rects = marketplace === 'amazon' ? [] : await getPageRects(page);
    const textItems = await getPageText(page);
    const fullCanvas = await renderPageToCanvas(page, RENDER_SCALE);

    let detection;
    try {
      detection = detectPage(marketplace, rects, textItems, pageHeight, pageNum, fullCanvas);
    } catch (err) {
      if (err instanceof UnsupportedLabelFormat) {
        console.log(`Skipping page ${pageNum}: ${err.message}`);
        skipReasons.push(err.message);
        continue;
      }
      throw err;
    }

    // A detector may return multiple boxes for one source page. Meesho invoice
    // mode uses this to output the label and invoice as separate cropped pages.
    const cropEntries = getCropEntries(detection);
    for (let cropIndex = 0; cropIndex < cropEntries.length; cropIndex++) {
      const entry = cropEntries[cropIndex];
      const cropDetection = {
        ...detection,
        box: entry.box,
        cropIndex,
        cropType: entry.type,
      };
      delete cropDetection.boxes;

      detections.push(cropDetection);

      const cropped = cropCanvas(fullCanvas, entry.box, RENDER_SCALE);
      croppedCanvases.push(cropped);
    }
  }

  if (croppedCanvases.length === 0) {
    throw new UnsupportedLabelFormat(`No labels detected. Info: ${skipReasons.join(' | ')}`);
  }

  // ── 3. Generate output PDF ────────────────────────────────────────────────
  const blob =
    layout === 'thermal'
      ? createThermalPdf(croppedCanvases)
      : createA4SheetPdf(croppedCanvases);

  return { blob, pageCount: croppedCanvases.length, detections };
}

// ── Internal helpers ──────────────────────────────────────────────────────────

function getCropEntries(detection) {
  if (Array.isArray(detection.boxes) && detection.boxes.length > 0) {
    return detection.boxes.map((entry) => {
      if (entry.box) return entry;
      return { type: entry.type || 'label', box: entry };
    });
  }

  return [{ type: detection.cropType || 'label', box: detection.box }];
}

/**
 * Route to the correct detector based on marketplace string.
 */
function detectPage(marketplace, rects, textItems, pageHeight, pageNumber, fullCanvas) {
  switch (marketplace) {
    case 'flipkart':
      return detectFlipkartLabel(rects, textItems, pageHeight, pageNumber);

    case 'meesho':
    case 'meesho_invoice':
    case 'meesho_courier':
    case 'meesho_courier_invoice': {
      const variant = MEESHO_VARIANT_MAP[marketplace];
      return detectMeeshoLabel(rects, textItems, pageHeight, pageNumber, variant);
    }

    case 'amazon':
      return detectAmazonLabel(textItems, pageHeight, pageNumber, fullCanvas, RENDER_SCALE);

    default:
      throw new Error(`Unsupported marketplace: ${marketplace}`);
  }
}

/**
 * Crop a region from a full-page canvas.
 *
 * Matches the Python `_render_crop` logic: scale the box coordinates by
 * RENDER_SCALE, then extract the sub-image.
 *
 * @param {HTMLCanvasElement} fullCanvas  Full-page render at RENDER_SCALE.
 * @param {{x0:number,top:number,x1:number,bottom:number}} box  CropBox in points (top-left origin).
 * @param {number} scale  The render scale used for fullCanvas.
 * @returns {HTMLCanvasElement}  New canvas containing only the cropped label.
 */
function cropCanvas(fullCanvas, box, scale) {
  const sx = Math.round(box.x0 * scale);
  const sy = Math.round(box.top * scale);
  const sw = Math.round((box.x1 - box.x0) * scale);
  const sh = Math.round((box.bottom - box.top) * scale);

  // Clamp to canvas bounds
  const clampedW = Math.min(sw, fullCanvas.width - sx);
  const clampedH = Math.min(sh, fullCanvas.height - sy);

  const cropped = document.createElement('canvas');
  cropped.width = clampedW;
  cropped.height = clampedH;

  const ctx = cropped.getContext('2d');
  ctx.drawImage(fullCanvas, sx, sy, clampedW, clampedH, 0, 0, clampedW, clampedH);
  return cropped;
}
