import React from 'react';
import { Link } from 'react-router-dom';
import AdBanner from '../components/AdBanner';
import SEO from '../components/SEO';
import { TOOL_INVENTORY } from '../lib/label-tools';
import ProductCheckout from '../components/ProductCheckout';

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

const CROPPERS = [
  { to: '/flipkart-label-cropper', title: 'Flipkart label crop', text: 'Auto-detect, crop and add SKU.', icon: '📦' },
  { to: '/meesho-label-cropper', title: 'Meesho label crop', text: 'Invoice, no-invoice & courier formats.', icon: '🛍️' },
  { to: '/amazon-label-cropper', title: 'Amazon label crop', text: 'Easy Ship labels, thermal ready.', icon: '🛒' },
  { to: '/shipping-label-cropper', title: 'Any label cropper', text: 'Works with any marketplace PDF.', icon: '✂️' },
  { to: '/merge', title: 'Merge label PDFs', text: 'Combine many PDFs into one file.', icon: '🗂️' },
  { to: '/4x6-label-print-a4', title: '4×6 labels on A4', text: 'Arrange thermal labels on a sheet.', icon: '🖨️' },
];

const GENERATORS = TOOL_INVENTORY.filter((tool) => tool.to.includes('generator'));
const MAKERS = TOOL_INVENTORY.filter((tool) => !tool.to.includes('generator'));

const FEATURES = [
  { icon: '⚡', title: 'Auto-detect', text: 'The engine finds label dimensions for you — no manual cropping.' },
  { icon: '🖨️', title: 'Thermal & A4', text: '4×6 for thermal printers or 4-up on standard A4 sticker sheets.' },
  { icon: '🔒', title: 'Private by design', text: 'Files never leave your browser. Everything runs on your device.' },
  { icon: '🆓', title: 'Free forever', text: 'No sign-ups, no limits, no hidden costs. Built for sellers.' },
];

const SELLER_GUIDES = [
  {
    to: '/blog/amazon-easy-ship-label-guide',
    category: 'Amazon sellers',
    title: 'Crop Amazon Easy Ship labels for 4x6 printers',
    text: 'Skip invoice pages, preserve barcode quiet zones and print at the correct size.',
  },
  {
    to: '/blog/flipkart-label-printing-guide',
    category: 'Flipkart sellers',
    title: 'Print Flipkart labels on thermal or A4 paper',
    text: 'A practical workflow from Seller Hub download to a clean print-ready label.',
  },
  {
    to: '/blog/meesho-label-printing-guide',
    category: 'Meesho suppliers',
    title: 'Choose the correct Meesho label and invoice format',
    text: 'Understand no-invoice, with-invoice and courier-generated label layouts.',
  },
];

function ToolTile({ to, icon, title, text }) {
  return (
    <Link className="label-tool-tile" to={to}>
      <span className="label-tool-icon" aria-hidden="true">{icon}</span>
      <span>
        <strong>{title}</strong>
        <small>{text}</small>
      </span>
      <span className="label-tool-arrow" aria-hidden="true">→</span>
    </Link>
  );
}

