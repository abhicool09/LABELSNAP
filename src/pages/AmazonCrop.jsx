import React from 'react';
import ToolPage from '../components/ToolPage';
import { cropAmazonPdfCompat } from '../lib/cropper/amazon-compat';

export default function AmazonCrop() {
  return (
    <ToolPage
      title="Amazon Shipping Label Crop Tool"
      subtitle="Automated cropping and sorting for Amazon shipping labels"
      marketplace="amazon"
      cropper={cropAmazonPdfCompat}
      metaTitle="Amazon Shipping Label Cropper - Free 4x6 Label Tool"
      metaDescription="Crop Amazon Easy Ship label PDFs automatically and ignore invoice pages. Create 4x6 thermal labels or 4-up A4 sheets in your browser."
      canonicalPath="/amazon-label-cropper"
      description="Crop Amazon Easy Ship labels fast and efficiently. Automatically detects the label area and removes unnecessary whitespace and packing slip details if configured."
      features={[
        { title: 'Smart Detection', desc: 'Automatically finds the Amazon Easy Ship label area.', icon: '⚡' },
        { title: 'Thermal Optimized', desc: 'Generates perfect 4x6 labels for your thermal printer.', icon: '🖨️' }
      ]}
      seoContent={`
        <h2>Amazon label cropper for Easy Ship sellers</h2>
        <p>Use this Amazon shipping label cropper when your PDF contains labels mixed with invoice or packing-slip pages. The tool focuses on the label pages and creates a cleaner print file for your dispatch workflow.</p>
        <h3>Amazon label printing options</h3>
        <ul>
          <li>4x6 thermal label output for dedicated label printers.</li>
          <li>4-up A4 output for sellers printing on standard sheets.</li>
          <li>Browser-side processing so customer label PDFs stay on your device.</li>
        </ul>
      `}
    />
  );
}
