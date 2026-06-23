import React from 'react';

export default function AdBanner({ variant = 'inline' }) {
  return (
    <div className={`ad-banner ad-banner--${variant}`}>
      <div className="ad-banner__image">4x6</div>
      <div className="ad-banner__content">
        <h4 className="ad-banner__title">Premium Thermal Labels</h4>
        <p className="ad-banner__subtitle">
          Compatible with all thermal printers. 4x6 direct thermal rolls - no ink needed, crystal-clear prints every time.
        </p>
      </div>
      <a
        href="#"
        className="btn btn--secondary ad-banner__cta"
        onClick={(e) => e.preventDefault()}
      >
        Shop Now
      </a>
    </div>
  );
}
