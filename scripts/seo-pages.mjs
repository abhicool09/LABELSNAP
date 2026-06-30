import { BLOG_POSTS } from '../src/content/blogPosts.js';
import { LABEL_TEMPLATES } from '../src/lib/label-tools.js';

const toolLinks = [
  ['/shipping-label-cropper', 'Shipping label cropper'],
  ['/flipkart-label-cropper', 'Flipkart label cropper'],
  ['/meesho-label-cropper', 'Meesho label cropper'],
  ['/amazon-label-cropper', 'Amazon label cropper'],
  ['/4x6-label-print-a4', 'Print 4x6 labels on A4'],
  ['/merge', 'Merge shipping-label PDFs'],
];

const makerPaths = {
  shipping: '/shipping-label-maker',
  product: '/product-label-maker',
  price: '/price-tag-maker',
  inventory: '/inventory-label-maker',
  address: '/address-label-maker',
  manufacturing: '/manufacturing-label-maker',
  custom: '/custom-label-maker',
  pricing: '/discount-label-maker',
  cable: '/cable-label-maker',
  jewellery: '/jewelry-tag-maker',
  thanks: '/thank-you-sticker-maker',
  garment: '/garment-label-maker',
};

const marketplacePages = [
  {
    path: '/flipkart-label-cropper',
    title: 'Flipkart Label Cropper - Free 4x6 and A4 PDF Tool',
    description:
      'Crop Flipkart shipping-label PDFs automatically for 4x6 thermal printers or four-label A4 sheets. Free, private and browser based.',
    heading: 'Flipkart shipping label cropper',
    intro:
      'Turn Flipkart seller label PDFs into clean, print-ready 4x6 thermal labels or space-saving A4 sheets without manual screenshots.',
  },
  {
    path: '/meesho-label-cropper',
    title: 'Meesho Label Cropper Without Invoice - Free PDF Tool',
    description:
      'Crop Meesho shipping labels without invoice sections and print them on 4x6 thermal printers or A4 sheets. Processing stays in your browser.',
    heading: 'Meesho label cropper without invoice',
    intro:
      'Extract only the Meesho shipping label, remove the invoice area and create a clean thermal or A4 print file.',
  },
  {
    path: '/meesho-label-cropper-with-invoice',
    title: 'Meesho Label Cropper With Invoice - Free PDF Tool',
    description:
      'Crop Meesho shipping labels while keeping tax invoices as separate print pages. Export for 4x6 thermal or A4 printing.',
    heading: 'Meesho label cropper with invoice',
    intro:
      'Keep both the shipping label and invoice in an organised print-ready PDF for Meesho dispatch workflows.',
  },
  {
    path: '/meesho-courier-label-cropper',
    title: 'Meesho Courier Label Cropper Without Invoice',
    description:
      'Crop courier-generated Meesho labels without invoices for 4x6 thermal or A4 printing. Free browser-based PDF processing.',
    heading: 'Meesho courier label cropper',
    intro:
      'Process courier-generated Meesho formats and create label-only pages for clean parcel printing.',
  },
  {
    path: '/meesho-courier-label-cropper-with-invoice',
    title: 'Meesho Courier Label Cropper With Invoice',
    description:
      'Crop courier-generated Meesho labels and retain invoice pages separately for thermal or A4 seller dispatch printing.',
    heading: 'Meesho courier label cropper with invoice',
    intro:
      'Prepare courier labels and their invoices as separate, readable print pages without uploading buyer data.',
  },
  {
    path: '/amazon-label-cropper',
    title: 'Amazon Shipping Label Cropper - Easy Ship 4x6 Tool',
    description:
      'Crop Amazon Easy Ship shipping labels, skip invoice pages and export clean 4x6 thermal labels or A4 sheets for free.',
    heading: 'Amazon Easy Ship label cropper',
    intro:
      'Detect Amazon shipping-label pages, ignore accompanying invoices and create one print-ready output page per label.',
  },
];

