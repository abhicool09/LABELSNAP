import React, { useEffect, useMemo, useRef, useState } from 'react';
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';
import SEO from '../components/SEO';
import { downloadBlob } from '../lib/label-tools';

const STORAGE_KEY = 'labelsnap:studio-layouts:v2';
const VARIABLES = ['brand', 'product', 'item', 'size', 'color', 'price', 'sku', 'address'];
const VARIABLE_LABELS = {
  brand: 'Brand',
  product: 'Product',
  item: 'Item name',
  size: 'Size',
  color: 'Color',
  price: 'Price',
  sku: 'SKU / Barcode',
  address: 'Address',
};
const CSV_HEADERS = ['brand', 'product', 'item', 'size', 'color', 'price', 'sku', 'address', 'qr'];
const SYMBOLS = {
  fragile: { glyph: '♢', label: 'Fragile' },
  dry: { glyph: '☂', label: 'Keep Dry' },
  care: { glyph: '!', label: 'Handle Care' },
  up: { glyph: '↑↑', label: 'This Way Up' },
  package: { glyph: '▣', label: 'Standard Package' },
};

const DEFAULT_CANVAS = {
  width: 50,
  height: 25,
  margins: { top: 1, right: 1, bottom: 1, left: 1 },
  snap: true,
};

const DEFAULT_PREVIEW_DATA = {
  brand: 'AI Label Cropper',
  product: 'Premium Thermal Labels',
  item: 'Shipping Label Roll',
  size: '4 × 6 inch',
  color: 'White',
  price: '499',
  sku: 'LS-4X6-100',
  address: '12 Market Road, Pune, Maharashtra 411001',
  qr: 'https://labelsnap.vercel.app',
};

function uid() {
  return crypto.randomUUID();
}

function element(type, overrides = {}) {
  const defaults = {
    id: uid(),
    type,
    x: 3,
    y: 3,
    width: 20,
    height: 6,
    value: 'New Text',
    color: '#111111',
    fill: 'transparent',
    fontFamily: 'Arial',
    fontSize: 10,
    bold: false,
    italic: false,
    align: 'center',
    lineHeight: 1.1,
    letterSpacing: 0,
    rotation: 0,
    locked: false,
    z: 1,
    shape: 'rectangle',
    barcodeFormat: 'CODE128',
    image: '',
    qrLogo: '',
  };
  if (type === 'address') Object.assign(defaults, { value: '{{address}}', width: 28, height: 10, fontSize: 6, align: 'left' });
  if (type === 'price') Object.assign(defaults, { value: '₹ {{price}}', width: 15, height: 6, fontSize: 12, bold: true });
  if (type === 'barcode') Object.assign(defaults, { value: '{{sku}}', width: 32, height: 11, y: 12 });
  if (type === 'qr') Object.assign(defaults, { value: '{{qr}}', width: 12, height: 12, x: 35, y: 10 });
  if (type === 'image') Object.assign(defaults, { width: 14, height: 8, value: '' });
  if (type === 'shape') Object.assign(defaults, { width: 18, height: 8, fill: '#eaf4ff', color: '#0070f3' });
  if (type === 'symbol') Object.assign(defaults, { value: 'fragile', width: 12, height: 12, fontSize: 12, bold: true });
  if (type === 'bracket') Object.assign(defaults, { value: '[ ]', width: 12, height: 9, fontSize: 20 });
  return { ...defaults, ...overrides };
}

function starterDesign() {
  return {
    canvas: { ...DEFAULT_CANVAS, margins: { ...DEFAULT_CANVAS.margins } },
    elements: [
      element('text', { value: '{{brand}}', x: 3, y: 2.5, width: 30, height: 4, fontSize: 8, bold: true, align: 'left', color: '#0070f3' }),
      element('text', { value: '{{product}}', x: 3, y: 7, width: 29, height: 5, fontSize: 10, bold: true, align: 'left' }),
      element('barcode', { value: '{{sku}}', x: 3, y: 13, width: 30, height: 9 }),
      element('price', { value: '₹ {{price}}', x: 35, y: 3, width: 12, height: 7 }),
      element('qr', { value: '{{qr}}', x: 36, y: 11, width: 10, height: 10 }),
    ],
  };
}

export function parseStudioCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (char === '"' && quoted && next === '"') {
      field += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === ',' && !quoted) {
      row.push(field);
      field = '';
    } else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && next === '\n') index += 1;
      row.push(field);
      if (row.some((value) => value.trim())) rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }
  row.push(field);
  if (row.some((value) => value.trim())) rows.push(row);
  if (rows.length < 2) throw new Error('CSV needs a header row and at least one data row.');
  const headers = rows[0].map((value) => value.trim().toLowerCase());
  return rows.slice(1).map((values) => Object.fromEntries(CSV_HEADERS.map((header) => {
    const position = headers.indexOf(header);
    return [header, position >= 0 ? String(values[position] || '').trim() : ''];
  })));
}

