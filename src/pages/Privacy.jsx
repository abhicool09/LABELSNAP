import React from 'react';
import SEO from '../components/SEO';

export default function Privacy() {
  return (
    <div className="static-page max-w-4xl mx-auto py-12 px-4">
      <SEO
        title="LabelSnap Privacy Policy"
        description="Read how LabelSnap processes shipping-label PDFs locally in your browser and protects customer and order information."
        canonicalPath="/privacy"
      />
      <h1 className="text-4xl font-bold mb-8 gradient-text text-center">Privacy Policy</h1>
      
      <div className="glass-card p-8 space-y-6 text-gray-300">
        <p>Last updated: June 2026</p>

        <h3 className="text-xl font-bold text-white mt-6">1. Local Browser Processing</h3>
        <p>
          At LabelSnap, privacy is our core feature. All PDF processing, cropping, and rendering happens <strong>entirely within your web browser</strong> using JavaScript. Your files, shipping labels, and customer data are never uploaded to our servers, stored, or transmitted anywhere.
        </p>

        <h3 className="text-xl font-bold text-white mt-6">2. Data We Do Not Collect</h3>
        <p>Because processing happens locally, we do not and cannot collect:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Your uploaded PDF files</li>
          <li>Customer names, addresses, or phone numbers</li>
          <li>Tracking IDs or Order IDs</li>
          <li>Tax invoices or financial data</li>
        </ul>

        <h3 className="text-xl font-bold text-white mt-6">3. Analytics</h3>
        <p>
          We use basic, anonymized analytics to understand site traffic (e.g., how many people visit the site, which tools are most popular). This data does not contain any personally identifiable information or tie back to your business operations.
        </p>

        <h3 className="text-xl font-bold text-white mt-6">4. Third-Party Links</h3>
        <p>
          Our website may contain links to purchase shipping supplies (like thermal labels). If you click these links, you will be directed to a third-party site. We are not responsible for the privacy practices of these other sites.
        </p>

        <h3 className="text-xl font-bold text-white mt-6">5. Contact Us</h3>
        <p>
          If you have any questions about this Privacy Policy, please contact us at support@labelsnap.com.
        </p>
      </div>
    </div>
  );
}