const utilityPages = [
  {
    path: '/',
    title: 'Free Shipping Label Cropper for Amazon, Flipkart and Meesho',
    description:
      'Crop Amazon, Flipkart and Meesho shipping-label PDFs for 4x6 thermal printers or A4 sheets. Free label makers, QR codes and barcodes.',
    heading: 'Crop, print and create shipping labels in seconds',
    intro:
      'Free browser-based tools for Indian ecommerce sellers. Crop marketplace PDFs, print labels on thermal or A4 paper, and create QR codes, barcodes and product labels.',
    links: [
      ...toolLinks,
      ['/blog/amazon-easy-ship-label-guide', 'Amazon Easy Ship label printing guide'],
      ['/blog/flipkart-label-printing-guide', 'Flipkart label printing guide'],
      ['/blog/meesho-label-printing-guide', 'Meesho label printing guide'],
    ],
    kind: 'home',
  },
  {
    path: '/shipping-label-cropper',
    title: 'Shipping Label Cropper for Amazon, Flipkart and Meesho',
    description:
      'Choose a free Amazon, Flipkart or Meesho shipping-label cropper and create print-ready 4x6 thermal labels or A4 sheets.',
    heading: 'Shipping label cropper',
    intro:
      'Choose the marketplace format that matches your PDF, then crop and print labels without sending customer data to a server.',
    links: marketplacePages.map(({ path, heading }) => [path, heading]),
  },
  {
    path: '/4x6-label-print-a4',
    title: 'Print 4x6 Shipping Labels on A4 Paper - Free Tool',
    description:
      'Upload 4x6 shipping labels and arrange up to four labels on an A4 sheet. Download a print-ready PDF for inkjet or laser printers.',
    heading: 'Print 4x6 shipping labels on A4 paper',
    intro:
      'Select your label PDFs, place them into an A4 sheet layout and download a ready-to-print file for a standard printer.',
  },
  {
    path: '/merge',
    title: 'Merge Shipping Label PDFs Online - Free and Private',
    description:
      'Combine Amazon, Flipkart, Meesho and courier label PDFs in your chosen order. Free browser-based PDF merging with no file uploads.',
    heading: 'Merge shipping label PDFs',
    intro:
      'Combine multiple shipping-label PDFs into one ordered print run. Files are merged locally in your browser.',
  },
  {
    path: '/tools',
    title: 'Free Label Makers, QR Codes and Barcode Tools',
    description:
      'Create shipping labels, product labels, QR codes, barcodes, price tags and inventory labels free in your browser.',
    heading: 'Free label, QR and barcode tools',
    intro:
      'A practical collection of browser-based generators for ecommerce, retail, packaging and warehouse work.',
    links: [
      ['/ai-label-studio', 'AI Label Cropper Studio'],
      ['/qr-code-generator', 'QR code generator'],
      ['/barcode-generator', 'Barcode generator'],
      ...Object.entries(makerPaths).map(([key, path]) => [path, LABEL_TEMPLATES[key].title]),
    ],
    kind: 'collection',
  },
  {
    path: '/ai-label-studio',
    title: 'AI Label Cropper Studio - Custom Label Designer and Bulk Printing',
    description:
      'Design custom labels on a precise canvas with text, logos, barcodes, QR codes, CSV variables and bulk A4 PDF printing.',
    heading: 'Custom label designer and bulk label studio',
    intro:
      'Build reusable label layouts, connect CSV data and generate print-ready A4 sheets with barcodes, QR codes and logos.',
  },
  {
    path: '/qr-code-generator',
    title: 'Free QR Code Generator for UPI, Wi-Fi, URL and WhatsApp',
    description:
      'Create permanent static QR codes for UPI payments, Wi-Fi, websites, WhatsApp, phone, email and text. Download PNG, SVG or PDF.',
    heading: 'Free static QR code generator',
    intro:
      'Create high-resolution QR codes that do not expire and download them for labels, packaging, counters and marketing.',
  },
  {
    path: '/barcode-generator',
    title: 'Free Barcode Generator - Code 128, EAN, UPC and ITF',
    description:
      'Generate Code 128, EAN-13, UPC-A, Code 39 and ITF-14 barcodes online. Download sharp PNG, SVG or PDF files for labels.',
    heading: 'Free barcode generator',
    intro:
      'Create scannable retail, SKU, warehouse and carton barcodes directly in your browser.',
  },
  {
    path: '/blog',
    title: 'Label Printing, QR Code and Barcode Guides - AI Label Cropper',
    description:
      'Practical guides for cropping Amazon, Flipkart and Meesho labels, printing thermal labels, and creating QR codes and barcodes.',
    heading: 'Label printing guides for online sellers',
    intro:
      'Step-by-step help for marketplace shipping labels, thermal printers, A4 sheets, barcodes and QR codes.',
    links: BLOG_POSTS.map((post) => [`/blog/${post.slug}`, post.title]),
    kind: 'collection',
  },
  {
    path: '/about',
    title: 'About AI Label Cropper - Private Label Tools for Online Sellers',
    description:
      'Learn why AI Label Cropper builds free, privacy-first shipping label, barcode and QR tools for ecommerce sellers.',
    heading: 'About AI Label Cropper',
    intro:
      'AI Label Cropper helps ecommerce sellers prepare shipping and product labels faster while keeping order and customer files on their own device.',
  },
  {
    path: '/contact',
    title: 'Contact AI Label Cropper Support',
    description:
      'Contact AI Label Cropper with questions, bug reports and feature requests for shipping-label and label-making tools.',
    heading: 'Contact AI Label Cropper',
    intro:
      'Send questions, bug reports or feature requests to the AI Label Cropper team.',
  },
  {
    path: '/privacy',
    title: 'AI Label Cropper Privacy Policy',
    description:
      'Read how AI Label Cropper processes shipping-label PDFs locally in your browser and protects customer and order information.',
    heading: 'AI Label Cropper privacy policy',
    intro:
      'PDF cropping, rendering and label generation happen locally in your browser. Shipping files are not uploaded to AI Label Cropper servers.',
  },
  {
    path: '/terms',
    title: 'AI Label Cropper Terms of Service',
    description:
      'Review the terms for using AI Label Cropper browser-based shipping-label, PDF, barcode and QR-code tools.',
    heading: 'AI Label Cropper terms of service',
    intro:
      'These terms describe use of AI Label Cropper and the responsibility to verify every label before printing and dispatch.',
  },
  {
    path: '/checkout/complete',
    title: 'AI Label Cropper Order Status',
    description: 'Check the status of a AI Label Cropper thermal-label order.',
    heading: 'Order status',
    intro: 'Review the status of your AI Label Cropper thermal-label order.',
    noindex: true,
  },
];

