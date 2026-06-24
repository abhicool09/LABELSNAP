import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { TOOL_INVENTORY } from '../lib/label-tools';

export default function ToolsHub() {
  return (
    <div className="container py-16">
      <SEO
        title="Free Label, QR & Barcode Tools"
        description="Create shipping labels, product labels, QR codes, barcodes, price tags and inventory labels free in your browser."
        canonicalPath="/tools"
      />
      <header className="tool-header text-center label-tools-hero">
        <span className="eyebrow">LabelSnap Studio</span>
        <h1>Every label tool, one tidy workbench.</h1>
        <p className="subtitle">Original, browser-based generators for selling, packing, retail and warehouse work. No sign-up and no uploads.</p>
      </header>
      <div className="label-tools-grid">
        {TOOL_INVENTORY.map((tool) => (
          <Link className="label-tool-tile" to={tool.to} key={tool.to}>
            <span className="label-tool-icon" aria-hidden="true">{tool.icon}</span>
            <span>
              <strong>{tool.title}</strong>
              <small>{tool.text}</small>
            </span>
            <span className="label-tool-arrow" aria-hidden="true">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
