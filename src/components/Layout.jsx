import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const meeshoLinks = [
  { to: '/meesho-label-cropper', label: 'No Invoice' },
  { to: '/meesho-label-cropper-with-invoice', label: 'With Invoice' },
  { to: '/meesho-courier-label-cropper', label: 'Courier No Invoice' },
  { to: '/meesho-courier-label-cropper-with-invoice', label: 'Courier With Invoice' },
];

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    setMobileOpen(false);
    setToolsOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!toolsOpen) return undefined;
    const onPointerDown = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setToolsOpen(false);
      }
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setToolsOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [toolsOpen]);

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="navbar__inner">
          <Link to="/" className="navbar__logo" aria-label="LabelSnap home">
            <span className="navbar__logo-mark" aria-hidden="true">
              <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9.5V6a3 3 0 0 1 3-3h3.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                <path d="M29 22.5V26a3 3 0 0 1-3 3h-3.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                <rect className="navbar__logo-tag" x="9" y="9" width="14" height="14" rx="3.5" />
                <path d="M17.5 11 L12.8 16.8 H15.8 L14.5 21 L19.2 15.2 H16.2 L17.5 11 Z" fill="#ffffff" />
              </svg>
            </span>
            <span className="navbar__logo-text">LabelSnap</span>
          </Link>

          <div className="navbar__links">
            <NavLink to="/" end className={({ isActive }) => `navbar__link${isActive ? ' active' : ''}`}>
              Home
            </NavLink>

            <div className={`navbar__dropdown${toolsOpen ? ' open' : ''}`} ref={dropdownRef}>
              <button
                className="navbar__dropdown-trigger"
                type="button"
                aria-haspopup="true"
                aria-expanded={toolsOpen}
                onClick={() => setToolsOpen((value) => !value)}
              >
                Tools
                <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <div className="navbar__dropdown-menu" role="menu">
                <Link to="/tools" className="navbar__dropdown-item" role="menuitem">
                  <span className="navbar__dropdown-emoji" aria-hidden="true">✦</span>
                  <span>
                    <span className="navbar__dropdown-item-title">All label tools</span>
                    <span className="navbar__dropdown-item-sub">QR, barcode & label makers</span>
                  </span>
                </Link>
                <Link to="/qr-code-generator" className="navbar__dropdown-item" role="menuitem">
                  <span className="navbar__dropdown-emoji" aria-hidden="true">▦</span>
                  <span className="navbar__dropdown-item-title">QR code generator</span>
                </Link>
                <Link to="/barcode-generator" className="navbar__dropdown-item" role="menuitem">
                  <span className="navbar__dropdown-emoji" aria-hidden="true">▥</span>
                  <span className="navbar__dropdown-item-title">Barcode generator</span>
                </Link>
                <Link to="/ai-label-studio" className="navbar__dropdown-item" role="menuitem">
                  <span className="navbar__dropdown-emoji" aria-hidden="true">✎</span>
                  <span>
                    <span className="navbar__dropdown-item-title">LabelSnap Studio</span>
                    <span className="navbar__dropdown-item-sub">Bulk CSV & A4 label sheets</span>
                  </span>
                </Link>

                <div className="navbar__dropdown-divider" />
                <div className="navbar__dropdown-label">Shipping croppers</div>
                <Link to="/flipkart-label-cropper" className="navbar__dropdown-item" role="menuitem">
                  <span className="navbar__dropdown-emoji" aria-hidden="true">📦</span>
                  <span>
                    <span className="navbar__dropdown-item-title">Flipkart</span>
                    <span className="navbar__dropdown-item-sub">Label crop</span>
                  </span>
                </Link>

                <div className="navbar__dropdown-divider" />
                <div className="navbar__dropdown-label">Meesho</div>
                {meeshoLinks.map((link) => (
                  <Link key={link.to} to={link.to} className="navbar__dropdown-item" role="menuitem">
                    <span className="navbar__dropdown-emoji" aria-hidden="true">🛍️</span>
                    <span className="navbar__dropdown-item-title">{link.label}</span>
                  </Link>
                ))}

                <div className="navbar__dropdown-divider" />
                <Link to="/amazon-label-cropper" className="navbar__dropdown-item" role="menuitem">
                  <span className="navbar__dropdown-emoji" aria-hidden="true">🛒</span>
                  <span>
                    <span className="navbar__dropdown-item-title">Amazon</span>
                    <span className="navbar__dropdown-item-sub">Label crop</span>
                  </span>
                </Link>
              </div>
            </div>

            <NavLink to="/merge" className={({ isActive }) => `navbar__link${isActive ? ' active' : ''}`}>
              Merge PDF
            </NavLink>

            <NavLink to="/blog" className={({ isActive }) => `navbar__link${isActive ? ' active' : ''}`}>
              Blog
            </NavLink>

            <NavLink to="/about" className={({ isActive }) => `navbar__link${isActive ? ' active' : ''}`}>
              About
            </NavLink>
          </div>

          <button
            className="navbar__hamburger"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      <div className={`navbar__mobile-menu${mobileOpen ? ' open' : ''}`}>
        <Link to="/" className="navbar__mobile-link">Home</Link>
        <Link to="/tools" className="navbar__mobile-link">All Label Tools</Link>
        <Link to="/qr-code-generator" className="navbar__mobile-link">QR Generator</Link>
        <Link to="/barcode-generator" className="navbar__mobile-link">Barcode Generator</Link>
        <Link to="/ai-label-studio" className="navbar__mobile-link">LabelSnap Studio</Link>

        <div className="navbar__mobile-section">
          <div className="navbar__mobile-section-title">Flipkart</div>
          <Link to="/flipkart-label-cropper" className="navbar__mobile-sublink">Label Crop</Link>
        </div>

        <div className="navbar__mobile-section">
          <div className="navbar__mobile-section-title">Meesho</div>
          {meeshoLinks.map((link) => (
            <Link key={link.to} to={link.to} className="navbar__mobile-sublink">{link.label}</Link>
          ))}
        </div>

        <div className="navbar__mobile-section">
          <div className="navbar__mobile-section-title">Amazon</div>
          <Link to="/amazon-label-cropper" className="navbar__mobile-sublink">Label Crop</Link>
        </div>

        <Link to="/merge" className="navbar__mobile-link">Merge PDF</Link>
        <Link to="/blog" className="navbar__mobile-link">Blog</Link>
        <Link to="/about" className="navbar__mobile-link">About</Link>
        <Link to="/contact" className="navbar__mobile-link">Contact</Link>
      </div>

      <main className="page-enter" key={location.pathname}>
        {children}
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer__grid">
            <div>
              <h4 className="footer__heading">Tools</h4>
              <Link to="/shipping-label-cropper" className="footer__link">Shipping Label Cropper</Link>
              <Link to="/tools" className="footer__link">All Label Tools</Link>
              <Link to="/qr-code-generator" className="footer__link">QR Code Generator</Link>
              <Link to="/barcode-generator" className="footer__link">Barcode Generator</Link>
              <Link to="/shipping-label-maker" className="footer__link">Shipping Label Maker</Link>
              <Link to="/product-label-maker" className="footer__link">Product Label Maker</Link>
              <Link to="/flipkart-label-cropper" className="footer__link">Flipkart Label Crop</Link>
              <Link to="/meesho-label-cropper" className="footer__link">Meesho Label Crop</Link>
              <Link to="/meesho-label-cropper-with-invoice" className="footer__link">Meesho With Invoice</Link>
              <Link to="/meesho-courier-label-cropper" className="footer__link">Meesho Courier</Link>
              <Link to="/amazon-label-cropper" className="footer__link">Amazon Label Crop</Link>
              <Link to="/4x6-label-print-a4" className="footer__link">Print Labels on A4</Link>
              <Link to="/merge" className="footer__link">Merge PDF</Link>
            </div>
            <div>
              <h4 className="footer__heading">Company</h4>
              <Link to="/blog" className="footer__link">Blog</Link>
              <Link to="/about" className="footer__link">About</Link>
              <Link to="/contact" className="footer__link">Contact</Link>
            </div>
            <div>
              <h4 className="footer__heading">Legal</h4>
              <Link to="/privacy" className="footer__link">Privacy Policy</Link>
              <Link to="/terms" className="footer__link">Terms of Service</Link>
            </div>
          </div>
          <div className="footer__bottom">
            (c) {new Date().getFullYear()} <span className="text-blue">LabelSnap</span>. All rights reserved. Free shipping label crop tool for Indian e-commerce sellers.
          </div>
        </div>
      </footer>
    </>
  );
}
