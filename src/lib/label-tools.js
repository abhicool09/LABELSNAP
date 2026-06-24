export const LABEL_TEMPLATES = {
  shipping: {
    title: 'Shipping Label Maker',
    description: 'Create a clean 4×6 shipping label with recipient, order and courier details.',
    size: [101.6, 152.4],
    fields: [
      ['recipient', 'Recipient name', 'Aarav Sharma'],
      ['address', 'Delivery address', '12 Lake View Road, Indiranagar'],
      ['city', 'City, state & PIN', 'Bengaluru, Karnataka 560038'],
      ['phone', 'Phone', '+91 98765 43210'],
      ['orderId', 'Order ID', 'LS-10482'],
      ['courier', 'Courier', 'Express Delivery'],
      ['barcode', 'Tracking number', 'LS104820001'],
    ],
  },
  product: {
    title: 'Product Label Maker',
    description: 'Design retail and e-commerce product labels with price, SKU, barcode and QR.',
    size: [70, 42],
    fields: [
      ['brand', 'Brand', 'LABELSNAP GOODS'],
      ['product', 'Product name', 'Organic Cotton Tote'],
      ['sku', 'SKU', 'TOTE-NAT-01'],
      ['mrp', 'MRP', '₹799 incl. all taxes'],
      ['barcode', 'Barcode value', '890123456789'],
      ['qr', 'QR destination', 'https://example.com/product'],
    ],
  },
  price: {
    title: 'Price Tag Maker',
    description: 'Make compact retail price tags with brand, MRP and a scannable barcode.',
    size: [50, 30],
    fields: [
      ['brand', 'Brand', 'LABELSNAP'],
      ['product', 'Product', 'Classic Tee'],
      ['mrp', 'MRP', '₹999'],
      ['sale', 'Selling price', '₹699'],
      ['barcode', 'Barcode value', 'TEE001699'],
    ],
  },
  inventory: {
    title: 'Inventory & Bin Label Maker',
    description: 'Create warehouse shelf, bin, SKU and FNSKU-style identification labels.',
    size: [75, 35],
    fields: [
      ['location', 'Bin / shelf', 'A-12-04'],
      ['product', 'Item', 'Blue Storage Box'],
      ['sku', 'SKU / FNSKU', 'X001-LSNAP-BLU'],
      ['quantity', 'Quantity note', 'REORDER AT 12'],
      ['barcode', 'Barcode value', 'X001LSNAPBLU'],
    ],
  },
  address: {
    title: 'Address Label Maker',
    description: 'Create return-address and customer mailing labels for sheets or thermal rolls.',
    size: [70, 35],
    fields: [
      ['recipient', 'Name or business', 'LabelSnap Studio'],
      ['address', 'Street address', '42 Market Street'],
      ['city', 'City, state & PIN', 'Pune, Maharashtra 411001'],
      ['phone', 'Phone / note', '+91 98765 43210'],
    ],
  },
  manufacturing: {
    title: 'MRP, Batch & Expiry Label Maker',
    description: 'Generate production labels with batch, manufacture, expiry and retail details.',
    size: [50, 30],
    fields: [
      ['product', 'Product', 'Roasted Almonds'],
      ['batch', 'Batch / lot', 'B2406A'],
      ['mfg', 'Manufactured', 'JUN 2026'],
      ['exp', 'Best before / expiry', 'DEC 2026'],
      ['mrp', 'MRP', '₹249 incl. taxes'],
      ['quantity', 'Net quantity', '200 g'],
    ],
  },
  custom: {
    title: 'Custom Label Maker',
    description: 'Create a flexible 50×30mm sticker with your own headline, message and QR link.',
    size: [50, 30],
    fields: [
      ['brand', 'Headline', 'HANDMADE WITH CARE'],
      ['product', 'Main text', 'Small batch • Pune'],
      ['message', 'Footer', 'Thank you for supporting local'],
      ['qr', 'QR destination', 'https://example.com'],
    ],
  },
  pricing: {
    title: 'MRP & Discount Label Maker',
    description: 'Create clear offer labels with original price, sale price and discount message.',
    size: [50, 30],
    fields: [
      ['brand', 'Brand', 'WEEKEND SALE'],
      ['product', 'Product', 'Everyday Backpack'],
      ['mrp', 'MRP', '₹1,999'],
      ['sale', 'Offer price', '₹1,299'],
      ['message', 'Offer note', 'SAVE ₹700'],
      ['barcode', 'Barcode value', 'BAG1299'],
    ],
  },
  cable: {
    title: 'Cable & Wire Label Maker',
    description: 'Make compact flag or wrap-around identifiers for electrical and network cables.',
    size: [60, 20],
    fields: [
      ['brand', 'System', 'NETWORK'],
      ['product', 'Cable ID', 'CAT6-042'],
      ['from', 'From', 'RACK A / P12'],
      ['to', 'To', 'DESK 18'],
      ['message', 'Note', 'BLUE • 3M'],
    ],
  },
  jewellery: {
    title: 'Jewelry Tag Maker',
    description: 'Create small jewelry tags with item, purity, weight, price and stock code.',
    size: [45, 18],
    fields: [
      ['brand', 'Store / brand', 'AURA JEWELS'],
      ['product', 'Item', 'Gold Pendant'],
      ['message', 'Purity & weight', '22K • 3.80 g'],
      ['mrp', 'Price', '₹28,500'],
      ['barcode', 'Stock code', 'AJP0380'],
    ],
  },
  thanks: {
    title: 'Thank You Sticker Maker',
    description: 'Design branded package stickers with a message and optional QR destination.',
    size: [50, 50],
    fields: [
      ['brand', 'Brand', 'LABELSNAP'],
      ['product', 'Headline', 'THANK YOU!'],
      ['message', 'Message', 'Your order made our day. We hope this makes yours.'],
      ['qr', 'QR destination', 'https://example.com/review'],
    ],
  },
  garment: {
    title: 'Garment & Size Label Maker',
    description: 'Create apparel tags with brand, size, SKU, price and barcode.',
    size: [50, 70],
    fields: [
      ['brand', 'Brand', 'NORTH & NEEDLE'],
      ['product', 'Garment', 'Linen Shirt'],
      ['size', 'Size', 'L'],
      ['sku', 'SKU', 'NNS-LIN-WHT-L'],
      ['mrp', 'Price', '₹1,499'],
      ['barcode', 'Barcode value', 'NNS1499L'],
    ],
  },
};

