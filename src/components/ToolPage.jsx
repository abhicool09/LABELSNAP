import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import UploadZone from './UploadZone';
import AdBanner from './AdBanner';
import SEO from './SEO';
import { cropPdf } from '../lib/cropper/engine';

export default function ToolPage({
  title,
  subtitle,
  marketplace,
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
      const output = await cropPdf(file, marketplace, layout);
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
