import React from 'react';
import SEO from '../components/SEO';

export default function About() {
  return (
    <div className="static-page max-w-4xl mx-auto py-12 px-4">
      <SEO
        title="About LabelSnap - Private Label Tools for Online Sellers"
        description="Learn why LabelSnap builds free, privacy-first shipping label, barcode and QR tools for ecommerce sellers."
        canonicalPath="/about"
      />
      <h1 className="text-4xl font-bold mb-8 gradient-text text-center">About LabelSnap</h1>
      
      <div className="glass-card p-8 space-y-6">
        <p className="text-lg">
          LabelSnap was built to solve a simple but frustrating problem for e-commerce sellers in India: printing shipping labels shouldn't be hard.
        </p>
        
        <p>
          Whether you sell on Flipkart, Meesho, or Amazon, you've likely struggled with downloading PDFs, taking screenshots, cropping manually, and trying to fit them onto thermal rolls or A4 sticker sheets. It wastes time, paper, and ink.
        </p>

        <p>
          We created LabelSnap to automate this entire workflow. Our smart engine automatically detects the marketplace label format, crops exactly what's needed (removing white space and optional invoices), and generates a perfect PDF ready for printing.
        </p>

        <h3 className="text-2xl font-bold pt-4 text-blue-400">Our Mission</h3>
        <p>
          To provide the most reliable, fast, and privacy-first tools for the Indian e-commerce seller community. 
        </p>

        <h3 className="text-2xl font-bold pt-4 text-teal-400">Privacy First</h3>
        <p>
          Unlike other tools that upload your sensitive customer data and shipping labels to a server, <strong>LabelSnap processes everything entirely inside your web browser</strong>. Your files never leave your device. We believe your business data is yours alone.
        </p>
      </div>
    </div>
  );
}
