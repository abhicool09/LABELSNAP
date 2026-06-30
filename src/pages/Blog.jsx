import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { BLOG_POSTS } from '../content/blogPosts';

export default function Blog() {
  return (
    <div className="container py-16">
      <SEO
        title="AI Label Cropper Blog — Label Printing, QR & Barcode Guides"
        description="Practical guides for online sellers: crop and print Flipkart, Meesho and Amazon labels, make QR codes and barcodes, and create print-ready labels."
        canonicalPath="/blog"
      />

      <header className="tool-header text-center label-tools-hero">
        <span className="eyebrow">AI Label Cropper blog</span>
        <h1>Guides for sellers who print labels</h1>
        <p className="subtitle">Clear, practical how-tos for cropping marketplace labels, generating QR codes and barcodes, and making print-ready labels.</p>
      </header>

      <div className="blog-list">
        {BLOG_POSTS.map((post) => (
          <Link key={post.slug} to={`/blog/${post.slug}`} className="blog-card">
            <span className="blog-card__category">{post.category}</span>
            <h2 className="blog-card__title">{post.title}</h2>
            <p className="blog-card__excerpt">{post.excerpt}</p>
            <span className="blog-card__meta">{post.readMins} min read · Read guide →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
