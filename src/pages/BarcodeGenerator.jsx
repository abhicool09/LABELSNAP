import React, { useEffect, useRef, useState } from 'react';
import JsBarcode from 'jsbarcode';
import SEO from '../components/SEO';
import { downloadBlob, svgToPng } from '../lib/label-tools';

const FORMATS = [
  ['CODE128', 'Code 128'],
  ['EAN13', 'EAN-13'],
  ['UPC', 'UPC-A'],
  ['CODE39', 'Code 39'],
  ['ITF14', 'ITF-14'],
];

export default function BarcodeGenerator() {
  const [format, setFormat] = useState('CODE128');
  const [value, setValue] = useState('LABELSNAP-1001');
  const [height, setHeight] = useState(100);
  const [showText, setShowText] = useState(true);
  const [error, setError] = useState('');
  const svgRef = useRef(null);

  useEffect(() => {
    try {
      JsBarcode(svgRef.current, value || ' ', { format, height, width: 2.2, margin: 18, displayValue: showText, font: 'Arial', fontSize: 18 });
      setError('');
    } catch (err) {
      setError(err.message || 'This value is not valid for the selected barcode format.');
    }
  }, [format, value, height, showText]);

  const svgText = () => new XMLSerializer().serializeToString(svgRef.current);
  const downloadSvg = () => downloadBlob(new Blob([svgText()], { type: 'image/svg+xml' }), 'labelsnap-barcode.svg');

  return (
    <div className="generator-page container py-12">
      <SEO title="Free Barcode Generator" description="Generate printable Code 128, EAN-13, UPC-A, Code 39 and ITF-14 barcodes." canonicalPath="/barcode-generator" />
      <header className="tool-header text-center">
        <span className="eyebrow">Retail-ready output</span>
        <h1>Barcode Generator</h1>
        <p className="subtitle">Generate crisp SVG and high-resolution PNG barcodes for products and inventory.</p>
      </header>
      <div className="generator-workbench">
        <section className="generator-controls glass-card">
          <label className="field-label">Barcode format<select value={format} onChange={(event) => setFormat(event.target.value)}>{FORMATS.map(([code, label]) => <option key={code} value={code}>{label}</option>)}</select></label>
          <label className="field-label">Value<input value={value} onChange={(event) => setValue(event.target.value)} placeholder="Enter text or numbers" /></label>
          <label className="field-label">Bar height<input type="range" min="50" max="180" value={height} onChange={(event) => setHeight(Number(event.target.value))} /><span className="range-value">{height}px</span></label>
          <label className="check-label"><input type="checkbox" checked={showText} onChange={(event) => setShowText(event.target.checked)} /> Show human-readable value</label>
          <p className="field-hint">EAN-13 requires 12 or 13 digits, UPC-A requires 11 or 12, and ITF-14 requires 13 or 14.</p>
        </section>
        <section className="generator-preview glass-card">
          <div className="barcode-preview"><svg ref={svgRef} aria-label="Generated barcode preview" /></div>
          {error ? <div className="alert error">{error}</div> : (
            <div className="download-actions">
              <button className="btn-primary" type="button" onClick={() => svgToPng(svgText(), 1400, 500, 'labelsnap-barcode.png')}>Download PNG</button>
              <button className="btn-secondary" type="button" onClick={downloadSvg}>Download SVG</button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
