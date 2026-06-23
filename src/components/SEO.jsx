import { useEffect } from 'react';

const DEFAULT_TITLE = 'LabelSnap - Free Shipping Label Crop Tool';
const DEFAULT_DESCRIPTION =
  'Free shipping label crop tool for Flipkart, Meesho, and Amazon sellers. Auto-crop labels for 4x6 thermal printers and A4 sheets.';

export default function SEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  canonicalPath = '/',
  type = 'website',
}) {
  useEffect(() => {
    const origin = getSiteOrigin();
    const canonicalUrl = new URL(canonicalPath, origin).toString();

    document.title = title;
    setMeta('description', description);
    setMeta('robots', 'index, follow');
    setMeta('og:title', title, 'property');
    setMeta('og:description', description, 'property');
    setMeta('og:type', type, 'property');
    setMeta('og:url', canonicalUrl, 'property');
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setCanonical(canonicalUrl);
  }, [canonicalPath, description, title, type]);

  return null;
}

function getSiteOrigin() {
  const envUrl = import.meta.env.VITE_SITE_URL;
  if (envUrl) return envUrl;
  if (typeof window !== 'undefined') return window.location.origin;
  return 'https://labelsnap.vercel.app';
}

function setMeta(name, content, attribute = 'name') {
  let element = document.head.querySelector(`meta[${attribute}="${name}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function setCanonical(href) {
  let element = document.head.querySelector('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}
