import React, { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import UploadZone from './UploadZone';
import AdBanner from './AdBanner';
import SEO from './SEO';
import { cropPdf } from '../lib/cropper/engine';

export default function ToolPage({
  title,
  subtitle,
  marketplace,
  cropper = cropPdf,
  description,
  features,
  seoContent,
  metaTitle,
  metaDescription,
  canonicalPath,
}) {
  const [file, setFile] = useState(null);
  const [layout, setLayout] = useState('thermal');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const location = useLocation();

  const marketplaceName = marketplace
    ? marketplace.charAt(0).toUpperCase() + marketplace.slice(1)
    : 'shipping';
  const guide = getMarketplaceGuide(marketplace);

  const jsonLd = useMemo(() => {
    const path = canonicalPath || location.pathname;
    const url = `https://labelsnap.vercel.app${path}`;
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'SoftwareApplication',
          name: metaTitle || `${title} | LabelSnap`,
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web browser',
          url,
          description: metaDescription || description,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
        },
        {
          '@type': 'HowTo',
          name: `How to crop ${marketplaceName} shipping labels`,
          step: [
            { '@type': 'HowToStep', position: 1, name: 'Download the label PDF', text: `Download your ${marketplaceName} shipping label PDF from the seller dashboard.` },
            { '@type': 'HowToStep', position: 2, name: 'Upload the PDF', text: 'Upload the PDF file to LabelSnap. Processing happens in your browser.' },
            { '@type': 'HowToStep', position: 3, name: 'Choose a format', text: 'Select 4x6 thermal for label printers or A4 sheet for sticker paper.' },
            { '@type': 'HowToStep', position: 4, name: 'Download cropped labels', text: 'Download the cropped, print-ready PDF.' },
          ],
        },
        {
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: `Is the ${marketplaceName} label cropper free?`,
              acceptedAnswer: { '@type': 'Answer', text: `Yes. LabelSnap's ${marketplaceName} label cropper is completely free with no sign-up and no limits.` },
            },
            {
              '@type': 'Question',
              name: 'Are my shipping labels uploaded to a server?',
              acceptedAnswer: { '@type': 'Answer', text: 'No. All cropping happens entirely inside your web browser, so your labels and customer data never leave your device.' },
            },
            {
              '@type': 'Question',
              name: 'Can I print on both 4x6 thermal printers and A4 sheets?',
              acceptedAnswer: { '@type': 'Answer', text: 'Yes. You can export cropped labels as 4x6 PDFs for thermal printers or arrange multiple labels on an A4 sticker sheet.' },
            },
          ],
        },
      ],
    };
  }, [title, metaTitle, metaDescription, description, canonicalPath, location.pathname, marketplaceName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a PDF file.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setResult(null);

    try {
      const output = await cropper(file, marketplace, layout);
      const downloadUrl = URL.createObjectURL(output.blob);
      setResult({
        downloadUrl,
        pageCount: output.pageCount,
        labelCount: output.detections.length,
        filename: `cropped-${marketplace}-${layout}.pdf`,
      });
    } catch (err) {
      setError(err.message || 'An error occurred during processing.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="tool-page">
      <SEO
        title={metaTitle || `${title} | LabelSnap`}
        description={metaDescription || description}
        canonicalPath={canonicalPath || location.pathname}
        jsonLd={jsonLd}
      />

      <div className="tool-header text-center">
        <h1 className="gradient-text">{title}</h1>
        <p className="subtitle">{subtitle}</p>
      </div>

      <div className="glass-card main-tool-card">
        <form onSubmit={handleSubmit}>
          <UploadZone file={file} onFileSelect={setFile} label={`Upload ${title} PDF`} />

          <div className="layout-selector mt-6">
            <h3 className="text-lg font-semibold mb-3">Select Output Format</h3>
            <div className="radio-cards">
              <label className={`radio-card ${layout === 'thermal' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="layout"
                  value="thermal"
                  checked={layout === 'thermal'}
                  onChange={(e) => setLayout(e.target.value)}
                />
                <div className="card-content">
                  <span className="icon">PDF</span>
                  <div className="details">
                    <span className="title">4x6 Thermal</span>
                    <span className="desc">1 label per page</span>
                  </div>
                </div>
              </label>

              <label className={`radio-card ${layout === 'a4' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="layout"
                  value="a4"
                  checked={layout === 'a4'}
                  onChange={(e) => setLayout(e.target.value)}
                />
                <div className="card-content">
                  <span className="icon">A4</span>
                  <div className="details">
                    <span className="title">A4 Sheet</span>
                    <span className="desc">
                      {marketplace === 'amazon' ? '4 smaller labels per page' : '4 labels per page'}
                    </span>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary w-full mt-8"
            disabled={!file || isProcessing}
          >
            {isProcessing ? <span className="spinner"></span> : 'Crop Labels'}
          </button>
        </form>

        {error && (
          <div className="alert error mt-6">
            <span className="icon">!</span>
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="result-container mt-6">
            <div className="success-banner">
              <span className="icon">OK</span>
              <p>Successfully created {result.labelCount} cropped pages.</p>
            </div>
            <a
              href={result.downloadUrl}
              download={result.filename}
              className="btn-success w-full mt-4"
            >
              Download Cropped PDF
            </a>
          </div>
        )}
      </div>

      {result && <AdBanner variant="inline" className="mt-8" />}

      <div className="tool-content mt-12">
        <div className="description mb-8">
          <h2>About this Tool</h2>
          <p>{description}</p>
          {guide && (
            <p className="mt-4">
              Need printing help? Read the{' '}
              <Link to={guide.to}>{guide.label}</Link> for sizing, printer settings and barcode tips.
            </p>
          )}
        </div>

        {features && features.length > 0 && (
          <div className="features-grid mb-12">
            {features.map((f, i) => (
              <div key={i} className="glass-card feature">
                <span className="icon">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        )}

        {seoContent && (
          <div className="seo-content glass-card p-8">
            <div dangerouslySetInnerHTML={{ __html: seoContent }} />
          </div>
        )}
      </div>
    </div>
  );
}

function getMarketplaceGuide(marketplace) {
  if (marketplace === 'flipkart') {
    return {
      to: '/blog/flipkart-label-printing-guide',
      label: 'Flipkart label printing guide',
    };
  }
  if (marketplace?.startsWith('meesho')) {
    return {
      to: '/blog/meesho-label-printing-guide',
      label: 'Meesho label printing guide',
    };
  }
  if (marketplace === 'amazon') {
    return {
      to: '/blog/amazon-easy-ship-label-guide',
      label: 'Amazon Easy Ship label guide',
    };
  }
  return null;
}
