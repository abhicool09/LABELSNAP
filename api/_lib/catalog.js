import { HttpError } from './http.js';

const PRODUCT_DEFINITIONS = {
  'thermal-4x6': {
    name: '4 × 6 inch thermal labels',
    sku: 'LABEL-4X6',
    priceEnv: 'PRODUCT_4X6_PRICE',
    weightEnv: 'PRODUCT_4X6_WEIGHT_KG',
    lengthEnv: 'PRODUCT_4X6_PACKAGE_LENGTH_CM',
    breadthEnv: 'PRODUCT_4X6_PACKAGE_BREADTH_CM',
    heightEnv: 'PRODUCT_4X6_PACKAGE_HEIGHT_CM',
  },
  'thermal-3x5': {
    name: '3 × 5 inch thermal labels',
    sku: 'LABEL-3X5',
    priceEnv: 'PRODUCT_3X5_PRICE',
    weightEnv: 'PRODUCT_3X5_WEIGHT_KG',
    lengthEnv: 'PRODUCT_3X5_PACKAGE_LENGTH_CM',
    breadthEnv: 'PRODUCT_3X5_PACKAGE_BREADTH_CM',
    heightEnv: 'PRODUCT_3X5_PACKAGE_HEIGHT_CM',
  },
};

function positiveNumber(name) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : null;
}

export function getCatalog({ requireConfigured = false } = {}) {
  const products = Object.fromEntries(
    Object.entries(PRODUCT_DEFINITIONS).map(([id, definition]) => {
      const price = positiveNumber(definition.priceEnv);
      const weight = positiveNumber(definition.weightEnv);
      const length = positiveNumber(definition.lengthEnv);
      const breadth = positiveNumber(definition.breadthEnv);
      const height = positiveNumber(definition.heightEnv);
      const configured = Boolean(price && weight && length && breadth && height);
      return [id, {
        id,
        name: definition.name,
        sku: definition.sku,
        price,
        currency: 'INR',
        configured,
        package: { weight, length, breadth, height },
      }];
    }),
  );

  if (requireConfigured && !Object.values(products).some((product) => product.configured)) {
    throw new HttpError(503, 'Product prices and package dimensions are not configured.');
  }
  return products;
}

export function getProduct(productId) {
  const product = getCatalog()[productId];
  if (!product) throw new HttpError(400, 'Unknown product.');
  if (!product.configured) {
    throw new HttpError(503, `${product.name} is not configured for checkout yet.`);
  }
  return product;
}

