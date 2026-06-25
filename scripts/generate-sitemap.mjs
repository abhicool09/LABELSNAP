import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { SEO_PAGES } from './seo-pages.mjs';

const siteUrl = getSiteUrl();
const distDir = resolve('dist');
const baseHtml = await readFile(resolve(distDir, 'index.html'), 'utf8');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${SEO_PAGES
  .filter((page) => !page.noindex)
  .map(
    (page) => `  <url>
    <loc>${escapeXml(`${siteUrl}${page.path}`)}</loc>${page.datePublished ? `
    <lastmod>${page.datePublished}</lastmod>` : ''}
  </url>`
  )
  .join('\n')}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

await mkdir(distDir, { recursive: true });
await Promise.all([
  writeFile(resolve(distDir, 'sitemap.xml'), sitemap, 'utf8'),
  writeFile(resolve(distDir, 'robots.txt'), robots, 'utf8'),
  ...SEO_PAGES.map(async (page) => {
    const outputPath =
      page.path === '/'
        ? resolve(distDir, 'index.html')
        : resolve(distDir, page.path.slice(1), 'index.html');
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, renderRouteHtml(baseHtml, page), 'utf8');
  }),
  writeFile(
    resolve(distDir, '404.html'),
    renderRouteHtml(baseHtml, {
      path: '/404',
      title: 'Page Not Found - LabelSnap',
      description: 'The requested LabelSnap page could not be found.',
      heading: 'Page not found',
      intro: 'The page may have moved. Browse the free LabelSnap tools instead.',
      links: [['/tools', 'Browse all LabelSnap tools']],
      noindex: true,
    }),
    'utf8',
  ),
]);

await verifyGeneratedSite();

console.log(`Generated and verified ${SEO_PAGES.length} route HTML files, sitemap.xml and robots.txt for ${siteUrl}`);

function getSiteUrl() {
  const explicitUrl = process.env.SITE_URL || process.env.VITE_SITE_URL;
  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const rawUrl = explicitUrl || (vercelUrl ? `https://${vercelUrl}` : 'https://labelsnap.vercel.app');
  return rawUrl.replace(/\/+$/, '');
}

function renderRouteHtml(template, page) {
  const canonicalUrl = `${siteUrl}${page.path}`;
  const robots = page.noindex ? 'noindex, nofollow' : 'index, follow';
  const schema = buildSchema(page, canonicalUrl);
  let html = template.replace('<html lang="en">', '<html lang="en-IN">');

  html = replaceTitle(html, page.title);
  html = replaceMeta(html, 'name', 'description', page.description);
  html = replaceMeta(html, 'name', 'robots', robots);
  html = replaceMeta(html, 'property', 'og:title', page.title);
  html = replaceMeta(html, 'property', 'og:description', page.description);
  html = replaceMeta(html, 'property', 'og:type', page.kind === 'article' ? 'article' : 'website');
  html = replaceMeta(html, 'property', 'og:url', canonicalUrl);
  html = replaceMeta(html, 'name', 'twitter:title', page.title);
  html = replaceMeta(html, 'name', 'twitter:description', page.description);
  html = insertHead(
    html,
    `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />
    <meta property="og:locale" content="en_IN" />
    <script type="application/ld+json" data-seo-static-jsonld="true">${safeJson(schema)}</script>`,
  );
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root">${renderFallback(page)}</div>`,
  );

  return html;
}

