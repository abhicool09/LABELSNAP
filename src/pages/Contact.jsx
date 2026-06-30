import React, { useState } from 'react';
import SEO from '../components/SEO';

export default function Contact() {
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('Thanks for reaching out! We will get back to you soon.');
    e.target.reset();
  };

  return (
    <div className="static-page max-w-4xl mx-auto py-12 px-4">
      <SEO
        title="Contact AI Label Cropper Support"
        description="Contact AI Label Cropper with questions, bug reports and feature requests for shipping-label and label-making tools."
        canonicalPath="/contact"
      />
      <h1 className="text-4xl font-bold mb-8 gradient-text text-center">Contact Us</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="glass-card p-8">
          <h3 className="text-2xl font-bold mb-4">Get in Touch</h3>
          <p className="text-gray-300 mb-6">
            Have a question, feature request, or found a bug? We'd love to hear from you. 
            Drop us a message or email us directly.
          </p>
          
          <div className="contact-info mt-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">✉️</span>
              <a href="mailto:support@labelsnap.com" className="text-blue-400 hover:underline">support@labelsnap.com</a>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌍</span>
              <span>Based in India, serving global sellers</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input type="text" required className="w-full bg-[#1a2235] border border-gray-600 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" required className="w-full bg-[#1a2235] border border-gray-600 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea required rows="4" className="w-full bg-[#1a2235] border border-gray-600 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500"></textarea>
            </div>
            <button type="submit" className="btn-primary mt-2">Send Message</button>
            
            {status && <p className="text-green-400 mt-2 text-sm">{status}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
