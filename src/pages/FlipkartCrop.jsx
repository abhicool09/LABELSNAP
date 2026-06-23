import React from 'react';
import ToolPage from '../components/ToolPage';

export default function FlipkartCrop() {
  return (
    <ToolPage
      title="Flipkart Shipping Label Crop Tool"
      subtitle="Auto-crop and resize Flipkart shipping labels for printing"
      marketplace="flipkart"
      metaTitle="Flipkart Label Cropper - Free Shipping Label Crop Tool"
      metaDescription="Crop Flipkart shipping label PDFs automatically for 4x6 thermal printers or 4-label A4 sheets. Private browser-based Flipkart label cropper."
      canonicalPath="/flipkart-label-cropper"
      description="Experience the power of automation with our Flipkart label cropping tool. With automatic detection of length and width, you can say goodbye to manual measurements. Our tool intelligently adjusts the crop size based on the label, ensuring a perfect fit every time. Streamline your workflow and enhance efficiency with our automated solution."
      features={[
        { title: 'Automatic Dimension Detection', desc: 'Auto-detects label length and width, no manual measurements needed.', icon: '⚡' },
        { title: 'Thermal & A4 Support', desc: 'Crops, rotates, and arranges labels for 4x6 thermal printing or positions 4 labels per A4 sticker sheet.', icon: '🖨️' },
        { title: 'One-Click Workflow', desc: 'Instantly process multi-page PDFs with a single click.', icon: '🚀' }
      ]}
      seoContent={`
        <h2>Flipkart label cropper for seller PDFs</h2>
        <p>This Flipkart label cropper is built for sellers who download multi-page shipping label PDFs and need print-ready output without screenshots or manual crop settings.</p>
        <h3>Best use cases</h3>
        <ul>
          <li>Crop Flipkart shipping labels for 4x6 thermal printers.</li>
          <li>Arrange Flipkart labels on A4 paper for sticker-sheet printing.</li>
          <li>Process bulk Flipkart label PDFs directly in the browser.</li>
        </ul>
        <h3>How to crop Flipkart labels</h3>
        <ol>
          <li>Download your label PDF from the Flipkart seller dashboard.</li>
          <li>Upload the PDF to this tool.</li>
          <li>Select 4x6 Thermal or A4 Sheet.</li>
          <li>Download the cropped, print-ready PDF.</li>
        </ol>
      `}
    />
  );
}
