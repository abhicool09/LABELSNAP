import crypto from 'node:crypto';
import { HttpError } from './http.js';

function secret() {
  const value = process.env.FULFILLMENT_SIGNING_SECRET || process.env.CASHFREE_CLIENT_SECRET;
  if (!value) throw new HttpError(503, 'Fulfillment signing is not configured.');
  return value;
}

export function createFulfillmentToken(payload) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', secret()).update(encoded).digest('base64url');
  return `${encoded}.${signature}`;
}

export function verifyFulfillmentToken(token) {
  const [encoded, providedSignature] = String(token || '').split('.');
  if (!encoded || !providedSignature) throw new HttpError(401, 'Invalid fulfillment token.');
  const expectedSignature = crypto.createHmac('sha256', secret()).update(encoded).digest('base64url');
  const expected = Buffer.from(expectedSignature);
  const provided = Buffer.from(providedSignature);
  if (expected.length !== provided.length || !crypto.timingSafeEqual(expected, provided)) {
    throw new HttpError(401, 'Invalid fulfillment token.');
  }
  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    if (!payload.expiresAt || Date.now() > payload.expiresAt) throw new Error('expired');
    return payload;
  } catch {
    throw new HttpError(401, 'Expired or invalid fulfillment token.');
  }
}

