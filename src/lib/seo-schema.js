export const SITE_URL = 'https://labelsnap.vercel.app';

export function siteUrl(path = '/') {
  return `${SITE_URL}${path}`;
}

// Builds a schema.org @graph for a tool page: SoftwareApplication + optional
// HowTo + optional FAQPage. Pass the same `faqs`/`steps` to the visible
// ToolSeoSection so the structured data matches on-page content.
export function buildToolSchema({ name, path, description, howToName, steps = [], faqs = [] }) {
  const url = siteUrl(path);
  const graph = [
    {
      '@type': 'SoftwareApplication',
      name,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web browser',
      url,
      description,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    },
  ];

  if (steps.length) {
    graph.push({
      '@type': 'HowTo',
      name: howToName || `How to use ${name}`,
      step: steps.map((step, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: step.name,
        text: step.text,
      })),
    });
  }

  if (faqs.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: { '@type': 'Answer', text: faq.a },
      })),
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

// Article schema for blog posts.
export function buildArticleSchema({ title, description, path, datePublished, faqs = [] }) {
  const graph = [
    {
      '@type': 'Article',
      headline: title,
      description,
      url: siteUrl(path),
      datePublished,
      dateModified: datePublished,
      author: { '@type': 'Organization', name: 'AI Label Cropper' },
      publisher: {
        '@type': 'Organization',
        name: 'AI Label Cropper',
        logo: { '@type': 'ImageObject', url: siteUrl('/favicon.svg') },
      },
      image: siteUrl('/og-image.png'),
      mainEntityOfPage: siteUrl(path),
    },
  ];

  if (faqs.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: { '@type': 'Answer', text: faq.a },
      })),
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}
