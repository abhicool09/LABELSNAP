import React from 'react';
import SEO from '../components/SEO';

export default function Terms() {
  return (
    <div className="static-page max-w-4xl mx-auto py-12 px-4">
      <SEO
        title="AI Label Cropper Terms of Service"
        description="Review the terms for using AI Label Cropper browser-based shipping-label, PDF, barcode and QR-code tools."
        canonicalPath="/terms"
      />
      <h1 className="text-4xl font-bold mb-8 gradient-text text-center">Terms of Service</h1>
      
      <div className="glass-card p-8 space-y-6 text-gray-300">
        <p>Last updated: June 2026</p>

        <h3 className="text-xl font-bold text-white mt-6">1. Acceptance of Terms</h3>
        <p>
          By accessing and using AI Label Cropper, you accept and agree to be bound by the terms and provision of this agreement.
        </p>

        <h3 className="text-xl font-bold text-white mt-6">2. Use of Service</h3>
        <p>
          AI Label Cropper provides a free, browser-based tool for cropping e-commerce shipping labels. The tool is provided "as is" without any guarantees. You are solely responsible for verifying the accuracy of the cropped labels before printing or shipping.
        </p>

        <h3 className="text-xl font-bold text-white mt-6">3. No Liability</h3>
        <p>
          AI Label Cropper shall not be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Your use or inability to use the service</li>
          <li>Any errors in the cropped output (e.g., cut off barcodes or missing information)</li>
          <li>Any delays in your shipping process caused by the tool</li>
        </ul>

        <h3 className="text-xl font-bold text-white mt-6">4. Intellectual Property</h3>
        <p>
          The service and its original content, features, and functionality are and will remain the exclusive property of AI Label Cropper and its licensors.
        </p>

        <h3 className="text-xl font-bold text-white mt-6">5. Changes to Terms</h3>
        <p>
          We reserve the right to modify or replace these Terms at any time. We will try to provide at least 30 days notice prior to any new terms taking effect.
        </p>
      </div>
    </div>
  );
}
