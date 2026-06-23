import React from 'react';
import MergeTool from '../components/MergeTool';

export default function MergePdf() {
  return (
    <div className="merge-page">
      <MergeTool />
      
      <div className="tool-content mt-12 max-w-4xl mx-auto px-4">
        <div className="description mb-8">
          <h2>About PDF Merge Tool</h2>
          <p>Merge multiple Amazon, Flipkart, or Meesho PDF labels in the exact order you want. This tool is perfect for combining labels from different platforms or days into a single print run.</p>
        </div>

        <div className="features-grid mb-12">
          <div className="glass-card feature">
            <span className="icon">🔄</span>
            <h3>Custom Ordering</h3>
            <p>Arrange your PDFs in any specific sequence before merging using drag-and-drop.</p>
          </div>
          <div className="glass-card feature">
            <span className="icon">💻</span>
            <h3>Browser Based</h3>
            <p>100% processed in your browser. No files are uploaded to our servers, ensuring your privacy.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