export default function Home() {
  return (
    <div className="home-page container">
      <SEO
        title="Free Shipping Label Cropper for Amazon, Flipkart and Meesho"
        description="Crop Amazon, Flipkart and Meesho shipping label PDFs for 4x6 thermal printers or A4 sheets. Plus QR codes, barcodes and 12 free label makers. Browser based and private."
        canonicalPath="/"
        jsonLd={HOME_JSONLD}
      />

      <section className="home-hero text-center">
        <span className="eyebrow">Free · Private · No sign-up</span>
        <h1 className="home-hero__title">
          Crop, print &amp; create shipping labels <span className="text-blue">in seconds</span>
        </h1>
        <p className="home-hero__subtitle">
          Auto-crop Flipkart, Meesho and Amazon labels — then generate QR codes, barcodes and 12 kinds
          of print-ready labels. Everything runs in your browser, so your data never leaves your device.
        </p>
        <div className="home-hero__actions">
          <a href="#tools" className="btn-primary">Browse all tools</a>
          <Link to="/flipkart-label-cropper" className="btn-secondary">Crop a label now</Link>
        </div>
      </section>

      <section id="tools" className="tool-directory">
        <div className="section-head text-center">
          <h2>All label tools</h2>
          <p className="text-muted">Pick a tool and start instantly — no account, instant download.</p>
        </div>

        <h3 className="tool-group-title">Shipping label croppers</h3>
        <div className="label-tools-grid">
          {CROPPERS.map((tool) => (
            <ToolTile key={tool.to} {...tool} />
          ))}
        </div>

        <h3 className="tool-group-title">QR &amp; barcode generators</h3>
        <div className="label-tools-grid">
          {GENERATORS.map((tool) => (
            <ToolTile key={tool.to} {...tool} />
          ))}
        </div>

        <h3 className="tool-group-title">Label makers</h3>
        <div className="label-tools-grid">
          {MAKERS.map((tool) => (
            <ToolTile key={tool.to} {...tool} />
          ))}
        </div>
      </section>

      <section className="label-products">
        <div className="section-head text-center">
          <span className="eyebrow">Thermal label sizes</span>
          <h2>Choose the right roll for every parcel</h2>
          <p className="text-muted">Blank direct-thermal labels for crisp, ink-free shipping and courier printing.</p>
        </div>

        <div className="product-card-grid">
          <article className="product-card">
            <div className="product-card__visual">
              <span className="product-card__badge">Most popular</span>
              <img
                src="/images/products/thermal-label-roll-4x6.png"
                alt="Blank 4 by 6 inch direct thermal shipping label roll"
                loading="lazy"
              />
            </div>
            <div className="product-card__body">
              <div className="product-card__heading">
                <div>
                  <span className="product-card__category">Shipping standard</span>
                  <h3>4 × 6 inch thermal labels</h3>
                </div>
                <strong className="product-card__size">100 × 150 mm</strong>
              </div>
              <p>
                The universal size for marketplace, courier and warehouse shipping labels. Plenty of room for
                addresses, routing details and large scannable barcodes.
              </p>
              <ul className="product-card__features">
                <li>Ideal for Amazon, Flipkart, Meesho and courier labels</li>
                <li>Direct thermal — no ink or toner required</li>
                <li>Strong self-adhesive backing for parcels and poly mailers</li>
              </ul>
              <Link className="product-card__action" to="/shipping-label-cropper">
                Prepare 4×6 labels <span aria-hidden="true">→</span>
              </Link>
              <ProductCheckout productId="thermal-4x6" />
            </div>
          </article>

          <article className="product-card">
            <div className="product-card__visual product-card__visual--cool">
              <span className="product-card__badge product-card__badge--soft">Compact</span>
              <img
                src="/images/products/thermal-label-roll-3x5.png"
                alt="Blank 3 by 5 inch compact direct thermal label roll"
                loading="lazy"
              />
            </div>
            <div className="product-card__body">
              <div className="product-card__heading">
                <div>
                  <span className="product-card__category">Space saver</span>
                  <h3>3 × 5 inch thermal labels</h3>
                </div>
                <strong className="product-card__size">76 × 127 mm</strong>
              </div>
              <p>
                A compact format for smaller parcels, product identification and lightweight courier workflows
                where a full 4×6 label is unnecessary.
              </p>
              <ul className="product-card__features">
                <li>Great for compact boxes, pouches and internal labels</li>
                <li>Bright white surface for sharp barcode contrast</li>
                <li>Rounded corners and easy-peel liner</li>
              </ul>
              <Link className="product-card__action" to="/tools">
                Explore compact label tools <span aria-hidden="true">→</span>
              </Link>
              <ProductCheckout productId="thermal-3x5" />
            </div>
          </article>
        </div>
      </section>

      <div className="home-ad">
        <AdBanner variant="inline" />
      </div>

      <section className="home-guides">
        <div className="section-head text-center">
          <span className="eyebrow">Seller knowledge base</span>
          <h2>Print every marketplace label correctly</h2>
          <p className="text-muted">Short guides for cleaner barcodes, correct sizing and fewer wasted sheets.</p>
        </div>
        <div className="blog-list">
          {SELLER_GUIDES.map((guide) => (
            <Link key={guide.to} to={guide.to} className="blog-card">
              <span className="blog-card__category">{guide.category}</span>
              <h3 className="blog-card__title">{guide.title}</h3>
              <p className="blog-card__excerpt">{guide.text}</p>
              <span className="blog-card__meta">Read guide →</span>
            </Link>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link to="/blog" className="btn-secondary">Browse all seller guides</Link>
        </div>
      </section>

      <section className="features">
        <div className="section-head text-center">
          <h2>Why sellers love <span className="text-blue">LabelSnap</span></h2>
        </div>
        <div className="feature-grid">
          {FEATURES.map((feature) => (
            <div className="feature-card" key={feature.title}>
              <span className="feature-card__icon" aria-hidden="true">{feature.icon}</span>
              <h4 className="feature-card__title">{feature.title}</h4>
              <p className="feature-card__text">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="how-it-works text-center">
        <div className="section-head text-center">
          <h2>How it works</h2>
        </div>
        <div className="steps">
          <div className="step">
            <span className="step__num">1</span>
            <h4>Upload your PDF</h4>
            <p className="text-muted">Select the labels you downloaded.</p>
          </div>
          <span className="step__arrow" aria-hidden="true">→</span>
          <div className="step">
            <span className="step__num">2</span>
            <h4>Choose a format</h4>
            <p className="text-muted">4×6 thermal or A4 sheet.</p>
          </div>
          <span className="step__arrow" aria-hidden="true">→</span>
          <div className="step">
            <span className="step__num">3</span>
            <h4>Download &amp; print</h4>
            <p className="text-muted">Perfectly cropped, print-ready labels.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
