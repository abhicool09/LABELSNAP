import React, { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';
import SEO from '../components/SEO';
import { downloadBlob } from '../lib/label-tools';

const TYPES = ['URL', 'UPI', 'Wi-Fi', 'WhatsApp', 'Phone', 'Email', 'Text'];

function payloadFor(type, value, extra) {
  if (type === 'UPI') return `upi://pay?pa=${encodeURIComponent(value)}&pn=${encodeURIComponent(extra || 'Payment')}`;
  if (type === 'Wi-Fi') return `WIFI:T:WPA;S:${value};P:${extra};;`;
  if (type === 'WhatsApp') return `https://wa.me/${value.replace(/\D/g, '')}?text=${encodeURIComponent(extra)}`;
  if (type === 'Phone') return `tel:${value}`;
  if (type === 'Email') return `mailto:${value}?subject=${encodeURIComponent(extra)}`;
  return value;
}

export default function QrGenerator() {
  const [type, setType] = useState('URL');
  const [value, setValue] = useState('https://labelsnap.vercel.app');
  const [extra, setExtra] = useState('');
  const [dark, setDark] = useState('#111111');
  const [light, setLight] = useState('#ffffff');
  const [size, setSize] = useState(768);
  const [dataUrl, setDataUrl] = useState('');
  const payload = useMemo(() => payloadFor(type, value, extra), [type, value, extra]);

  useEffect(() => {
    QRCode.toDataURL(payload || ' ', { width: size, margin: 2, color: { dark, light }, errorCorrectionLevel: 'H' })
      .then(setDataUrl)
      .catch(() => setDataUrl(''));
  }, [payload, size, dark, light]);

  const downloadSvg = async () => {
    const svg = await QRCode.toString(payload || ' ', { type: 'svg', width: size, margin: 2, color: { dark, light }, errorCorrectionLevel: 'H' });
    downloadBlob(new Blob([svg], { type: 'image/svg+xml' }), 'labelsnap-qr.svg');
  };

  const downloadPdf = () => {
    const pdf = new jsPDF({ unit: 'mm', format: [100, 100] });
    pdf.addImage(dataUrl, 'PNG', 10, 10, 80, 80);
    pdf.save('labelsnap-qr.pdf');
  };

  return (
    <div className="generator-page container py-12">
      <SEO title="Free QR Code Generator" description="Create permanent QR codes for URLs, UPI, Wi-Fi, WhatsApp, phone, email and text." canonicalPath="/qr-code-generator" />
      <header className="tool-header text-center">
        <span className="eyebrow">Private & browser based</span>
        <h1>QR Code Generator</h1>
        <p className="subtitle">Make high-resolution, static QR codes that do not expire.</p>
      </header>
      <div className="generator-workbench">
        <section className="generator-controls glass-card">
          <div className="segmented-control">
            {TYPES.map((item) => <button type="button" className={type === item ? 'active' : ''} onClick={() => setType(item)} key={item}>{item}</button>)}
          </div>
          <label className="field-label">
            {type === 'UPI' ? 'UPI ID' : type === 'Wi-Fi' ? 'Network name' : 'Content'}
            <input value={value} onChange={(event) => setValue(event.target.value)} placeholder="Enter content" />
          </label>
          {['UPI', 'Wi-Fi', 'WhatsApp', 'Email'].includes(type) && (
            <label className="field-label">
              {type === 'Wi-Fi' ? 'Password' : type === 'UPI' ? 'Payee name' : 'Optional message'}
              <input value={extra} onChange={(event) => setExtra(event.target.value)} />
            </label>
          )}
          <div className="field-row">
            <label className="field-label">Foreground<input type="color" value={dark} onChange={(event) => setDark(event.target.value)} /></label>
            <label className="field-label">Background<input type="color" value={light} onChange={(event) => setLight(event.target.value)} /></label>
            <label className="field-label">Resolution<select value={size} onChange={(event) => setSize(Number(event.target.value))}><option value="512">512 px</option><option value="768">768 px</option><option value="1024">1024 px</option></select></label>
          </div>
        </section>
        <section className="generator-preview glass-card">
          <div className="qr-preview">{dataUrl && <img src={dataUrl} alt="Generated QR code preview" />}</div>
          <p className="preview-caption">{type} QR • {size}px</p>
          <div className="download-actions">
            <a className="btn-primary" href={dataUrl} download="labelsnap-qr.png">Download PNG</a>
            <button className="btn-secondary" type="button" onClick={downloadSvg}>SVG</button>
            <button className="btn-secondary" type="button" onClick={downloadPdf}>PDF</button>
          </div>
        </section>
      </div>
    </div>
  );
}
