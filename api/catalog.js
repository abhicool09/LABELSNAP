import { getCatalog } from './_lib/catalog.js';
import { json } from './_lib/http.js';

export function GET() {
  const products = Object.values(getCatalog()).map(({ package: ignored, ...product }) => product);
  return json({ products });
}

