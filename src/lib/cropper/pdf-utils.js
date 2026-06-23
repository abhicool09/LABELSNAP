/**
 * pdf-utils.js — PDF reading, rendering, rect & text extraction via pdfjs-dist.
 *
 * pdfjs uses a bottom-left coordinate origin (standard PDF convention).
 * All output rectangles and text positions are converted to a top-left
 * origin so they match the coordinate system used by the Python cropper
 * (pdfplumber convention): top = 0 is the top of the page.
 */

import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

// ── Worker setup ──────────────────────────────────────────────────────────────
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Load a PDF from a File / Blob / ArrayBuffer.
 * @param {File|Blob|ArrayBuffer} source
 * @returns {Promise<import('pdfjs-dist').PDFDocumentProxy>}
 */
export async function loadPdf(source) {
  let data;
  if (source instanceof ArrayBuffer) {
    data = source;
  } else if (source instanceof Blob || source instanceof File) {
    data = await source.arrayBuffer();
  } else {
    throw new Error('loadPdf: unsupported source type');
  }
  // pdfjs wants a *copy* so it can transfer ownership
  return pdfjsLib.getDocument({ data: new Uint8Array(data) }).promise;
}

/**
 * Render a single PDF page to an off-screen canvas.
 * @param {import('pdfjs-dist').PDFPageProxy} page
 * @param {number} scale  Render scale factor (default 4 = 288 dpi for a 72 dpi page)
 * @returns {Promise<HTMLCanvasElement>}
 */
export async function renderPageToCanvas(page, scale = 4) {
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(viewport.width);
  canvas.height = Math.round(viewport.height);
  const ctx = canvas.getContext('2d');
  await page.render({ canvasContext: ctx, viewport }).promise;
  return canvas;
}

/**
 * Extract vector rectangles drawn on the page.
 *
 * Walks the operator list produced by pdfjs looking for `constructPath`
 * operations that contain rectangle (`re`) sub-operators.  Each rect is
 * returned in top-left coordinates {x0, top, x1, bottom, width, height}.
 *
 * @param {import('pdfjs-dist').PDFPageProxy} page
 * @returns {Promise<Array<{x0:number,top:number,x1:number,bottom:number,width:number,height:number}>>}
 */
export async function getPageRects(page) {
  const opList = await page.getOperatorList();
  const viewport = page.getViewport({ scale: 1 });
  const pageHeight = viewport.height;

  const OPS = pdfjsLib.OPS;
  const rects = [];

  // The current transformation matrix stack.  pdfjs emits setTransform /
  // transform / save / restore operators that we must track so we can map
  // path coordinates back to page space.
  let ctmStack = [];
  let ctm = [1, 0, 0, 1, 0, 0]; // identity

  for (let i = 0; i < opList.fnArray.length; i++) {
    const fn = opList.fnArray[i];
    const args = opList.argsArray[i];

    // -- CTM management -------------------------------------------------------
    if (fn === OPS.save) {
      ctmStack.push(ctm.slice());
      continue;
    }
    if (fn === OPS.restore) {
      ctm = ctmStack.pop() || [1, 0, 0, 1, 0, 0];
      continue;
    }
    if (fn === OPS.transform) {
      // args = [a, b, c, d, e, f]  — multiply current CTM
      ctm = multiplyMatrices(ctm, args);
      continue;
    }

    // -- Path construction ----------------------------------------------------
    if (fn === OPS.constructPath) {
      // args = [ opsArray, argsArray, minMax ]
      const subOps = args[0];  // e.g. [OPS.rectangle] or [OPS.moveTo, OPS.lineTo, …]
      const subArgs = args[1]; // flat list of coordinates consumed by the sub-ops

      let argIdx = 0;
      for (let s = 0; s < subOps.length; s++) {
        const subOp = subOps[s];

        if (subOp === OPS.rectangle) {
          // rectangle consumes 4 values: x, y, w, h (in user space)
          const rx = subArgs[argIdx++];
          const ry = subArgs[argIdx++];
          const rw = subArgs[argIdx++];
          const rh = subArgs[argIdx++];

          // Apply CTM
          const [px, py] = applyMatrix(ctm, rx, ry);
          const [px2, py2] = applyMatrix(ctm, rx + rw, ry + rh);

          // Normalise so x0 < x1 and ensure proper top/bottom
          const x0 = Math.min(px, px2);
          const x1 = Math.max(px, px2);
          const yBottom = Math.min(py, py2); // bottom in PDF coords (lower y)
          const yTop = Math.max(py, py2);    // top in PDF coords (higher y)

          // Convert to top-left origin
          const top = pageHeight - yTop;
          const bottom = pageHeight - yBottom;

          const width = Math.abs(x1 - x0);
          const height = Math.abs(bottom - top);

          rects.push({ x0, top, x1, bottom, width, height });
        } else if (subOp === OPS.moveTo) {
          argIdx += 2; // skip x, y
        } else if (subOp === OPS.lineTo) {
          argIdx += 2;
        } else if (subOp === OPS.curveTo) {
          argIdx += 6;
        } else if (subOp === OPS.curveTo2 || subOp === OPS.curveTo3) {
          argIdx += 4;
        } else if (subOp === OPS.closePath) {
          // no args
        } else {
          // Unknown sub-op
        }
      }
    } else if (fn === OPS.paintImageXObject || fn === OPS.paintJpegXObject) {
      // The image is drawn into the unit square [0, 0, 1, 1] transformed by the CTM.
      const [px0, py0] = applyMatrix(ctm, 0, 0);
      const [px1, py1] = applyMatrix(ctm, 1, 1);

      const x0 = Math.min(px0, px1);
      const x1 = Math.max(px0, px1);
      const yBottom = Math.min(py0, py1); 
      const yTop = Math.max(py0, py1);

      const top = pageHeight - yTop;
      const bottom = pageHeight - yBottom;
      const width = x1 - x0;
      const height = bottom - top;

      rects.push({ x0, top, x1, bottom, width, height, isImage: true });
    }
  }

  return rects;
}