function escapeCsv(value) {
  const text = String(value ?? '');
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function resolveValue(value, data) {
  return String(value || '').replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] ?? `{{${key}}}`);
}

function hexToRgb(hex) {
  const match = String(hex).match(/^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  return match ? match.slice(1).map((part) => Number.parseInt(part, 16)) : [0, 0, 0];
}

function BarcodeVisual({ item, data }) {
  const ref = useRef(null);
  const value = resolveValue(item.value, data);
  useEffect(() => {
    if (!ref.current) return;
    try {
      JsBarcode(ref.current, value || 'SKU-12345', {
        format: item.barcodeFormat,
        height: 42,
        width: 1.5,
        margin: 1,
        displayValue: true,
        fontSize: 10,
        lineColor: item.color,
        background: item.fill === 'transparent' ? '#ffffff' : item.fill,
      });
    } catch {
      ref.current.innerHTML = '';
    }
  }, [value, item.barcodeFormat, item.color, item.fill]);
  return <svg ref={ref} />;
}

function QrVisual({ item, data }) {
  const [source, setSource] = useState('');
  const value = resolveValue(item.value, data);
  useEffect(() => {
    QRCode.toDataURL(value || 'https://labelsnap.vercel.app', {
      width: 260,
      margin: 1,
      errorCorrectionLevel: item.qrLogo ? 'H' : 'M',
      color: { dark: item.color, light: item.fill === 'transparent' ? '#ffffff' : item.fill },
    }).then(setSource).catch(() => setSource(''));
  }, [value, item.color, item.fill, item.qrLogo]);
  return (
    <span className="architect-qr">
      {source && <img src={source} alt="QR code" />}
      {item.qrLogo && <img className="architect-qr__logo" src={item.qrLogo} alt="" />}
    </span>
  );
}

function CanvasElement({ item, canvas, data, selected, zoom, onSelect, onDragStart }) {
  const style = {
    left: `${(item.x / canvas.width) * 100}%`,
    top: `${(item.y / canvas.height) * 100}%`,
    width: `${(item.width / canvas.width) * 100}%`,
    height: `${(item.height / canvas.height) * 100}%`,
    zIndex: item.z,
    transform: `rotate(${item.rotation}deg)`,
    color: item.color,
    background: item.fill,
    fontFamily: item.fontFamily,
    fontSize: `${Math.max(5, item.fontSize)}px`,
    fontWeight: item.bold ? 800 : 400,
    fontStyle: item.italic ? 'italic' : 'normal',
    textAlign: item.align,
    lineHeight: item.lineHeight,
    letterSpacing: `${item.letterSpacing}px`,
  };
  let content;
  if (item.type === 'barcode') content = <BarcodeVisual item={item} data={data} />;
  else if (item.type === 'qr') content = <QrVisual item={item} data={data} />;
  else if (item.type === 'image') content = item.image ? <img src={item.image} alt="Uploaded logo" /> : <span>Logo</span>;
  else if (item.type === 'shape') content = <span className={`architect-shape architect-shape--${item.shape}`} />;
  else if (item.type === 'symbol') content = <span className="architect-symbol"><b>{SYMBOLS[item.value]?.glyph}</b><small>{SYMBOLS[item.value]?.label}</small></span>;
  else content = resolveValue(item.value, data);

  return (
    <button
      type="button"
      className={`architect-element architect-element--${item.type}${selected ? ' selected' : ''}${item.locked ? ' locked' : ''}`}
      style={style}
      onPointerDown={(event) => {
        event.stopPropagation();
        onSelect(item.id);
        if (!item.locked) onDragStart(event, item);
      }}
      onClick={(event) => event.stopPropagation()}
      aria-label={`${item.type} element`}
    >
      {content}
      {selected && <span className="architect-element__size">{item.width.toFixed(1)} × {item.height.toFixed(1)} mm</span>}
    </button>
  );
}

async function readImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read the image.'));
    reader.readAsDataURL(file);
  });
}

async function barcodeImage(item, value) {
  const canvas = document.createElement('canvas');
  JsBarcode(canvas, value || 'SKU-12345', {
    format: item.barcodeFormat,
    height: 70,
    width: 2,
    margin: 2,
    displayValue: true,
    fontSize: 15,
    lineColor: item.color,
    background: item.fill === 'transparent' ? '#ffffff' : item.fill,
  });
  return canvas.toDataURL('image/png');
}

