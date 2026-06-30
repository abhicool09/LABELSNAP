import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const tools = [
  {
    title: 'Flipkart Label Cropper',
    desc: 'Crop Flipkart seller label PDFs for 4x6 thermal printers or A4 sheets.',
    to: '/flipkart-label-cropper',
  },
  {
    title: 'Meesho Label Cropper',
    desc: 'Crop Meesho shipping labels without invoice sections.',
    to: '/meesho-label-cropper',
  },
  {
    title: 'Meesho With Invoice',
    desc: 'Crop Meesho labels and keep invoice pages separate.',
    to: '/meesho-label-cropper-with-invoice',
  },
  {
    title: 'Amazon Label Cropper',
    desc: 'Crop Amazon Easy Ship labels and ignore invoice pages.',
    to: '/amazon-label-cropper',
  },
];

export default function ShippingLabelCropper() {
  return (
    <div className="container py-16">
      <SEO
        title="Shipping Label Cropper for Amazon, Flipkart and Meesho"
        description="Free browser-based shipping label cropper for Indian ecommerce sellers. Crop Amazon, Flipkart and Meesho PDFs for 4x6 thermal labels or A4 printing."
        canonicalPath="/shipping-label-cropper"
      />

      <section className="text-center max-w-4xl mx-auto mb-12">
        <h1 className="gradient-text">Shipping Label Cropper</h1>
        <p className="subtitle">
          Crop Amazon, Flipkart, and Meesho label PDFs into print-ready 4x6 thermal labels or A4 sheets.
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-6 mb-12">
        {tools.map((tool) => (
          <Link key={tool.to} to={tool.to} className="glass-card hover-lift seo-tool-card">
            <h2>{tool.title}</h2>
            <p className="text-muted">{tool.desc}</p>
            <span className="seo-tool-card__action">Open tool</span>
          </Link>
        ))}
      </section>

      <section className="seo-content">
        <h2>Free label cropper for ecommerce sellers</h2>
        <p>
          AI Label Cropper helps sellers turn marketplace PDF labels into cleaner print files. Choose the marketplace,
          upload the downloaded PDF, select thermal or A4 output, and download the cropped file.
        </p>

        <h3>Supported marketplaces</h3>
        <ul>
          <li>Flipkart shipping label cropper for seller dashboard PDFs.</li>
          <li>Meesho label cropper with no-invoice and with-invoice options.</li>
          <li>Amazon Easy Ship label cropper for label-only print output.</li>
        </ul>

        <h3>Printing formats</h3>
        <p>
          Use 4x6 Thermal when printing on a dedicated label printer. Use A4 Sheet when printing multiple labels
          on a normal printer or A4 sticker paper.
        </p>
      </section>
    </div>
  );
}