function renderFallback(page) {
  const links = page.links?.length
    ? `<nav aria-label="Related LabelSnap pages"><h2>Related tools and guides</h2><ul>${page.links
        .map(
          ([href, label]) =>
            `<li><a href="${escapeHtml(href)}">${escapeHtml(label)}</a></li>`,
        )
        .join('')}</ul></nav>`
    : '';
  const articleBody = page.kind === 'article' && page.body ? page.body : '';

  return `<main data-seo-fallback style="max-width:900px;margin:48px auto;padding:24px;font-family:Inter,Arial,sans-serif;line-height:1.65;color:#172033">
      <a href="/" style="font-weight:800;color:#0866e9;text-decoration:none">LabelSnap</a>
      <article>
        <h1 style="font-size:clamp(2rem,5vw,3.4rem);line-height:1.1">${escapeHtml(page.heading)}</h1>
        <p style="font-size:1.15rem">${escapeHtml(page.intro)}</p>
        ${articleBody}
      </article>
      ${links}
      <p><a href="/tools">Explore all free label tools</a></p>
    </main>`;
}

function buildSchema(page, canonicalUrl) {
  const base = {
    '@context': 'https://schema.org',
    '@type': page.kind === 'article' ? 'Article' : 'WebPage',
    name: page.heading,
    headline: page.heading,
    description: page.description,
    url: canonicalUrl,
    inLanguage: 'en-IN',
    isPartOf: {
      '@type': 'WebSite',
      name: 'LabelSnap',
      url: `${siteUrl}/`,
    },
  };

  if (page.kind === 'article') {
    base.datePublished = page.datePublished;
    base.dateModified = page.datePublished;
    base.author = { '@type': 'Organization', name: 'LabelSnap' };
    base.publisher = { '@type': 'Organization', name: 'LabelSnap' };
  }

  if (
    !page.noindex &&
    page.path !== '/' &&
    page.path !== '/blog' &&
    !page.path.startsWith('/blog/') &&
    !['/about', '/contact', '/privacy', '/terms'].includes(page.path)
  ) {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        base,
        {
          '@type': 'SoftwareApplication',
          name: page.heading,
          description: page.description,
          url: canonicalUrl,
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web browser',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
        },
      ],
    };
  }

  return base;
}

function replaceTitle(html, title) {
  return html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
}

function replaceMeta(html, attribute, key, content) {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const expression = new RegExp(
    `<meta\\s+${attribute}="${escapedKey}"\\s+content="[^"]*"\\s*\\/?>`,
    'i',
  );
  const tag = `<meta ${attribute}="${key}" content="${escapeHtml(content)}" />`;
  return expression.test(html) ? html.replace(expression, tag) : insertHead(html, tag);
}

function insertHead(html, content) {
  return html.replace('</head>', `    ${content}\n  </head>`);
}

function safeJson(value) {
  return JSON.stringify(value).replaceAll('<', '\\u003c');
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

async function verifyGeneratedSite() {
  const failures = [];

  for (const page of SEO_PAGES) {
    const outputPath =
      page.path === '/'
        ? resolve(distDir, 'index.html')
        : resolve(distDir, page.path.slice(1), 'index.html');
    const html = await readFile(outputPath, 'utf8');
    const canonicalUrl = `${siteUrl}${page.path}`;

    if (!html.includes(`<title>${escapeHtml(page.title)}</title>`)) {
      failures.push(`${page.path}: title`);
    }
    if (!html.includes(`rel="canonical" href="${escapeHtml(canonicalUrl)}"`)) {
      failures.push(`${page.path}: canonical`);
    }
    if (!html.includes('data-seo-fallback')) {
      failures.push(`${page.path}: crawlable fallback`);
    }
    if (!html.includes(page.noindex ? 'noindex, nofollow' : 'index, follow')) {
      failures.push(`${page.path}: robots directive`);
    }
  }

  const sitemapHtml = await readFile(resolve(distDir, 'sitemap.xml'), 'utf8');
  const sitemapCount = (sitemapHtml.match(/<url>/g) || []).length;
  const expectedCount = SEO_PAGES.filter((page) => !page.noindex).length;

  if (sitemapCount !== expectedCount) {
    failures.push(`sitemap: expected ${expectedCount} URLs, found ${sitemapCount}`);
  }

  if (failures.length > 0) {
    throw new Error(`SEO build verification failed:\n- ${failures.join('\n- ')}`);
  }
}
