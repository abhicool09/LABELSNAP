import React from 'react';
import ToolPage from '../components/ToolPage';

export default function MeeshoCrop() {
  return (
    <ToolPage
      title="Meesho Shipping Label Crop Tool"
      subtitle="Crop and resize Meesho shipping labels automatically (No Invoice)"
      marketplace="meesho"
      metaTitle="Meesho Label Cropper - Free Shipping Label Crop Tool"
      metaDescription="Crop Meesho shipping label PDFs automatically and remove invoice sections for 4x6 thermal or A4 label printing."
      canonicalPath="/meesho-label-cropper"
      description="Effortlessly crop Meesho labels downloaded from the Supplier Panel. This tool automatically detects the label dimensions, removing the invoice portion if present, to generate perfect, print-ready labels for your thermal or A4 printer."
      features={[
        { title: 'Auto Cropping', desc: 'Detects label dimensions automatically for standard Meesho formats.', icon: '✂️' },
        { title: 'Save Paper & Ink', desc: 'Removes the invoice section so you only print the required shipping label.', icon: '🍃' }
      ]}
      seoContent={`
        <h2>Meesho label cropper without invoice</h2>
        <p>This Meesho label cropper is for sellers who only want to print the shipping label. Upload the Meesho Supplier Panel PDF and download a cleaner print-ready PDF for dispatch.</p>
        <h3>Why sellers use it</h3>
        <ul>
          <li>Remove invoice portions when only the shipping label is needed.</li>
          <li>Prepare 4x6 thermal labels or A4 label sheets.</li>
          <li>Crop Meesho label PDFs without uploading files to a server.</li>
        </ul>
      `}
    />
  );
}
