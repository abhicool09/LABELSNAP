/**
 * Output PDF generation using jsPDF.
 */

import { jsPDF } from 'jspdf';

const THERMAL_WIDTH = 288;
const THERMAL_HEIGHT = 432;
const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;

export function createThermalPdf(croppedCanvases) {
  if (!croppedCanvases.length) throw new Error('No cropped images provided');

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: [THERMAL_WIDTH, THERMAL_HEIGHT],
  });

  for (let i = 0; i < croppedCanvases.length; i++) {
    if (i > 0) doc.addPage([THERMAL_WIDTH, THERMAL_HEIGHT], 'portrait');
    drawImageFit(doc, croppedCanvases[i], 0, 0, THERMAL_WIDTH, THERMAL_HEIGHT, 6);
  }

  return doc.output('blob');
}

export function createA4SheetPdf(croppedCanvases) {
  if (!croppedCanvases.length) throw new Error('No cropped images provided');

  const cellWidth = A4_WIDTH / 2;
  const cellHeight = A4_HEIGHT / 2;
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  for (let i = 0; i < croppedCanvases.length; i++) {
    const slot = i % 4;
    if (slot === 0 && i > 0) {
      doc.addPage('a4', 'portrait');
    }

    const col = slot % 2;
    const row = Math.floor(slot / 2);
    const x = col * cellWidth;
    const y = row * cellHeight;

    drawImageFit(doc, croppedCanvases[i], x, y, cellWidth, cellHeight, 8, true);
  }

  return doc.output('blob');
}

function drawImageFit(doc, canvas, x, y, width, height, margin, alignTop = false) {
  const availW = width - margin * 2;
  const availH = height - margin * 2;
  const scale = Math.min(availW / canvas.width, availH / canvas.height);
  const drawW = canvas.width * scale;
  const drawH = canvas.height * scale;
  const drawX = x + (width - drawW) / 2;
  const drawY = alignTop ? y + margin : y + (height - drawH) / 2;

  doc.addImage(canvas.toDataURL('image/png'), 'PNG', drawX, drawY, drawW, drawH);
}
