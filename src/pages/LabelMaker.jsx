import React, { useEffect, useMemo, useState } from 'react';
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';
import SEO from '../components/SEO';
import ToolSeoSection from '../components/ToolSeoSection';
import { buildToolSchema } from '../lib/seo-schema';
import { LABEL_TEMPLATES, LABEL_SEO } from '../lib/label-tools';

function initialValues(template) {
  return Object.fromEntries(template.fields.map(([key, , example]) => [key, example]));
}

export default function LabelMaker({ templateKey }) {
  const template = LABEL_TEMPLATES[templateKey];
  const [values, setValues] = useState(() => initialValues(template));
  const [accent, setAccent] = useState('#e11d48');
  const [barcodeUrl, setBarcodeUrl] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const [copies, setCopies] = useState(1);
  const canonicalPaths = {
    shipping: '/shipping-label-maker',
    product: '/product-label-maker',
    price: '/price-tag-maker',
    inventory: '/inventory-label-maker',
    address: '/address-label-maker',
    manufacturing: '/manufacturing-label-maker',
    custom: '/custom-label-maker',
    pricing: '/discount-label-maker',
    cable: '/cable-label-maker',
    jewellery: '/jewelry-tag-maker',
    thanks: '/thank-you-sticker-maker',
    garment: '/garment-label-maker',
  };

  useEffect(() => setValues(initialValues(template)), [template]);

  useEffect(() => {
    if (!values.barcode) return setBarcodeUrl('');
    try {
      const canvas = document.createElement('canvas');
      JsBarcode(canvas, values.barcode, { format: 'CODE128', height: 54, width: 1.5, margin: 4, displayValue: true, fontSize: 12 });
      setBarcodeUrl(canvas.toDataURL('image/png'));
    } catch {
      setBarcodeUrl('');
    }
  }, [values.barcode]);

  useEffect(() => {
    if (!values.qr) return setQrUrl('');
    QRCode.toDataURL(values.qr, { width: 320, margin: 1, errorCorrectionLevel: 'H' }).then(setQrUrl).catch(() => setQrUrl(''));
  }, [values.qr]);

  const visibleFields = useMemo(() => template.fields.filter(([key]) => !['barcode', 'qr'].includes(key)), [template]);

  const exportPdf = () => {
    const [width, height] = template.size;
    const pdf = new jsPDF({ unit: 'mm', format: [width, height], orientation: width > height ? 'landscape' : 'portrait' });
    for (let page = 0; page < copies; page += 1) {
      if (page) pdf.addPage([width, height], width > height ? 'landscape' : 'portrait');
      pdf.setDrawColor(accent);
      pdf.setLineWidth(1.2);
      pdf.roundedRect(3, 3, width - 6, height - 6, 2, 2);
      pdf.setTextColor(25, 25, 25);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(Math.max(11, Math.min(20, width / 4)));
      pdf.text(values.brand || values.recipient || values.location || values.product || template.title, 6, 10, { maxWidth: width - 12 });
      let y = 16;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(Math.max(6.5, Math.min(10, width / 7)));
      visibleFields.forEach(([key, label]) => {
        if (!values[key] || y > height - 14) return;
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${label}:`, 6, y);
        pdf.setFont('helvetica', 'normal');
        pdf.text(String(values[key]), 6, y + 4, { maxWidth: qrUrl ? width - 34 : width - 12 });
        y += 9;
      });
      if (qrUrl) pdf.addImage(qrUrl, 'PNG', width - 27, 8, 20, 20);
      if (barcodeUrl) pdf.addImage(barcodeUrl, 'PNG', 6, height - 15, Math.min(width - 12, 70), 10);
    }
    pdf.save(`ai-label-cropper-${templateKey}-labels.pdf`);
  };

  const path = canonicalPaths[templateKey];
  const [labelW, labelH] = template.size;
  const hasCode = template.fields.some(([key]) => key === 'barcode' || key === 'qr');
  const seoMeta = LABEL_SEO[templateKey] || { related: [] };

  const steps = [
    { name: 'Fill in your details', text: `Enter fields like ${template.fields.slice(0, 2).map(([, fieldLabel]) => fieldLabel.toLowerCase()).join(' and ')}. The preview updates as you type.` },
    ...(hasCode ? [{ name: 'Add a barcode or QR code', text: 'Type a barcode value or QR destination and it is placed on the label automatically.' }] : []),
    { name: 'Set the accent and copies', text: 'Choose an accent colour and how many copies to include in the PDF.' },
    { name: 'Download the print-ready PDF', text: `The PDF uses the exact ${labelW} × ${labelH} mm size — print at 100% / Actual Size.` },
  ];

  const faqs = [
    { q: `Is the ${template.title.toLowerCase()} free?`, a: 'Yes — it is completely free with no sign-up and no watermark. Create and download as many labels as you need.' },
    ...(seoMeta.faq ? [seoMeta.faq] : []),
    { q: 'Is my information uploaded to a server?', a: 'No. The label is generated entirely in your browser, so nothing you type ever leaves your device.' },
    { q: 'What size is this label and how should I print it?', a: `This template is ${labelW} × ${labelH} mm. Download the PDF and print at 100% / Actual Size (not "Fit to page") so the size stays accurate on thermal printers or A4 sticker sheets.` },
  ];

  const related = [
    ...(seoMeta.related || []),
    { to: '/tools', label: 'All label tools' },
    { to: '/blog/label-makers-for-online-sellers', label: 'Guide: label makers for sellers' },
  ];

  const jsonLd = useMemo(
    () => buildToolSchema({
      name: template.title,
      path,
      description: template.description,
      howToName: `How to make a ${template.title.toLowerCase()}`,
      steps,
      faqs,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [templateKey],
  );

  const metaTitle = `${template.title} — Free & Print-ready | AI Label Cropper`;

  return (
    <div className="generator-page container py-12">
      <SEO title={metaTitle} description={template.description} canonicalPath={path} jsonLd={jsonLd} />
      <header className="tool-header text-center">
        <span className="eyebrow">{template.size[0]} × {template.size[1]} mm template</span>
        <h1>{template.title}</h1>
        <p className="subtitle">{template.description}</p>
      </header>
      <div className="generator-workbench label-maker-workbench">
        <section className="generator-controls glass-card">
          <div className="label-field-grid">
            {template.fields.map(([key, label]) => (
              <label className="field-label" key={key}>{label}<input value={values[key] || ''} onChange={(event) => setValues((current) => ({ ...current, [key]: event.target.value }))} /></label>
            ))}
          </div>
          <div className="field-row">
            <label className="field-label">Accent<input type="color" value={accent} onChange={(event) => setAccent(event.target.value)} /></label>
            <label className="field-label">PDF copies<input type="number" min="1" max="100" value={copies} onChange={(event) => setCopies(Math.max(1, Math.min(100, Number(event.target.value))))} /></label>
          </div>
          <button className="btn-primary w-full" type="button" onClick={exportPdf}>Download print-ready PDF</button>
          <p className="field-hint">The PDF uses the exact label dimensions shown above. Print at 100% / Actual Size.</p>
        </section>
        <section className="generator-preview glass-card">
          <div className={`print-label print-label--${templateKey}`} style={{ '--label-accent': accent, aspectRatio: `${template.size[0]} / ${template.size[1]}` }}>
            <div className="print-label__accent" />
            <div className="print-label__body">
              <strong className="print-label__title">{values.brand || values.recipient || values.location || values.product || template.title}</strong>
              {qrUrl && <img className="print-label__qr" src={qrUrl} alt="" />}
              <div className="print-label__details">
                {visibleFields.map(([key, label]) => values[key] && (
                  <div key={key}><span>{label}</span><b>{values[key]}</b></div>
                ))}
              </div>
              {barcodeUrl && <img className="print-label__barcode" src={barcodeUrl} alt="" />}
            </div>
          </div>
          <p className="preview-caption">Live preview • output is generated locally</p>
        </section>
      </div>

      <ToolSeoSection
        intro={template.description}
        howTo={{ title: `How to make a ${template.title.toLowerCase()}`, steps }}
        faqs={faqs}
        related={related}
      />
    </div>
  );
}
