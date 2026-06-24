import React from 'react';
import { Link } from 'react-router-dom';
import AdBanner from '../components/AdBanner';
import SEO from '../components/SEO';

const HOME_JSONLD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      name: 'LabelSnap',
      url: 'https://labelsnap.vercel.app/',
      description:
        'Free shipping label crop tool for Flipkart, Meesho and Amazon sellers in India.',
    },
    {
      '@type': 'Organization',
      name: 'LabelSnap',
      url: 'https://labelsnap.vercel.app/',
      logo: 'https://labelsnap.vercel.app/favicon.svg',
    },
    {
      '@type': 'WebApplication',
      name: 'LabelSnap Shipping Label Cropper',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web browser',
      url: 'https://labelsnap.vercel.app/',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    },
  ],
};

export default function Home() {
  return (
    <div className="home-page">
      <SEO
        title="Free Shipping Label Cropper for Amazon, Flipkart and Meesho"
        description="Crop Amazon, Flipkart and Meesho shipping label PDFs for 4x6 thermal printers or A4 sheets. Free, private and browser based."
        canonicalPath="/"
        jsonLd={HOME_JSONLD}
      />

      <section className="hero text-center py-16">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 gradient-text">Crop Shipping Labels Instantly</h1>
        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          The ultimate free tool for Flipkart, Meesho, and Amazon sellers. Automatically crop, resize, and print your shipping labels for thermal and A4 printers. 100% private and secure.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/flipkart-label-cropper" className="btn-primary text-lg px-8 py-3 shadow-lg hover:shadow-blue-500/20">
            Flipkart Cropper
          </Link>
          <Link to="/meesho-label-cropper" className="btn-secondary text-lg px-8 py-3 shadow-lg hover:shadow-purple-500/20">
            Meesho Cropper
          </Link>
          <Link to="/amazon-label-cropper" className="btn-secondary text-lg px-8 py-3 shadow-lg hover:shadow-teal-500/20">
            Amazon Cropper
          </Link>
        </div>
      </section>

      <section className="tools-grid grid md:grid-cols-3 gap-8 py-12">
        <div className="glass-card hover-lift">
          <div className="text-4xl mb-4">📦</div>
          <h3 className="text-2xl font-bold mb-3">Flipkart Crop</h3>
          <p className="text-gray-400 mb-6">Auto-detect and crop Flipkart labels perfectly. Adds SKU automatically.</p>
          <Link to="/flipkart-label-cropper" className="text-blue-400 font-medium hover:text-blue-300 flex items-center gap-2">
            Use Tool <span>→</span>
          </Link>
        </div>
        
        <div className="glass-card hover-lift">
          <div className="text-4xl mb-4">🛍️</div>
          <h3 className="text-2xl font-bold mb-3">Meesho Crop</h3>
          <p className="text-gray-400 mb-6">Supports all Meesho label formats: with invoice, without invoice, and courier-generated.</p>
          <Link to="/meesho-label-cropper" className="text-purple-400 font-medium hover:text-purple-300 flex items-center gap-2">
            Use Tool <span>→</span>
          </Link>
        </div>

        <div className="glass-card hover-lift">
          <div className="text-4xl mb-4">🛒</div>
          <h3 className="text-2xl font-bold mb-3">Amazon Crop</h3>
          <p className="text-gray-400 mb-6">Crop Amazon Easy Ship labels fast and efficiently. Ready for thermal print.</p>
          <Link to="/amazon-label-cropper" className="text-teal-400 font-medium hover:text-teal-300 flex items-center gap-2">
            Use Tool <span>→</span>
          </Link>
        </div>
      </section>

      <section className="studio-callout">
        <div>
          <span className="eyebrow">New: LabelSnap Studio</span>
          <h2>QR codes, barcodes and 12 purpose-built label makers.</h2>
          <p>Create print-ready shipping, product, inventory, price, batch, address and package labels without uploading business data.</p>
        </div>
        <Link to="/tools" className="btn-primary">Explore all tools</Link>
      </section>

      <section className="features py-12">
        <h2 className="text-3xl font-bold text-center mb-10">Why Sellers Love <span className="text-blue">LabelSnap</span></h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6">
            <h4 className="font-bold text-lg mb-2 text-blue-400">⚡ Auto-Detect</h4>
            <p className="text-sm text-gray-400">Our smart engine detects label dimensions automatically. No manual cropping needed.</p>
          </div>
          <div className="glass-card p-6">
            <h4 className="font-bold text-lg mb-2 text-purple-400">🖨️ Thermal & A4</h4>
            <p className="text-sm text-gray-400">Generate 4x6 labels for thermal printers or 4-up labels for standard A4 sticker sheets.</p>
          </div>
          <div className="glass-card p-6">
            <h4 className="font-bold text-lg mb-2 text-teal-400">🔒 Privacy First</h4>
            <p className="text-sm text-gray-400">Your labels never leave your browser. Processing happens entirely on your device.</p>
          </div>
          <div className="glass-card p-6">
            <h4 className="font-bold text-lg mb-2 text-pink-400">🆓 Free Forever</h4>
            <p className="text-sm text-gray-400">No sign-ups, no limits, no hidden costs. A truly free tool for the seller community.</p>
          </div>
        </div>
      </section>

      <section className="how-it-works py-12 text-center">
        <h2 className="text-3xl font-bold mb-10">How It Works</h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12">
          <div className="step relative">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-2xl font-bold mx-auto mb-4 border border-blue-500/30">1</div>
            <h4 className="font-bold">Upload PDF</h4>
            <p className="text-sm text-gray-400">Select your downloaded labels</p>
          </div>
          <div className="hidden md:block text-gray-600 text-2xl">→</div>
          <div className="step relative">
            <div className="w-16 h-16 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-2xl font-bold mx-auto mb-4 border border-purple-500/30">2</div>
            <h4 className="font-bold">Choose Format</h4>
            <p className="text-sm text-gray-400">Thermal or A4 sheet</p>
          </div>
          <div className="hidden md:block text-gray-600 text-2xl">→</div>
          <div className="step relative">
            <div className="w-16 h-16 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-2xl font-bold mx-auto mb-4 border border-teal-500/30">3</div>
            <h4 className="font-bold">Download</h4>
            <p className="text-sm text-gray-400">Print perfectly cropped labels</p>
          </div>
        </div>
      </section>
      
      <div className="py-8">
        <AdBanner variant="inline" />
      </div>

    </div>
  );
}