export const TOOL_INVENTORY = [
  { to: '/shipping-label-maker', title: 'Shipping labels', text: '4×6 address, order and tracking labels.', icon: '🚚' },
  { to: '/product-label-maker', title: 'Product labels', text: 'Retail labels with SKU, barcode and QR.', icon: '🏷️' },
  { to: '/barcode-generator', title: 'Barcode generator', text: 'CODE 128, EAN, UPC, CODE 39 and ITF.', icon: '▥' },
  { to: '/qr-code-generator', title: 'QR code generator', text: 'URL, UPI, Wi-Fi, phone, email and text QR.', icon: '▦' },
  { to: '/price-tag-maker', title: 'Price tags', text: 'MRP, sale price and retail barcodes.', icon: '₹' },
  { to: '/inventory-label-maker', title: 'Inventory labels', text: 'Bin, shelf, SKU and warehouse labels.', icon: '📦' },
  { to: '/address-label-maker', title: 'Address labels', text: 'Return and customer mailing labels.', icon: '✉️' },
  { to: '/manufacturing-label-maker', title: 'Batch & expiry labels', text: 'MFG, expiry, lot, MRP and quantity.', icon: '📅' },
  { to: '/custom-label-maker', title: 'Custom labels', text: 'Flexible branded 50×30mm stickers.', icon: '✦' },
  { to: '/discount-label-maker', title: 'Discount labels', text: 'Original price, offer price and savings.', icon: '%' },
  { to: '/cable-label-maker', title: 'Cable labels', text: 'Flag and wrap-around cable identifiers.', icon: '🔌' },
  { to: '/jewelry-tag-maker', title: 'Jewelry tags', text: 'Tiny item, purity, weight and price tags.', icon: '◇' },
  { to: '/thank-you-sticker-maker', title: 'Thank-you stickers', text: 'Package inserts with QR review links.', icon: '♥' },
  { to: '/garment-label-maker', title: 'Garment labels', text: 'Size, SKU, price and apparel tags.', icon: '👕' },
];

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function svgToPng(svgText, width, height, filename) {
  const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const image = new Image();
  image.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);
    URL.revokeObjectURL(url);
    canvas.toBlob((png) => downloadBlob(png, filename), 'image/png');
  };
  image.src = url;
}
