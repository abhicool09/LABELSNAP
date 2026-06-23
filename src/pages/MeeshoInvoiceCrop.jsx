import React from 'react';
import ToolPage from '../components/ToolPage';

export default function MeeshoInvoiceCrop() {
  return (
    <ToolPage
      title="Meesho Label Crop Tool (With Invoice)"
      subtitle="Crop Meesho labels and keep the invoice as a separate page"
      marketplace="meesho_invoice"
      metaTitle="Meesho Label Cropper With Invoice - Free PDF Tool"
      metaDescription="Crop Meesho shipping labels and keep the tax invoice as a separate cropped page for thermal or A4 printing."
      canonicalPath="/meesho-label-cropper-with-invoice"
      description="Best for sellers required to include a physical tax invoice. This tool crops the shipping label first, then keeps the invoice as its own cropped page in the final PDF."
      features={[
        { title: 'Preserves Invoice', desc: 'Keeps the tax invoice alongside the shipping label.', icon: '📄' },
        { title: 'A4 Optimization', desc: 'Supports packing 4 label+invoice pairs on A4 sheets to save paper.', icon: '🖨️' }
      ]}
      seoContent={`
        <h2>Meesho label cropper with invoice</h2>
        <p>Use this version when your shipment needs both the Meesho shipping label and the tax invoice. The output keeps the shipping label and invoice as separate cropped pages so they can be printed cleanly.</p>
        <h3>Good for</h3>
        <ul>
          <li>Meesho orders where an invoice must be included with the package.</li>
          <li>Sellers who want separate cropped label and invoice pages.</li>
          <li>4x6 thermal printing or A4 sheet printing from one PDF.</li>
        </ul>
      `}
    />
  );
}
