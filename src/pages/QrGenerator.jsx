import React, { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';
import SEO from '../components/SEO';
import ToolSeoSection from '../components/ToolSeoSection';
import { buildToolSchema } from '../lib/seo-schema';
import { downloadBlob } from '../lib/label-tools';

const TYPES = ['URL', 'UPI', 'Wi-Fi', 'WhatsApp', 'Phone', 'Email', 'Text'];

const QR_STEPS = [
  { name: 'Pick a QR type', text: 'Choose URL, UPI, Wi-Fi, WhatsApp, phone, email or plain text.' },
  { name: 'Enter your content', text: 'Type the link, UPI ID or details you want the QR code to open.' },
  { name: 'Style and size it', text: 'Set the colours and resolution (up to 1024px) to match your brand.' },
  { name: 'Download', text: 'Export a PNG, scalable SVG or print-ready PDF — all generated in your browser.' },
];

const QR_FAQS = [
  { q: 'Are these QR codes free and permanent?', a: 'Yes. AI Label Cropper generates static QR codes that never expire and have no scan limits or fees. The data is encoded directly in the code, so there is no redirect that can break.' },
  { q: 'Can I create a UPI payment QR code?', a: 'Yes. Select the UPI type, enter your UPI ID and payee name, and the tool builds a standard upi:// QR that any UPI app like GPay, PhonePe or Paytm can scan to pay you.' },
  { q: 'Is my data uploaded anywhere?', a: 'No. The QR code is rendered entirely inside your browser using JavaScript. Nothing you type is sent to a server.' },
  { q: 'What resolution should I use for printing?', a: 'For printed labels and packaging, download the SVG (infinitely scalable) or use the 1024px PNG. Higher resolution keeps the code crisp and scannable at any size.' },
];

const QR_RELATED = [
  { to: '/barcode-generator', label: 'Barcode generator' },
  { to: '/product-label-maker', label: 'Product label maker' },
  { to: '/thank-you-sticker-maker', label: 'Thank-you sticker maker' },
  { to: '/blog/free-qr-code-generator-guide', label: 'Guide: QR codes for sellers' },
];

const QR_JSONLD = buildToolSchema({
  name: 'Free QR Code Generator',
  path: '/qr-code-generator',
  description: 'Create permanent, static QR codes for URLs, UPI, Wi-Fi, WhatsApp, phone, email and text — free and private.',
  howToName: 'How to create a QR code',
  steps: QR_STEPS,
  faqs: QR_FAQS,
});

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
    downloadBlob(new Blob([svg], { type: 'image/svg+xml' }), 'ai-label-cropper-qr.svg');
  };

  const downloadPdf = () => {
    const pdf = new jsPDF({ unit: 'mm', format: [100, 100] });
    pdf.addImage(dataUrl, 'PNG', 10, 10, 80, 80);
    pdf.save('ai-label-cropper-qr.pdf');
  };

  return (
    <div className="generator-page container py-12">
      <SEO
        title="Free QR Code Generator — UPI, Wi-Fi, URL & WhatsApp"
        description="Create permanent, static QR codes for URLs, UPI payments, Wi-Fi, WhatsApp, phone, email and text. Free, no sign-up, download PNG, SVG or PDF."
        canonicalPath="/qr-code-generator"
        jsonLd={QR_JSONLD}
      />
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
            <a className="btn-primary" href={dataUrl} download="ai-label-cropper-qr.png">Download PNG</a>
            <button className="btn-secondary" type="button" onClick={downloadSvg}>SVG</button>
            <button className="btn-secondary" type="button" onClick={downloadPdf}>PDF</button>
          </div>
        </section>
      </div>

      <ToolSeoSection
        intro="This free QR code generator creates static, permanent QR codes right in your browser. Use it for UPI payments, store links, Wi-Fi sharing, WhatsApp messages and product packaging — with no sign-up, no watermark and no expiry."
        howTo={{ title: 'How to create a QR code', steps: QR_STEPS }}
        faqs={QR_FAQS}
        related={QR_RELATED}
      />
    </div>
  );
}