/**
 * Extract text items with positions (top-left origin).
 *
 * Each item: { str, x0, top, x1, bottom, width, height }
 *
 * @param {import('pdfjs-dist').PDFPageProxy} page
 * @returns {Promise<Array<{str:string,x0:number,top:number,x1:number,bottom:number,width:number,height:number}>>}
 */
export async function getPageText(page) {
  const content = await page.getTextContent();
  const viewport = page.getViewport({ scale: 1 });
  const pageHeight = viewport.height;
  const items = [];

  for (const item of content.items) {
    if (!item.str || item.str.trim() === '') continue;

    // item.transform = [scaleX, skewY, skewX, scaleY, translateX, translateY]
    const tx = item.transform[4];
    const ty = item.transform[5];
    const w = item.width;
    const h = item.height;

    const x0 = tx;
    const x1 = tx + w;
    // ty is the baseline in bottom-left coords; top of text ≈ ty + h
    const top = pageHeight - (ty + h);
    const bottom = pageHeight - ty;

    items.push({
      str: item.str,
      x0,
      top,
      x1,
      bottom,
      width: w,
      height: Math.abs(bottom - top),
    });
  }

  return items;
}

/**
 * Return concatenated text from items whose centres fall inside `box`.
 * @param {Array} textItems  Output of getPageText
 * @param {{x0:number,top:number,x1:number,bottom:number}} box
 * @returns {string}
 */
export function getTextInBox(textItems, box) {
  const inside = textItems.filter((t) => {
    const cx = (t.x0 + t.x1) / 2;
    const cy = (t.top + t.bottom) / 2;
    return cx >= box.x0 && cx <= box.x1 && cy >= box.top && cy <= box.bottom;
  });
  return inside.map((t) => t.str).join(' ');
}

// ── Internal helpers ──────────────────────────────────────────────────────────

/**
 * Multiply two 6-element affine matrices [a,b,c,d,e,f].
 *   | a  c  e |     | A  C  E |
 *   | b  d  f |  ×  | B  D  F |
 *   | 0  0  1 |     | 0  0  1 |
 */
function multiplyMatrices(m1, m2) {
  const [a, b, c, d, e, f] = m1;
  const [A, B, C, D, E, F] = m2;
  return [
    a * A + c * B,
    b * A + d * B,
    a * C + c * D,
    b * C + d * D,
    a * E + c * F + e,
    b * E + d * F + f,
  ];
}

/**
 * Apply a 6-element affine matrix to a point (x, y) → (x', y').
 */
function applyMatrix(m, x, y) {
  return [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
}
