// Cornerstone SEO blog posts. Each post renders at /blog/<slug> with Article +
// FAQPage JSON-LD. Keep bodies as HTML strings; internal <a href> links are
// crawlable and intercepted for SPA navigation in BlogPost.jsx.

export const BLOG_POSTS = [
  {
    slug: 'flipkart-label-printing-guide',
    title: 'How to Crop and Print Flipkart Shipping Labels (Thermal & A4)',
    metaTitle: 'How to Crop & Print Flipkart Labels — Thermal & A4 Guide',
    metaDescription:
      'Step-by-step guide to crop Flipkart shipping label PDFs and print them on 4x6 thermal printers or A4 sticker sheets — free, no screenshots, no manual cropping.',
    date: '2026-06-24',
    readMins: 5,
    category: 'Shipping labels',
    excerpt:
      'Stop screenshotting and manually cropping Flipkart labels. Here is the fastest free way to get clean, print-ready 4x6 thermal or A4 labels.',
    related: [
      { to: '/flipkart-label-cropper', label: 'Flipkart label cropper' },
      { to: '/shipping-label-cropper', label: 'Universal label cropper' },
      { to: '/blog/amazon-easy-ship-label-guide', label: 'Amazon Easy Ship guide' },
    ],
    body: `
      <p>Flipkart seller dashboards hand you a multi-page PDF where each shipping label sits on a large sheet with an attached tax invoice. If you print that as-is, you waste paper, ink and time — and the label rarely fits a 4x6 thermal roll. This guide shows the fastest free way to crop Flipkart labels and print them cleanly.</p>

      <h2>Why Flipkart labels need cropping</h2>
      <p>The raw PDF is built for A4 printing, not thermal label printers. Each page contains the shipping label plus an invoice, surrounded by white space. Thermal printers expect a tightly cropped 4x6 inch (101.6 x 152.4 mm) label, so you need to isolate just the label area before printing.</p>

      <h2>Crop Flipkart labels in 4 steps</h2>
      <ol>
        <li><strong>Download the label PDF</strong> from your Flipkart seller dashboard (Orders &rarr; Ready to Dispatch &rarr; Print).</li>
        <li><strong>Open the <a href="/flipkart-label-cropper">Flipkart label cropper</a></strong> and upload the PDF. Everything runs in your browser, so the file never leaves your device.</li>
        <li><strong>Choose your output</strong> — 4x6 Thermal for a label printer, or A4 Sheet to fit four labels on a sticker page.</li>
        <li><strong>Download the cropped PDF</strong> and print at 100% / Actual Size.</li>
      </ol>

      <h2>Thermal vs A4: which should you pick?</h2>
      <p>If you ship more than a handful of orders a day, a <strong>4x6 thermal printer</strong> (TVS, TSC, Zebra and similar) is the cheapest long-term option — no ink, fast output, and the cropper outputs exactly one label per page. If you are just starting out, choose <strong>A4 Sheet</strong> and print four labels on a single A4 sticker sheet with a normal inkjet or laser printer.</p>

      <h2>Printing tips that prevent rejected labels</h2>
      <ul>
        <li>Always print at <strong>100% / Actual Size</strong>, never "Fit to page" — scaling shrinks the barcode and couriers may fail to scan it.</li>
        <li>Keep a clean white margin (quiet zone) around the barcode.</li>
        <li>Use a dark, high-contrast print so the courier's scanner reads the barcode on the first try.</li>
      </ul>

      <h2>Bulk Flipkart label printing</h2>
      <p>Have a stack of separate label PDFs? Combine them first with the <a href="/merge">Merge PDF</a> tool, then crop the merged file in one go. For other marketplaces, the same workflow applies — see the <a href="/blog/meesho-label-printing-guide">Meesho</a> and <a href="/blog/amazon-easy-ship-label-guide">Amazon</a> guides.</p>
    `,
    faqs: [
      { q: 'Is the Flipkart label cropper free?', a: 'Yes. LabelSnap is completely free with no sign-up, no watermark and no limits on the number of labels you crop.' },
      { q: 'Does it remove the Flipkart tax invoice?', a: 'Yes. The cropper isolates just the shipping label area, leaving out the attached invoice and white space so you get a clean 4x6 label.' },
      { q: 'Are my labels uploaded to a server?', a: 'No. The PDF is processed entirely inside your browser, so your orders and customer data never leave your device.' },
      { q: 'Can I print Flipkart labels without a thermal printer?', a: 'Yes. Choose the A4 Sheet option to arrange four labels on a single A4 sticker sheet and print on any inkjet or laser printer.' },
    ],
  },
  {
    slug: 'meesho-label-printing-guide',
    title: 'How to Print Meesho Labels Without Invoice (Thermal & A4)',
    metaTitle: 'How to Print Meesho Labels Without Invoice — Free Guide',
    metaDescription:
      'Crop Meesho shipping labels with or without invoice, including courier-generated formats, and print them on 4x6 thermal printers or A4 sheets. Free and private.',
    date: '2026-06-24',
    readMins: 5,
    category: 'Shipping labels',
    excerpt:
      'Meesho gives you several label formats — with invoice, without invoice and courier-generated. Here is how to crop and print each one cleanly.',
    related: [
      { to: '/meesho-label-cropper', label: 'Meesho label cropper' },
      { to: '/meesho-label-cropper-with-invoice', label: 'Meesho with invoice' },
      { to: '/meesho-courier-label-cropper', label: 'Meesho courier cropper' },
    ],
    body: `
      <p>Meesho suppliers deal with more label variations than most marketplaces: labels with the tax invoice attached, labels without invoice, and courier-generated labels from partners like Valmo, Delhivery and Shadowfax. Each one needs slightly different cropping. This guide covers all of them.</p>

      <h2>The Meesho label formats</h2>
      <ul>
        <li><strong>Without invoice</strong> — just the shipping label. Use the <a href="/meesho-label-cropper">Meesho label cropper</a>.</li>
        <li><strong>With invoice</strong> — label plus tax invoice on the same page. Use the <a href="/meesho-label-cropper-with-invoice">with-invoice cropper</a> to keep both, neatly arranged.</li>
        <li><strong>Courier-generated</strong> — labels produced by the courier partner, in a different layout. Use the <a href="/meesho-courier-label-cropper">courier cropper</a> (or the <a href="/meesho-courier-label-cropper-with-invoice">courier + invoice</a> version).</li>
      </ul>

      <h2>How to crop and print</h2>
      <ol>
        <li><strong>Download the label PDF</strong> from the Meesho Supplier panel.</li>
        <li><strong>Pick the matching cropper</strong> above based on whether your label has an invoice and who generated it.</li>
        <li><strong>Upload the PDF</strong> — it is processed locally in your browser.</li>
        <li><strong>Choose 4x6 Thermal or A4 Sheet</strong> and download the print-ready file.</li>
      </ol>

      <h2>Do you need the invoice?</h2>
      <p>Meesho requires the tax invoice to travel with the parcel in many categories. If you are unsure, keep the <a href="/meesho-label-cropper-with-invoice">with-invoice</a> format so both the label and invoice print together. If your process files invoices separately, the without-invoice crop saves paper.</p>

      <h2>Printing checklist</h2>
      <ul>
        <li>Print at <strong>100% / Actual Size</strong> so the barcode scans reliably.</li>
        <li>For thermal printers, the cropper outputs one 4x6 label per page.</li>
        <li>For A4, multiple labels are arranged on a sticker sheet to save paper.</li>
      </ul>
      <p>Selling on more than one platform? See the <a href="/blog/flipkart-label-printing-guide">Flipkart</a> and <a href="/blog/amazon-easy-ship-label-guide">Amazon</a> guides for the same fast workflow.</p>
    `,
    faqs: [
      { q: 'How do I print a Meesho label without the invoice?', a: 'Download the label PDF, open the Meesho label cropper (the no-invoice version), upload it and choose your format. The cropper keeps only the shipping label.' },
      { q: 'Can I crop Meesho courier-generated labels?', a: 'Yes. Use the Meesho courier cropper, which handles the different layout produced by courier partners. There is also a courier + invoice version.' },
      { q: 'Is it safe to upload Meesho labels here?', a: 'Yes. Nothing is uploaded — the PDF is cropped entirely in your browser, so buyer details stay private.' },
      { q: 'Does it work on thermal and A4 printers?', a: 'Both. Choose 4x6 Thermal for label printers or A4 Sheet to print several labels on a sticker page.' },
    ],
  },
  {
    slug: 'amazon-easy-ship-label-guide',
    title: 'How to Crop Amazon Easy Ship Labels for 4x6 Thermal Printers',
    metaTitle: 'Crop Amazon Easy Ship Labels for 4x6 Thermal — Free Guide',
    metaDescription:
      'Turn Amazon Easy Ship label PDFs into clean 4x6 thermal labels or A4 sheets in seconds. Free, browser-based, no manual cropping or screenshots.',
    date: '2026-06-24',
    readMins: 4,
    category: 'Shipping labels',
    excerpt:
      'Amazon Easy Ship labels come on large pages with extra detail. Here is how to crop them down to a clean 4x6 thermal label.',
    related: [
      { to: '/amazon-label-cropper', label: 'Amazon label cropper' },
      { to: '/shipping-label-cropper', label: 'Universal label cropper' },
      { to: '/4x6-label-print-a4', label: '4x6 labels on A4' },
    ],
    body: `
      <p>Amazon Easy Ship and Seller Flex labels arrive as PDFs sized for A4, with the shipping label sitting alongside order details. To print them on a 4x6 thermal printer you need to crop the label cleanly — without losing the barcode or the address block.</p>

      <h2>Crop Amazon labels in 4 steps</h2>
      <ol>
        <li><strong>Download the label</strong> from Amazon Seller Central (Manage Orders &rarr; Print Label).</li>
        <li><strong>Open the <a href="/amazon-label-cropper">Amazon label cropper</a></strong> and upload the PDF.</li>
        <li><strong>Pick 4x6 Thermal or A4 Sheet.</strong> On A4, the tool places four smaller labels per page.</li>
        <li><strong>Download and print at 100%.</strong></li>
      </ol>

      <h2>Keep the barcode scannable</h2>
      <p>Couriers scan the shipping barcode at pickup and at every hub. Two rules keep it readable:</p>
      <ul>
        <li>Print at <strong>Actual Size</strong>, never scaled to fit.</li>
        <li>Leave the white quiet zone around the barcode intact — the cropper preserves it automatically.</li>
      </ul>

      <h2>Print on A4 without a thermal printer</h2>
      <p>No label printer yet? Use the A4 option, or the dedicated <a href="/4x6-label-print-a4">4x6-on-A4 tool</a> to arrange thermal-sized labels on a normal sticker sheet. When you are ready to scale up, a 4x6 thermal printer pays for itself quickly in saved ink and time.</p>

      <p>Also selling on <a href="/blog/flipkart-label-printing-guide">Flipkart</a> or <a href="/blog/meesho-label-printing-guide">Meesho</a>? The same cropping workflow works for those labels too.</p>
    `,
    faqs: [
      { q: 'Can I crop Amazon Easy Ship and Seller Flex labels?', a: 'Yes. The Amazon label cropper handles Easy Ship and Seller Flex PDFs, isolating the shipping label for clean 4x6 or A4 printing.' },
      { q: 'Will the barcode still scan after cropping?', a: 'Yes. The cropper preserves the barcode and its quiet zone. Print at 100% / Actual Size to keep it scannable.' },
      { q: 'Is this Amazon label tool free?', a: 'Yes, completely free with no sign-up. Processing happens in your browser, so your order data stays private.' },
      { q: 'How do I print Amazon labels on A4?', a: 'Choose the A4 Sheet option to fit four labels per page, or use the 4x6-on-A4 tool to arrange thermal-sized labels on a sticker sheet.' },
    ],
  },
  {
    slug: 'free-qr-code-generator-guide',
    title: 'How to Make a Free QR Code (UPI, Wi-Fi, URL) That Never Expires',
    metaTitle: 'Free QR Code Generator Guide — UPI, Wi-Fi & URL QR Codes',
    metaDescription:
      'Learn how to create permanent, static QR codes for UPI payments, Wi-Fi, links and WhatsApp — free, no app, no expiry. Plus print tips that keep codes scannable.',
    date: '2026-06-24',
    readMins: 5,
    category: 'QR & barcodes',
    excerpt:
      'Most "free" QR makers create codes that expire or add tracking. Here is how to make permanent, static QR codes for payments, Wi-Fi and links.',
    related: [
      { to: '/qr-code-generator', label: 'QR code generator' },
      { to: '/thank-you-sticker-maker', label: 'Thank-you sticker maker' },
      { to: '/blog/barcode-types-explained', label: 'Barcode types explained' },
    ],
    body: `
      <p>QR codes are everywhere — on shop counters, packaging and posters. But many free generators create <em>dynamic</em> codes that route through their server and stop working when your free trial ends. This guide shows how to make <strong>static</strong> QR codes that encode the data directly, so they never expire.</p>

      <h2>Static vs dynamic QR codes</h2>
      <p>A <strong>static</strong> QR code contains the actual data (a link, UPI ID or Wi-Fi password). It works forever and has no scan limits. A <strong>dynamic</strong> QR code stores a short redirect URL that points to the provider's server — handy for editing later, but it breaks if that service shuts down or you stop paying. For most sellers and shops, static is the safer choice. The <a href="/qr-code-generator">LabelSnap QR generator</a> creates static codes only.</p>

      <h2>The most useful QR types</h2>
      <ul>
        <li><strong>UPI payment</strong> — enter your UPI ID and payee name to create a scan-to-pay code that works in GPay, PhonePe and Paytm.</li>
        <li><strong>URL</strong> — link to your store, catalogue or review page.</li>
        <li><strong>Wi-Fi</strong> — share network access without reading out the password.</li>
        <li><strong>WhatsApp</strong> — open a chat with a pre-filled message.</li>
        <li><strong>Phone / Email / Text</strong> — quick contact and info codes.</li>
      </ul>

      <h2>How to create one</h2>
      <ol>
        <li>Pick the QR type and enter your content.</li>
        <li>Set colours and resolution (use 1024px or SVG for printing).</li>
        <li>Download PNG, SVG or PDF — all generated privately in your browser.</li>
      </ol>

      <h2>Print tips that keep QR codes scannable</h2>
      <ul>
        <li>Use the <strong>SVG</strong> for any printed label — it stays crisp at any size.</li>
        <li>Keep good contrast (dark code on light background) and a white margin around it.</li>
        <li>Do not print smaller than about 2 x 2 cm for reliable phone scanning.</li>
      </ul>
      <p>Want the QR on a branded sticker? Add it to a <a href="/thank-you-sticker-maker">thank-you sticker</a> or <a href="/product-label-maker">product label</a> in a couple of clicks.</p>
    `,
    faqs: [
      { q: 'Do these QR codes expire?', a: 'No. LabelSnap creates static QR codes that encode the data directly, so they never expire and have no scan limits.' },
      { q: 'How do I make a UPI payment QR code?', a: 'Choose the UPI type, enter your UPI ID and payee name, and download the code. Any UPI app can scan it to pay you.' },
      { q: 'What format is best for printing a QR code?', a: 'Download the SVG for print — it scales to any size without blurring. A 1024px PNG also works well.' },
      { q: 'Is the QR generator really free and private?', a: 'Yes. It is free with no sign-up, and the code is generated entirely in your browser, so your data is never uploaded.' },
    ],
  },
  {
    slug: 'barcode-types-explained',
    title: 'Barcode Types Explained: Code 128 vs EAN-13 vs UPC for Sellers',
    metaTitle: 'Barcode Types Explained — Code 128 vs EAN-13 vs UPC',
    metaDescription:
      'Confused by barcode formats? Learn when to use Code 128, EAN-13, UPC-A, Code 39 and ITF-14 for products, SKUs, shipping and cartons — with a free barcode generator.',
    date: '2026-06-24',
    readMins: 6,
    category: 'QR & barcodes',
    excerpt:
      'Code 128, EAN-13, UPC-A, Code 39, ITF-14 — which barcode should you actually use? A plain-English guide for online sellers.',
    related: [
      { to: '/barcode-generator', label: 'Barcode generator' },
      { to: '/product-label-maker', label: 'Product label maker' },
      { to: '/inventory-label-maker', label: 'Inventory label maker' },
    ],
    body: `
      <p>Pick the wrong barcode format and your labels may not scan at retail or get rejected by a marketplace. Here is a plain-English guide to the five formats most online sellers need, and exactly when to use each. You can create any of them with the free <a href="/barcode-generator">barcode generator</a>.</p>

      <h2>Code 128 — the all-rounder</h2>
      <p>Compact and supports letters and numbers. Perfect for <strong>internal SKUs, shipping labels and asset tags</strong>. If you are not selling through physical retail, Code 128 is usually the right default.</p>

      <h2>EAN-13 — retail products (global)</h2>
      <p>The 13-digit barcode you see on products worldwide. Use it if your items are sold in shops and you have GS1-issued numbers. Needs 12 or 13 digits (the last is a check digit).</p>

      <h2>UPC-A — retail products (North America)</h2>
      <p>The 12-digit equivalent used mainly in the US and Canada. Needs 11 or 12 digits. Use it when a marketplace or retailer specifically asks for UPC.</p>

      <h2>Code 39 — simple asset and ID tags</h2>
      <p>Older and less dense than Code 128, but widely supported by basic scanners. Good for <strong>warehouse asset tags and ID badges</strong> where data is short.</p>

      <h2>ITF-14 — shipping cartons</h2>
      <p>Used on the <strong>outer cases and cartons</strong> that hold multiple retail units. Needs 13 or 14 digits. If you ship cartons into a warehouse or distributor, this is the carton-level code.</p>

      <h2>Quick reference</h2>
      <ul>
        <li><strong>Internal SKU / shipping:</strong> Code 128</li>
        <li><strong>Retail product (India/EU/global):</strong> EAN-13</li>
        <li><strong>Retail product (US/Canada):</strong> UPC-A</li>
        <li><strong>Asset / ID tag:</strong> Code 39</li>
        <li><strong>Outer carton:</strong> ITF-14</li>
      </ul>

      <h2>Make scannable barcodes</h2>
      <p>Whatever the format, download the <strong>SVG or a high-resolution PNG</strong>, print at actual size, and keep a quiet zone around the bars. Add your barcode to a <a href="/product-label-maker">product label</a> or <a href="/inventory-label-maker">inventory label</a> in seconds. New to QR codes too? Read the <a href="/blog/free-qr-code-generator-guide">QR code guide</a>.</p>
    `,
    faqs: [
      { q: 'Which barcode format should I use for my SKU?', a: 'Use Code 128 for internal SKUs and shipping labels. It is compact and supports both letters and numbers.' },
      { q: 'What is the difference between EAN-13 and UPC-A?', a: 'EAN-13 is the 13-digit retail barcode used globally; UPC-A is the 12-digit version used mainly in the US and Canada. Both identify retail products.' },
      { q: 'How many digits does EAN-13 need?', a: 'EAN-13 needs 12 or 13 digits, where the final digit is a check digit that the generator can calculate automatically.' },
      { q: 'Are the generated barcodes free to use commercially?', a: 'Yes. The barcodes you generate are free to use on your products and labels. Note that GS1 retail numbers (EAN/UPC) must be obtained from GS1 if you sell through retail.' },
    ],
  },
  {
    slug: 'label-makers-for-online-sellers',
    title: '12 Free Label Makers Every Online Seller Should Bookmark',
    metaTitle: '12 Free Label Makers for Online Sellers — Print-ready PDFs',
    metaDescription:
      'From shipping and product labels to price tags, barcodes and jewelry tags — 12 free, print-ready label makers that run in your browser with no sign-up.',
    date: '2026-06-24',
    readMins: 5,
    category: 'Label makers',
    excerpt:
      'A round-up of 12 free, browser-based label makers for shipping, products, pricing, inventory and more — all print-ready and private.',
    related: [
      { to: '/tools', label: 'All label tools' },
      { to: '/shipping-label-maker', label: 'Shipping label maker' },
      { to: '/product-label-maker', label: 'Product label maker' },
    ],
    body: `
      <p>Running an online store means making a lot of small labels — for parcels, products, shelves and price tags. Instead of fighting with Word templates, these 12 free <a href="/tools">label makers</a> give you correctly-sized, print-ready PDFs in seconds. Every one runs in your browser, so your business data never leaves your device.</p>

      <h2>Shipping & address</h2>
      <ul>
        <li><a href="/shipping-label-maker">Shipping label maker</a> — clean 4x6 labels with recipient, order and tracking barcode.</li>
        <li><a href="/address-label-maker">Address label maker</a> — return and mailing labels for sheets or thermal rolls.</li>
      </ul>

      <h2>Products & pricing</h2>
      <ul>
        <li><a href="/product-label-maker">Product label maker</a> — retail labels with SKU, barcode and QR.</li>
        <li><a href="/price-tag-maker">Price tag maker</a> — compact tags with MRP, sale price and barcode.</li>
        <li><a href="/discount-label-maker">Discount label maker</a> — offer labels with original price, sale price and savings.</li>
        <li><a href="/manufacturing-label-maker">Batch &amp; expiry label maker</a> — MFG, expiry, lot, MRP and quantity.</li>
      </ul>

      <h2>Warehouse & specialty</h2>
      <ul>
        <li><a href="/inventory-label-maker">Inventory label maker</a> — bin, shelf, SKU and FNSKU labels.</li>
        <li><a href="/cable-label-maker">Cable label maker</a> — flag and wrap-around cable identifiers.</li>
        <li><a href="/jewelry-tag-maker">Jewelry tag maker</a> — tiny tags with purity, weight and price.</li>
        <li><a href="/garment-label-maker">Garment label maker</a> — size, SKU and price apparel tags.</li>
        <li><a href="/thank-you-sticker-maker">Thank-you sticker maker</a> — branded package inserts with QR links.</li>
        <li><a href="/custom-label-maker">Custom label maker</a> — a flexible 50x30 mm sticker for anything else.</li>
      </ul>

      <h2>Two tools that pair with every label</h2>
      <p>Need a code for any of these? The <a href="/barcode-generator">barcode generator</a> and <a href="/qr-code-generator">QR code generator</a> produce scannable SVG and PNG output you can drop onto a label. Learn more in the <a href="/blog/barcode-types-explained">barcode types guide</a>.</p>

      <h2>How to print them correctly</h2>
      <p>Each maker outputs a PDF at the exact label size. Always print at <strong>100% / Actual Size</strong> (not "Fit to page") so dimensions stay accurate on thermal printers and A4 sticker sheets.</p>
    `,
    faqs: [
      { q: 'Are all these label makers free?', a: 'Yes. Every label maker is free with no sign-up and no watermark, and you can create unlimited labels.' },
      { q: 'Do I need to install anything?', a: 'No. They run in your web browser on desktop or mobile. The print-ready PDF is generated locally on your device.' },
      { q: 'Can I add a barcode or QR code to a label?', a: 'Yes. Most makers have barcode and QR fields, and you can also use the dedicated barcode and QR code generators for standalone codes.' },
      { q: 'What printer do I need?', a: 'Any printer works. Use a 4x6 thermal printer for individual labels, or print on A4 sticker sheets with a regular inkjet or laser printer.' },
    ],
  },
];

export function getPost(slug) {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
