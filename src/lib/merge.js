/**
 * merge.js — PDF merge utility using pdf-lib.
 *
 * Combines multiple PDF files (in the given order) into a single output PDF.
 * Runs entirely in the browser — no server calls.
 */

import { PDFDocument } from 'pdf-lib';

/**
 * Merge multiple PDF files into one.
 *
 * @param {File[]} files  Array of File objects in desired page order.
 * @returns {Promise<Blob>}  The merged PDF as a Blob.
 */
export async function mergePdfs(files) {
  if (!files || files.length === 0) {
    throw new Error('mergePdfs: at least one file is required');
  }

  const mergedDoc = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const srcDoc = await PDFDocument.load(arrayBuffer, {
      // Ignore encryption / permission errors so we can still copy pages
      ignoreEncryption: true,
    });

    const pageIndices = srcDoc.getPageIndices();
    const copiedPages = await mergedDoc.copyPages(srcDoc, pageIndices);
    for (const page of copiedPages) {
      mergedDoc.addPage(page);
    }
  }

  const pdfBytes = await mergedDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}
