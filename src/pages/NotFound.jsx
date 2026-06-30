import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function NotFound() {
  return (
    <div className="container py-16 text-center">
      <SEO
        title="Page Not Found - AI Label Cropper"
        description="The requested AI Label Cropper page could not be found."
        canonicalPath="/404"
        noindex
      />
      <h1 className="gradient-text">Page not found</h1>
      <p className="subtitle">That page may have moved, but the label tools are still right here.</p>
      <Link to="/tools" className="btn-primary mt-6">Browse all tools</Link>
    </div>
  );
}