const makerPages = Object.entries(makerPaths).map(([key, path]) => {
  const template = LABEL_TEMPLATES[key];
  return {
    path,
    title: `${template.title} - Free Print-Ready PDF Tool`,
    description: `${template.description} Create and download a print-ready PDF free in your browser.`,
    heading: template.title,
    intro: template.description,
  };
});

const blogPages = BLOG_POSTS.map((post) => ({
  path: `/blog/${post.slug}`,
  title: post.metaTitle || post.title,
  description: post.metaDescription,
  heading: post.title,
  intro: post.excerpt,
  body: post.body,
  kind: 'article',
  datePublished: post.date,
  links: post.related?.map(({ to, label }) => [to, label]) || [],
}));

export const SEO_PAGES = [
  ...utilityPages,
  ...marketplacePages,
  ...makerPages,
  ...blogPages,
];

export const REDIRECTS = [
  ['/flipkart', '/flipkart-label-cropper'],
  ['/flipkart-shipping-label-cropper', '/flipkart-label-cropper'],
  ['/meesho', '/meesho-label-cropper'],
  ['/meesho-shipping-label-cropper', '/meesho-label-cropper'],
  ['/meesho-invoice', '/meesho-label-cropper-with-invoice'],
  ['/meesho-courier', '/meesho-courier-label-cropper'],
  ['/meesho-courier-invoice', '/meesho-courier-label-cropper-with-invoice'],
  ['/amazon', '/amazon-label-cropper'],
  ['/amazon-shipping-label-cropper', '/amazon-label-cropper'],
  ['/free-qr-code-generator', '/qr-code-generator'],
  ['/free-barcode-generator', '/barcode-generator'],
  ['/shipping-label', '/shipping-label-maker'],
  ['/product-label', '/product-label-maker'],
  ['/price-label', '/price-tag-maker'],
  ['/inventory-label', '/inventory-label-maker'],
  ['/address-label', '/address-label-maker'],
  ['/manufacturing-label', '/manufacturing-label-maker'],
  ['/custom-label', '/custom-label-maker'],
  ['/pricing-label', '/discount-label-maker'],
  ['/cable-label', '/cable-label-maker'],
  ['/jewellery-label', '/jewelry-tag-maker'],
  ['/thank-you-label', '/thank-you-sticker-maker'],
  ['/garment-label', '/garment-label-maker'],
  ['/qr-label', '/qr-code-generator'],
  ['/barcode-label', '/barcode-generator'],
  ['/generator', '/tools'],
  ['/thermal-generator', '/tools'],
];
