import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const routes = [
  '/',
  '/shipping-label-cropper',
  '/flipkart-label-cropper',
  '/meesho-label-cropper',
  '/meesho-label-cropper-with-invoice',
  '/meesho-courier-label-cropper',
  '/meesho-courier-label-cropper-with-invoice',
  '/amazon-label-cropper',
  '/4x6-label-print-a4',
  '/merge',
  '/tools',
  '/ai-label-studio',
  '/qr-code-generator',
  '/barcode-generator',
  '/shipping-label-maker',
  '/product-label-maker',
  '/price-tag-maker',
  '/inventory-label-maker',
  '/address-label-maker',
  '/manufacturing-label-maker',
  '/custom-label-maker',
  '/discount-label-maker',
  '/cable-label-maker',
  '/jewelry-tag-maker',
  '/thank-you-sticker-maker',
  '/garment-label-maker',
  '/blog',
  '/blog/flipkart-label-printing-guide',
  '/blog/meesho-label-printing-guide',
  '/blog/amazon-easy-ship-label-guide',
  '/blog/free-qr-code-generator-guide',
  '/blog/barcode-types-explained',
  '/blog/label-makers-for-online-sellers',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
];

const siteUrl = getSiteUrl();
const lastModified = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Kolkata',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).format(new Date());
const distDir = resolve('dist');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${escapeXml(`${siteUrl}${route}`)}</loc>
    <lastmod>${lastModified}</lastmod>
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
]);

console.log(`Generated sitemap.xml and robots.txt for ${siteUrl}`);

function getSiteUrl() {
  const explicitUrl = process.env.SITE_URL || process.env.VITE_SITE_URL;
  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  const rawUrl = explicitUrl || (vercelUrl ? `https://${vercelUrl}` : 'https://labelsnap.vercel.app');
  return rawUrl.replace(/\/+$/, '');
}

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}
