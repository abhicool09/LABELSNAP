import React from 'react';
import { Link } from 'react-router-dom';

// Visible on-page SEO content for tool pages: a "how to" list, optional intro
// copy, an accessible FAQ, and internal links to related tools. The faqs/steps
// passed here should match the JSON-LD built with buildToolSchema().
export default function ToolSeoSection({ intro, howTo, faqs = [], related = [] }) {
  return (
    <section className="tool-seo">
      {intro && <p className="tool-seo__intro">{intro}</p>}

      {howTo && howTo.steps && howTo.steps.length > 0 && (
        <div className="tool-seo__block">
          <h2>{howTo.title || 'How it works'}</h2>
          <ol className="tool-seo__steps">
            {howTo.steps.map((step) => (
              <li key={step.name}>
                <strong>{step.name}.</strong> {step.text}
              </li>
            ))}
          </ol>
        </div>
      )}

      {faqs.length > 0 && (
        <div className="tool-seo__block">
          <h2>Frequently asked questions</h2>
          <div className="tool-seo__faqs">
            {faqs.map((faq) => (
              <details className="tool-seo__faq" key={faq.q}>
                <summary>{faq.q}</summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      )}

      {related.length > 0 && (
        <div className="tool-seo__block">
          <h2>Related tools</h2>
          <div className="tool-seo__related">
            {related.map((item) => (
              <Link key={item.to} to={item.to} className="tool-seo__related-link">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
