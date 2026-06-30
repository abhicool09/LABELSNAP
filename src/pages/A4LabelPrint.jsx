import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { createA4SheetPdf } from '../lib/cropper/layout';
import { loadPdf, renderPageToCanvas } from '../lib/cropper/pdf-utils';

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

async function imageFileToCanvas(file) {
  const imageUrl = URL.createObjectURL(file);
  try {
    const image = await new Promise((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error(`Could not read ${file.name}.`));
      element.src = imageUrl;
    });
    const canvas = document.createElement('canvas');
    const maxSide = 2200;
    const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas;
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

export default function A4LabelPrint() {
  const inputRef = useRef(null);
  const [labels, setLabels] = useState([]);
  const [isReading, setIsReading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const [resultUrl, setResultUrl] = useState('');

  const selectedLabels = labels.filter((label) => label.selected);

  useEffect(() => () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
  }, [resultUrl]);

  const readFiles = async (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;

    setIsReading(true);
    setError('');
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
      setResultUrl('');
    }

    try {
      const additions = [];
      for (const file of files) {
        if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
          const pdf = await loadPdf(file);
          for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
            const page = await pdf.getPage(pageNumber);
            const canvas = await renderPageToCanvas(page, 2.5);
            additions.push({
              id: `${file.name}-${file.lastModified}-${pageNumber}-${crypto.randomUUID()}`,
              name: pdf.numPages > 1 ? `${file.name} · page ${pageNumber}` : file.name,
              source: file.name,
              canvas,
              preview: canvas.toDataURL('image/jpeg', 0.75),
              selected: true,
            });
          }
          await pdf.destroy();
        } else if (file.type.startsWith('image/')) {
          const canvas = await imageFileToCanvas(file);
          additions.push({
            id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
            name: file.name,
            source: file.name,
            canvas,
            preview: canvas.toDataURL('image/jpeg', 0.78),
            selected: true,
          });
        } else {
          throw new Error(`${file.name} is not a PDF or image file.`);
        }
      }
      setLabels((current) => [...current, ...additions]);
    } catch (err) {
      setError(err.message || 'Unable to read those labels.');
    } finally {
      setIsReading(false);
    }
  };

  const generateA4 = async () => {
    if (!selectedLabels.length) {
      setError('Choose at least one label first.');
      return;
    }

    setIsGenerating(true);
    setError('');
    try {
      const blob = createA4SheetPdf(selectedLabels.map((label) => label.canvas));
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(URL.createObjectURL(blob));
    } catch (err) {
      setError(err.message || 'Unable to create the A4 PDF.');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleLabel = (id) => {
    setLabels((current) => current.map((label) => (
      label.id === id ? { ...label, selected: !label.selected } : label
    )));
    setResultUrl('');
  };

  const removeLabel = (id) => {
    setLabels((current) => current.filter((label) => label.id !== id));
    setResultUrl('');
  };

  const selectAll = (selected) => {
    setLabels((current) => current.map((label) => ({ ...label, selected })));
    setResultUrl('');
  };

  return (
    <div className="container py-16">
      <SEO
        title="Print 4x6 Shipping Labels on A4 Paper - Free Label Tool"
        description="Upload PDF, PNG or JPG shipping labels, choose the label pages you need and arrange four labels on each printable A4 sheet."
        canonicalPath="/4x6-label-print-a4"
      />

      <section className="text-center max-w-4xl mx-auto mb-12">
        <span className="eyebrow">PDF, PNG or JPG</span>
        <h1 className="gradient-text">Print 4x6 Shipping Labels on A4 Paper</h1>
        <p className="subtitle">
          Upload your labels, choose which ones to include, and arrange four labels on every A4 sheet.
        </p>
      </section>

      <section className="a4-upload-workbench">
        <div
          className={`a4-multi-upload${dragOver ? ' drag-active' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragOver(false);
            readFiles(event.dataTransfer.files);
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') inputRef.current?.click();
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,image/png,image/jpeg,image/webp"
            multiple
            onChange={(event) => {
              readFiles(event.target.files);
              event.target.value = '';
            }}
          />
          <span className="a4-upload-icon" aria-hidden="true">↑</span>
          <strong>{isReading ? 'Reading labels…' : 'Choose label files'}</strong>
          <span>Drop PDF, PNG or JPG files here, or click to browse</span>
          <small>You can add multiple files. Every PDF page becomes a selectable label.</small>
        </div>

        {error && <div className="alert error mt-6"><span className="icon">!</span><p>{error}</p></div>}

        {labels.length > 0 && (
          <div className="a4-label-picker">
            <div className="a4-picker-head">
              <div>
                <h2>Choose labels</h2>
                <p>{selectedLabels.length} of {labels.length} selected · {Math.ceil(selectedLabels.length / 4)} A4 sheet{Math.ceil(selectedLabels.length / 4) === 1 ? '' : 's'}</p>
              </div>
              <div className="a4-picker-actions">
                <button type="button" onClick={() => selectAll(true)}>Select all</button>
                <button type="button" onClick={() => selectAll(false)}>Clear</button>
                <button type="button" onClick={() => setLabels([])}>Remove all</button>
              </div>
            </div>

            <div className="a4-label-grid">
              {labels.map((label, index) => (
                <article className={`a4-label-card${label.selected ? ' selected' : ''}`} key={label.id}>
                  <button
                    type="button"
                    className="a4-label-select"
                    onClick={() => toggleLabel(label.id)}
                    aria-pressed={label.selected}
                    aria-label={`${label.selected ? 'Exclude' : 'Include'} ${label.name}`}
                  >
                    <span className="a4-label-number">{label.selected ? selectedLabels.findIndex((item) => item.id === label.id) + 1 : index + 1}</span>
                    <img src={label.preview} alt="" />
                    <span className="a4-label-check">{label.selected ? '✓ Included' : 'Not included'}</span>
                  </button>
                  <div className="a4-label-meta">
                    <span title={label.name}>{label.name}</span>
                    <button type="button" onClick={() => removeLabel(label.id)} aria-label={`Remove ${label.name}`}>Remove</button>
                  </div>
                </article>
              ))}
            </div>

            <div className="a4-output-actions">
              <button
                type="button"
                className="btn-primary"
                disabled={!selectedLabels.length || isGenerating}
                onClick={generateA4}
              >
                {isGenerating ? 'Creating A4 PDF…' : `Create A4 PDF (${selectedLabels.length} labels)`}
              </button>
              {resultUrl && (
                <a className="btn-success" href={resultUrl} download="ai-label-cropper-labels-a4.pdf">
                  Download A4 PDF
                </a>
              )}
            </div>
          </div>
        )}
      </section>

      {labels.length === 0 && (
        <section className="a4-layout-preview" aria-label="Four labels arranged on an A4 sheet">
          <div>Label 1</div>
          <div>Label 2</div>
          <div>Label 3</div>
          <div>Label 4</div>
        </section>
      )}

      <section className="seo-content mt-12">
        <h2>A4 shipping label printing for sellers</h2>
        <p>
          Upload already-cropped label PDFs or image labels. Select only the pages you need, then AI Label Cropper
          places them in upload order using a two-by-two A4 layout. Processing stays entirely in your browser.
        </p>

        <h3>Need to crop marketplace labels first?</h3>
        <div className="seo-inline-links">
          <Link to="/flipkart-label-cropper">Flipkart label cropper</Link>
          <Link to="/meesho-label-cropper">Meesho label cropper</Link>
          <Link to="/amazon-label-cropper">Amazon label cropper</Link>
        </div>

        <h3>Before printing</h3>
        <ul>
          <li>Select Actual Size or 100% scale in the printer dialog.</li>
          <li>Check the first printed sheet before starting a large batch.</li>
          <li>Use good-quality A4 sticker paper when labels will be applied directly to parcels.</li>
        </ul>
      </section>
    </div>
  );
}