export default function LabelStudio() {
  const canvasRef = useRef(null);
  const logoRef = useRef(null);
  const qrLogoRef = useRef(null);
  const csvRef = useRef(null);
  const dragRef = useRef(null);
  const [design, setDesign] = useState(starterDesign);
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const [selectedId, setSelectedId] = useState(design.elements[0]?.id || null);
  const [zoom, setZoom] = useState(1);
  const [architectPrompt, setArchitectPrompt] = useState('');
  const [gap, setGap] = useState(2);
  const [layoutName, setLayoutName] = useState('My label layout');
  const [showOpen, setShowOpen] = useState(false);
  const [showPrint, setShowPrint] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [copies, setCopies] = useState(1);
  const [dataRows, setDataRows] = useState([]);
  const [previewData, setPreviewData] = useState(DEFAULT_PREVIEW_DATA);
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(false);

  const selected = design.elements.find((item) => item.id === selectedId) || null;
  const canvasData = dataRows[0] || previewData;

  const commit = (recipe) => {
    setDesign((current) => {
      const next = typeof recipe === 'function' ? recipe(current) : recipe;
      setHistory((items) => [...items.slice(-49), current]);
      setFuture([]);
      return next;
    });
  };

  const undo = () => {
    if (!history.length) return;
    const previous = history[history.length - 1];
    setFuture((items) => [design, ...items].slice(0, 50));
    setHistory((items) => items.slice(0, -1));
    setDesign(previous);
    setSelectedId(previous.elements[0]?.id || null);
  };

  const redo = () => {
    if (!future.length) return;
    const next = future[0];
    setHistory((items) => [...items, design].slice(-50));
    setFuture((items) => items.slice(1));
    setDesign(next);
    setSelectedId(next.elements[0]?.id || null);
  };

  const updateSelected = (patch) => {
    if (!selectedId) return;
    commit((current) => ({
      ...current,
      elements: current.elements.map((item) => item.id === selectedId ? { ...item, ...patch } : item),
    }));
  };

  const insertVariable = (variable) => {
    if (!selected) return;
    const token = `{{${variable}}}`;
    const current = selected.value || '';
    const isOnlyVariable = /^\{\{\w+\}\}$/.test(current.trim());
    const next = !current.trim() || isOnlyVariable
      ? token
      : `${current}${/\s$/.test(current) ? '' : ' '}${token}`;
    updateSelected({ value: next });
  };

  const addElement = (type, overrides = {}) => {
    const next = element(type, { z: design.elements.length + 1, ...overrides });
    commit((current) => ({ ...current, elements: [...current.elements, next] }));
    setSelectedId(next.id);
  };

  const removeSelected = () => {
    if (!selectedId) return;
    commit((current) => ({ ...current, elements: current.elements.filter((item) => item.id !== selectedId) }));
    setSelectedId(null);
  };

  const duplicateSelected = () => {
    if (!selected) return;
    const copy = { ...selected, id: uid(), x: selected.x + 1, y: selected.y + 1, z: design.elements.length + 1 };
    commit((current) => ({ ...current, elements: [...current.elements, copy] }));
    setSelectedId(copy.id);
  };

  const beginDrag = (event, item) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    setHistory((items) => [...items.slice(-49), design]);
    setFuture([]);
    dragRef.current = { id: item.id, startX: event.clientX, startY: event.clientY, x: item.x, y: item.y, rect };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  useEffect(() => {
    const move = (event) => {
      const drag = dragRef.current;
      if (!drag) return;
      const dx = ((event.clientX - drag.startX) / drag.rect.width) * design.canvas.width;
      const dy = ((event.clientY - drag.startY) / drag.rect.height) * design.canvas.height;
      const snap = design.canvas.snap ? 0.5 : 0.1;
      setDesign((current) => ({
        ...current,
        elements: current.elements.map((item) => {
          if (item.id !== drag.id) return item;
          const x = Math.max(0, Math.min(current.canvas.width - item.width, Math.round((drag.x + dx) / snap) * snap));
          const y = Math.max(0, Math.min(current.canvas.height - item.height, Math.round((drag.y + dy) / snap) * snap));
          return { ...item, x, y };
        }),
      }));
    };
    const end = () => { dragRef.current = null; };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', end);
    };
  }, [design.canvas.width, design.canvas.height, design.canvas.snap]);

  useEffect(() => {
    const keydown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        event.shiftKey ? redo() : undo();
        return;
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'y') {
        event.preventDefault();
        redo();
        return;
      }
      if (!selected || ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
      if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault();
        removeSelected();
        return;
      }
      const moves = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
      if (moves[event.key] && !selected.locked) {
        event.preventDefault();
        const increment = event.shiftKey ? 1 : (design.canvas.snap ? 0.5 : 0.1);
        const [mx, my] = moves[event.key];
        updateSelected({
          x: Math.max(0, Math.min(design.canvas.width - selected.width, selected.x + mx * increment)),
          y: Math.max(0, Math.min(design.canvas.height - selected.height, selected.y + my * increment)),
        });
      }
    };
    document.addEventListener('keydown', keydown);
    return () => document.removeEventListener('keydown', keydown);
  });

  const architect = () => {
    if (!architectPrompt.trim()) return;
    const prompt = architectPrompt.toLowerCase();
    const dimensions = prompt.match(/(\d+(?:\.\d+)?)\s*[x×]\s*(\d+(?:\.\d+)?)\s*mm/);
    const width = dimensions ? Number(dimensions[1]) : 50;
    const height = dimensions ? Number(dimensions[2]) : 30;
    const created = [
      element('text', { value: '{{brand}}', x: 3, y: 3, width: width * 0.6, height: 5, bold: true, fontSize: 9, align: 'left', color: '#0070f3' }),
      element('text', { value: '{{product}}', x: 3, y: 9, width: width * 0.6, height: 6, bold: true, fontSize: 11, align: 'left' }),
    ];
    if (/price|mrp|retail|tag/.test(prompt)) created.push(element('price', { x: width * 0.7, y: 3, width: width * 0.24, height: 7 }));
    if (/barcode|sku|product|warehouse|shoe/.test(prompt)) created.push(element('barcode', { x: 3, y: height - 12, width: width * 0.62, height: 9 }));
    if (/qr|website|upi|scan/.test(prompt)) created.push(element('qr', { x: width - 14, y: height - 14, width: 11, height: 11 }));
    if (/address|shipping|courier/.test(prompt)) created.push(element('address', { x: 3, y: 16, width: width * 0.62, height: Math.max(8, height - 29) }));
    if (/fragile/.test(prompt)) created.push(element('symbol', { value: 'fragile', x: width - 14, y: height - 14 }));
    const next = { canvas: { ...DEFAULT_CANVAS, width, height, margins: { ...DEFAULT_CANVAS.margins } }, elements: created };
    commit(next);
    setSelectedId(created[0].id);
  };

  const alignLeft = () => {
    if (!design.elements.length) return;
    const left = Math.min(...design.elements.map((item) => item.x));
    commit((current) => ({ ...current, elements: current.elements.map((item) => item.locked ? item : { ...item, x: left }) }));
  };

  const distribute = () => {
    const movable = [...design.elements].filter((item) => !item.locked).sort((a, b) => a.y - b.y);
    if (movable.length < 2) return;
    const start = movable[0].y;
    commit((current) => ({
      ...current,
      elements: current.elements.map((item) => {
        const index = movable.findIndex((candidate) => candidate.id === item.id);
        return index >= 0 ? { ...item, y: Math.min(current.canvas.height - item.height, start + index * gap) } : item;
      }),
    }));
  };

  const saveLayout = () => {
    const layouts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    layouts[layoutName.trim() || 'Untitled layout'] = design;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(layouts));
    setShowOpen(false);
  };

  const savedLayouts = useMemo(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
  }, [showOpen]);

  const loadLayout = (name) => {
    if (!savedLayouts[name]) return;
    commit(savedLayouts[name]);
    setLayoutName(name);
    setSelectedId(savedLayouts[name].elements[0]?.id || null);
    setShowOpen(false);
  };

  const resetLayout = () => {
    const next = starterDesign();
    commit(next);
    setSelectedId(next.elements[0]?.id || null);
    setLayoutName('My label layout');
  };

  const importCsv = async (file) => {
    try {
      setDataRows(parseStudioCsv(await file.text()));
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const downloadSample = () => {
    const sample = [
      CSV_HEADERS.join(','),
      ['AI Label Cropper', 'Thermal Label Roll', 'Shipping labels', '4x6', 'White', '499', 'LS-4X6-100', '12 Market Road Pune', 'https://labelsnap.vercel.app'].map(escapeCsv).join(','),
    ].join('\n');
    downloadBlob(new Blob([sample], { type: 'text/csv;charset=utf-8' }), 'ai-label-cropper-spooler-sample.csv');
  };

  const drawLabel = async (pdf, offsetX, offsetY, data) => {
    for (const item of [...design.elements].sort((a, b) => a.z - b.z)) {
      const x = offsetX + item.x;
      const y = offsetY + item.y;
      const [r, g, b] = hexToRgb(item.color);
      const [fr, fg, fb] = item.fill === 'transparent' ? [255, 255, 255] : hexToRgb(item.fill);
      if (item.fill !== 'transparent') {
        pdf.setFillColor(fr, fg, fb);
        pdf.rect(x, y, item.width, item.height, 'F');
      }
      if (item.type === 'barcode') {
        const source = await barcodeImage(item, resolveValue(item.value, data));
        pdf.addImage(source, 'PNG', x, y, item.width, item.height);
      } else if (item.type === 'qr') {
        const source = await QRCode.toDataURL(resolveValue(item.value, data) || 'https://labelsnap.vercel.app', { width: 300, margin: 1, errorCorrectionLevel: item.qrLogo ? 'H' : 'M', color: { dark: item.color, light: item.fill === 'transparent' ? '#ffffff' : item.fill } });
        pdf.addImage(source, 'PNG', x, y, item.width, item.height);
        if (item.qrLogo) pdf.addImage(item.qrLogo, item.qrLogo.startsWith('data:image/jpeg') ? 'JPEG' : 'PNG', x + item.width * 0.34, y + item.height * 0.34, item.width * 0.32, item.height * 0.32);
      } else if (item.type === 'image' && item.image) {
        pdf.addImage(item.image, item.image.startsWith('data:image/jpeg') ? 'JPEG' : 'PNG', x, y, item.width, item.height);
      } else if (item.type === 'shape') {
        pdf.setDrawColor(r, g, b);
        pdf.setFillColor(fr, fg, fb);
        const style = item.fill === 'transparent' ? 'S' : 'FD';
        if (item.shape === 'circle') pdf.ellipse(x + item.width / 2, y + item.height / 2, item.width / 2, item.height / 2, style);
        else if (item.shape === 'triangle') pdf.triangle(x + item.width / 2, y, x, y + item.height, x + item.width, y + item.height, style);
        else if (item.shape === 'separator') pdf.line(x, y + item.height / 2, x + item.width, y + item.height / 2);
        else pdf.roundedRect(x, y, item.width, item.height, 1, 1, style);
      } else {
        const value = item.type === 'symbol' ? `${SYMBOLS[item.value]?.glyph || ''} ${SYMBOLS[item.value]?.label || ''}` : resolveValue(item.value, data);
        pdf.setTextColor(r, g, b);
        pdf.setFont('helvetica', item.bold ? 'bold' : item.italic ? 'italic' : 'normal');
        pdf.setFontSize(item.fontSize);
        pdf.text(value || ' ', x + (item.align === 'left' ? 0 : item.align === 'right' ? item.width : item.width / 2), y + Math.min(item.height, item.fontSize * 0.36), {
          align: item.align,
          angle: item.rotation,
          maxWidth: item.width,
          lineHeightFactor: item.lineHeight,
        });
      }
    }
  };

  const generate = async () => {
    setGenerating(true);
    setError('');
    try {
      const rows = dataRows.length ? dataRows : Array.from({ length: Math.max(1, copies) }, () => previewData);
      const sheetMargin = 5;
      const columns = Math.max(1, Math.floor((210 - sheetMargin * 2 + gap) / (design.canvas.width + gap)));
      const rowsPerSheet = Math.max(1, Math.floor((297 - sheetMargin * 2 + gap) / (design.canvas.height + gap)));
      const capacity = columns * rowsPerSheet;
      const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
      for (let index = 0; index < rows.length; index += 1) {
        if (index > 0 && index % capacity === 0) pdf.addPage('a4', 'portrait');
        const slot = index % capacity;
        const column = slot % columns;
        const row = Math.floor(slot / columns);
        await drawLabel(pdf, sheetMargin + column * (design.canvas.width + gap), sheetMargin + row * (design.canvas.height + gap), rows[index]);
      }
      pdf.save('ai-label-cropper-studio-print-session.pdf');
      setShowPrint(false);
    } catch (err) {
      setError(err.message || 'Could not generate the print session.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="architect-page">
      <SEO title="AI Label Cropper AI Studio — Custom Label Designer" description="Design custom labels on a precise millimetre canvas with text, logos, barcodes, QR codes, CSV variables and A4 bulk printing." canonicalPath="/ai-label-studio" />

      <header className="architect-topbar">
        <div className="architect-brand">
          <span className="architect-brand__mark">✦</span>
          <div><strong>AI Label Cropper Studio</strong><small>Precision Label Designer</small></div>
        </div>
        <div className="architect-file-actions">
          <button type="button" onClick={() => setShowOpen(true)}>Open</button>
          <button type="button" onClick={resetLayout}>New layout</button>
          <button type="button" onClick={undo} disabled={!history.length}>Undo</button>
          <button type="button" onClick={redo} disabled={!future.length}>Redo</button>
        </div>
        <div className="architect-primary-actions">
          <button type="button" onClick={() => setShowGuide(true)}>Guide</button>
          <button type="button" onClick={saveLayout}>Save</button>
          <button className="btn-primary" type="button" onClick={() => setShowPrint(true)}>Print spooler</button>
        </div>
      </header>

      <div className="architect-workspace">
        <aside className="architect-sidebar">
          <section className="architect-smart">
            <span>Smart Canvas Architect</span>
            <textarea value={architectPrompt} onChange={(event) => setArchitectPrompt(event.target.value)} placeholder="e.g. 50x75mm shoe tag with price, barcode and QR code" />
            <button type="button" onClick={architect} disabled={!architectPrompt.trim()}>Build layout</button>
            <small>Runs locally. Describe dimensions and the elements you need.</small>
          </section>

          <section className="architect-section">
            <h2>Layout actions</h2>
            <div className="architect-action-row">
              <button type="button" onClick={alignLeft}>Align all left</button>
              <label>Gap (mm)<input type="number" min="0" step="0.5" value={gap} onChange={(event) => setGap(Math.max(0, Number(event.target.value)))} /></label>
              <button type="button" onClick={distribute} disabled={design.elements.length < 2}>Distribute</button>
            </div>
          </section>

          <section className="architect-section">
            <h2>Tool cabinet</h2>
            <div className="architect-tools">
              <button type="button" onClick={() => addElement('text')}>T<span>Text</span></button>
              <button type="button" onClick={() => addElement('address')}>☰<span>Address</span></button>
              <button type="button" onClick={() => addElement('price')}>₹<span>Price</span></button>
              <button type="button" onClick={() => addElement('barcode')}>▥<span>Barcode</span></button>
              <button type="button" onClick={() => addElement('qr')}>▦<span>QR code</span></button>
              <button type="button" onClick={() => logoRef.current?.click()}>＋<span>Add logo</span></button>
              <button type="button" onClick={() => addElement('shape', { shape: 'rectangle' })}>□<span>Rectangle</span></button>
              <button type="button" onClick={() => addElement('shape', { shape: 'circle' })}>○<span>Circle</span></button>
              <button type="button" onClick={() => addElement('shape', { shape: 'triangle' })}>△<span>Triangle</span></button>
              <button type="button" onClick={() => addElement('shape', { shape: 'separator', height: 2 })}>—<span>Separator</span></button>
              <button type="button" onClick={() => addElement('bracket', { value: '( )' })}>( )<span>Brackets</span></button>
              <button type="button" onClick={() => addElement('symbol')}>♢<span>Symbols</span></button>
            </div>
            <input ref={logoRef} hidden type="file" accept="image/png,image/jpeg,image/webp" onChange={async (event) => {
              const file = event.target.files?.[0];
              if (file) addElement('image', { image: await readImage(file), value: file.name });
              event.target.value = '';
            }} />
          </section>

          {selected ? (
            <section className="architect-section architect-properties">
              <div className="architect-properties__head">
                <h2>{selected.type} properties</h2>
                <div>
                  <button type="button" title={selected.locked ? 'Unlock element' : 'Lock element'} onClick={() => updateSelected({ locked: !selected.locked })}>{selected.locked ? 'Unlock' : 'Lock'}</button>
                  <button type="button" title="Duplicate element" onClick={duplicateSelected}>Duplicate</button>
                  <button type="button" title="Delete element" onClick={removeSelected}>Delete</button>
                </div>
              </div>

              {!['shape', 'image', 'symbol'].includes(selected.type) && (
                <>
                  <label className="architect-value-field">
                    <span>Value / data</span>
                    <textarea value={selected.value} onChange={(event) => updateSelected({ value: event.target.value })} />
                  </label>
                  <div className="architect-resolved-preview">
                    <span>Live preview</span>
                    <strong>{resolveValue(selected.value, canvasData) || 'Empty value'}</strong>
                  </div>
                </>
              )}
              {['text', 'address', 'price', 'barcode', 'qr'].includes(selected.type) && (
                <div className="architect-variables">
                  <span className="architect-variables__label">Insert data field</span>
                  {VARIABLES.map((variable) => (
                    <button type="button" key={variable} onClick={() => insertVariable(variable)}>
                      <span>{VARIABLE_LABELS[variable]}</span>
                      <code>{`{{${variable}}}`}</code>
                    </button>
                  ))}
                </div>
              )}
              {selected.type === 'barcode' && (
                <label>Symbology<select value={selected.barcodeFormat} onChange={(event) => updateSelected({ barcodeFormat: event.target.value })}>
                  <option value="CODE128">Code 128</option><option value="EAN13">EAN-13</option><option value="EAN8">EAN-8</option><option value="UPC">UPC-A</option><option value="CODE39">Code 39</option><option value="ITF14">ITF-14</option><option value="MSI">MSI Plessey</option>
                </select></label>
              )}
              {selected.type === 'symbol' && (
                <label>Handling symbol<select value={selected.value} onChange={(event) => updateSelected({ value: event.target.value })}>{Object.entries(SYMBOLS).map(([key, symbol]) => <option value={key} key={key}>{symbol.label}</option>)}</select></label>
              )}
              {selected.type === 'bracket' && (
                <label>Bracket style<select value={selected.value} onChange={(event) => updateSelected({ value: event.target.value })}><option>( )</option><option>[ ]</option><option>{'{ }'}</option></select></label>
              )}
              {selected.type === 'qr' && (
                <>
                  <button className="architect-upload" type="button" onClick={() => qrLogoRef.current?.click()}>Upload QR center logo</button>
                  <input ref={qrLogoRef} hidden type="file" accept="image/png,image/jpeg,image/webp" onChange={async (event) => {
                    const file = event.target.files?.[0];
                    if (file) updateSelected({ qrLogo: await readImage(file) });
                    event.target.value = '';
                  }} />
                </>
              )}
              <div className="architect-field-grid">
                <label>X (mm)<input type="number" step="0.5" value={selected.x} onChange={(event) => updateSelected({ x: Number(event.target.value) })} /></label>
                <label>Y (mm)<input type="number" step="0.5" value={selected.y} onChange={(event) => updateSelected({ y: Number(event.target.value) })} /></label>
                <label>Width<input type="number" min="1" step="0.5" value={selected.width} onChange={(event) => updateSelected({ width: Math.max(1, Number(event.target.value)) })} /></label>
                <label>Height<input type="number" min="1" step="0.5" value={selected.height} onChange={(event) => updateSelected({ height: Math.max(1, Number(event.target.value)) })} /></label>
              </div>
              <div className="architect-field-grid">
                <label>Ink<input type="color" value={selected.color} onChange={(event) => updateSelected({ color: event.target.value })} /></label>
                <label>Fill<input type="color" value={selected.fill === 'transparent' ? '#ffffff' : selected.fill} onChange={(event) => updateSelected({ fill: event.target.value })} /></label>
                <label>Rotation<input type="number" min="-360" max="360" value={selected.rotation} onChange={(event) => updateSelected({ rotation: Number(event.target.value) })} /></label>
                <label>Layer<input type="number" min="0" value={selected.z} onChange={(event) => updateSelected({ z: Number(event.target.value) })} /></label>
              </div>
              {['text', 'address', 'price', 'bracket', 'symbol'].includes(selected.type) && (
                <>
                  <label>Font family<select value={selected.fontFamily} onChange={(event) => updateSelected({ fontFamily: event.target.value })}><option>Arial</option><option>Georgia</option><option>Verdana</option><option>Courier New</option><option>Times New Roman</option></select></label>
                  <div className="architect-field-grid">
                    <label>Size (pt)<input type="number" min="1" max="50" value={selected.fontSize} onChange={(event) => updateSelected({ fontSize: Number(event.target.value) })} /></label>
                    <label>Spacing<input type="number" step="0.5" value={selected.letterSpacing} onChange={(event) => updateSelected({ letterSpacing: Number(event.target.value) })} /></label>
                    <label>Line height<input type="number" min="0.5" max="3" step="0.1" value={selected.lineHeight} onChange={(event) => updateSelected({ lineHeight: Number(event.target.value) })} /></label>
                  </div>
                  <div className="architect-format-row">
                    <button className={selected.bold ? 'active' : ''} type="button" onClick={() => updateSelected({ bold: !selected.bold })}>B</button>
                    <button className={selected.italic ? 'active' : ''} type="button" onClick={() => updateSelected({ italic: !selected.italic })}><i>I</i></button>
                    {['left', 'center', 'right'].map((align) => <button className={selected.align === align ? 'active' : ''} type="button" key={align} onClick={() => updateSelected({ align })}>{align[0].toUpperCase()}</button>)}
                    {['₹', '$', '€', '£', '¥'].map((currency) => <button type="button" key={currency} onClick={() => updateSelected({ value: `${currency}${selected.value}` })}>{currency}</button>)}
                  </div>
                </>
              )}
            </section>
          ) : <section className="architect-section"><p className="architect-empty-properties">Select an element to edit its properties.</p></section>}

          <section className="architect-section">
            <details className="architect-preview-data" open>
              <summary>Live preview data</summary>
              <p>These values fill the purple data fields on the canvas. CSV rows override them during bulk printing.</p>
              <div className="architect-field-grid">
                {['brand', 'product', 'item', 'size', 'color', 'price', 'sku'].map((key) => (
                  <label key={key}>{VARIABLE_LABELS[key]}<input value={previewData[key]} onChange={(event) => setPreviewData((current) => ({ ...current, [key]: event.target.value }))} /></label>
                ))}
              </div>
              <label>Address<textarea value={previewData.address} onChange={(event) => setPreviewData((current) => ({ ...current, address: event.target.value }))} /></label>
              <label>QR data<input value={previewData.qr} onChange={(event) => setPreviewData((current) => ({ ...current, qr: event.target.value }))} /></label>
            </details>
          </section>

          <section className="architect-section">
            <h2>Canvas setup</h2>
            <div className="architect-field-grid">
              <label>Width (mm)<input type="number" min="10" max="210" value={design.canvas.width} onChange={(event) => commit((current) => ({ ...current, canvas: { ...current.canvas, width: Number(event.target.value) } }))} /></label>
              <label>Height (mm)<input type="number" min="10" max="297" value={design.canvas.height} onChange={(event) => commit((current) => ({ ...current, canvas: { ...current.canvas, height: Number(event.target.value) } }))} /></label>
            </div>
            <span className="architect-subhead">Print margins (mm)</span>
            <div className="architect-margin-grid">
              {Object.keys(design.canvas.margins).map((side) => <label key={side}>{side}<input type="number" min="0" step="0.5" value={design.canvas.margins[side]} onChange={(event) => commit((current) => ({ ...current, canvas: { ...current.canvas, margins: { ...current.canvas.margins, [side]: Number(event.target.value) } } }))} /></label>)}
            </div>
            <label className="architect-switch"><input type="checkbox" checked={design.canvas.snap} onChange={(event) => commit((current) => ({ ...current, canvas: { ...current.canvas, snap: event.target.checked } }))} /><span>Precision snap</span><small>0.5 mm movement</small></label>
          </section>
          {error && <div className="alert error"><span className="icon">!</span><p>{error}</p></div>}
        </aside>

        <main className="architect-stage" onClick={() => setSelectedId(null)}>
          <div className="architect-zoom">
            <button type="button" onClick={() => setZoom((value) => Math.max(0.5, value - 0.1))}>−</button>
            <span>{Math.round(zoom * 100)}%</span>
            <button type="button" onClick={() => setZoom((value) => Math.min(2, value + 0.1))}>+</button>
            <button type="button" onClick={() => setZoom(1)}>Reset</button>
          </div>
          <div className="architect-canvas-scroll">
            <div className="architect-canvas-shell" style={{ transform: `scale(${zoom})` }}>
              <div
                ref={canvasRef}
                className={`architect-canvas${design.canvas.snap ? ' snap' : ''}`}
                style={{ aspectRatio: `${design.canvas.width} / ${design.canvas.height}` }}
                onClick={(event) => event.stopPropagation()}
              >
                <div className="architect-margin-box" style={{
                  left: `${(design.canvas.margins.left / design.canvas.width) * 100}%`,
                  right: `${(design.canvas.margins.right / design.canvas.width) * 100}%`,
                  top: `${(design.canvas.margins.top / design.canvas.height) * 100}%`,
                  bottom: `${(design.canvas.margins.bottom / design.canvas.height) * 100}%`,
                }} />
                {design.elements.map((item) => (
                  <CanvasElement
                    key={item.id}
                    item={item}
                    canvas={design.canvas}
                    data={canvasData}
                    selected={item.id === selectedId}
                    zoom={zoom}
                    onSelect={setSelectedId}
                    onDragStart={beginDrag}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="architect-stage__footer">
            <span>{design.canvas.width} × {design.canvas.height} mm</span>
            <span>Drag elements · arrow keys nudge · Delete removes</span>
            <span>{design.elements.length} elements</span>
          </div>
        </main>
      </div>

      {showOpen && (
        <div className="architect-modal-backdrop" onMouseDown={() => setShowOpen(false)}>
          <section className="architect-modal" onMouseDown={(event) => event.stopPropagation()}>
            <button className="architect-modal__close" type="button" onClick={() => setShowOpen(false)}>×</button>
            <h2>Saved layouts</h2>
            <label>Layout name<input value={layoutName} onChange={(event) => setLayoutName(event.target.value)} /></label>
            <button className="btn-primary w-full" type="button" onClick={saveLayout}>Save current layout</button>
            <div className="architect-saved-list">
              {Object.keys(savedLayouts).length ? Object.keys(savedLayouts).map((name) => <button type="button" key={name} onClick={() => loadLayout(name)}>{name}<span>{savedLayouts[name].canvas.width} × {savedLayouts[name].canvas.height} mm</span></button>) : <p>No saved layouts yet.</p>}
            </div>
          </section>
        </div>
      )}

      {showPrint && (
        <div className="architect-modal-backdrop" onMouseDown={() => setShowPrint(false)}>
          <section className="architect-modal architect-print-modal" onMouseDown={(event) => event.stopPropagation()}>
            <button className="architect-modal__close" type="button" onClick={() => setShowPrint(false)}>×</button>
            <span className="eyebrow">A4 bulk engine</span>
            <h2>Print spooler</h2>
            <p>Print repeated copies using the preview data, or import CSV rows that populate your variables.</p>
            <label>Single-label quantity<input type="number" min="1" max="1000" value={copies} onChange={(event) => setCopies(Math.max(1, Number(event.target.value)))} disabled={dataRows.length > 0} /></label>
            <div className="architect-spool-actions">
              <button type="button" onClick={downloadSample}>Download CSV sample</button>
              <button type="button" onClick={() => csvRef.current?.click()}>Import CSV</button>
              {dataRows.length > 0 && <button type="button" onClick={() => setDataRows([])}>Clear {dataRows.length} rows</button>}
              <input ref={csvRef} hidden type="file" accept=".csv,text/csv" onChange={(event) => event.target.files?.[0] && importCsv(event.target.files[0])} />
            </div>
            <div className="architect-print-summary">
              <strong>{dataRows.length || copies} labels</strong>
              <span>{dataRows.length ? 'CSV data source' : 'Repeated preview values'}</span>
              <span>{design.canvas.width} × {design.canvas.height} mm · {gap} mm gap</span>
            </div>
            <button className="btn-primary w-full" type="button" onClick={generate} disabled={generating}>{generating ? 'Generating PDF…' : `Run print session (${dataRows.length || copies})`}</button>
          </section>
        </div>
      )}

      {showGuide && (
        <div className="architect-modal-backdrop" onMouseDown={() => setShowGuide(false)}>
          <section className="architect-modal" onMouseDown={(event) => event.stopPropagation()}>
            <button className="architect-modal__close" type="button" onClick={() => setShowGuide(false)}>×</button>
            <h2>Studio quick guide</h2>
            <ol className="architect-guide">
              <li>Set the exact label width, height and print-safe margins.</li>
              <li>Add text, barcode, QR, logo, shape or handling-symbol elements.</li>
              <li>Drag elements on the canvas; use arrow keys for 0.5 mm nudges.</li>
              <li>Use variables such as <code>{'{{product}}'}</code> and import matching CSV columns.</li>
              <li>Save reusable layouts locally, then open Print Spooler for A4 bulk PDFs.</li>
            </ol>
          </section>
        </div>
      )}
    </div>
  );
}
