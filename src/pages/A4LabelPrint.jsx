import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function A4LabelPrint() {
  return (
    <div className="container py-16">
      <SEO
        title="Print 4x6 Shipping Labels on A4 Paper - Free Label Tool"
        description="Arrange cropped Amazon, Flipkart and Meesho shipping labels on A4 paper. Print up to four smaller labels per A4 sheet."
        canonicalPath="/4x6-label-print-a4"
      />

      <section className="text-center max-w-4xl mx-auto mb-12">
        <h1 className="gradient-text">Print 4x6 Shipping Labels on A4 Paper</h1>
        <p className="subtitle">
          Crop marketplace PDFs and arrange up to four labels on one A4 sheet for standard printer output.
        </p>
      </section>

      <section className="a4-layout-preview" aria-label="Four labels arranged on an A4 sheet">
        <div>Label 1</div>
        <div>Label 2</div>
        <div>Label 3</div>
        <div>Label 4</div>
      </section>

      <section className="seo-content mt-12">
        <h2>A4 shipping label printing for sellers</h2>
        <p>
          Select the A4 Sheet option inside any LabelSnap cropper to place cropped labels in a two-by-two layout.
          Labels are reduced slightly so four can fit within one standard A4 page.
        </p>

        <h3>Choose your marketplace</h3>
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
