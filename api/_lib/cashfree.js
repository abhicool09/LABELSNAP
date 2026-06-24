import crypto from 'node:crypto';
import { HttpError } from './http.js';

const API_VERSION = '2025-01-01';

function config() {
  const clientId = process.env.CASHFREE_CLIENT_ID;
  const clientSecret = process.env.CASHFREE_CLIENT_SECRET;
  const environment = process.env.CASHFREE_ENV === 'production' ? 'production' : 'sandbox';
  if (!clientId || !clientSecret) {
    throw new HttpError(503, 'Cashfree credentials are not configured.');
  }
  return {
    clientId,
    clientSecret,
    environment,
    baseUrl: environment === 'production'
      ? 'https://api.cashfree.com/pg'
      : 'https://sandbox.cashfree.com/pg',
  };
}

async function cashfreeRequest(path, options = {}) {
  const settings = config();
  const response = await fetch(`${settings.baseUrl}${path}`, {
    ...options,
    headers: {
      'content-type': 'application/json',
      'x-api-version': API_VERSION,
      'x-client-id': settings.clientId,
      'x-client-secret': settings.clientSecret,
      'x-request-id': crypto.randomUUID(),
      ...(options.headers || {}),
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new HttpError(response.status, data.message || data.type || 'Cashfree request failed.', data);
  }
  return data;
}

export function createCashfreeOrder(payload) {
  return cashfreeRequest('/orders', {
    method: 'POST',
    headers: { 'x-idempotency-key': crypto.randomUUID() },
    body: JSON.stringify(payload),
  });
}

export function fetchCashfreeOrder(orderId) {
  if (!/^[a-zA-Z0-9_-]{3,45}$/.test(orderId || '')) {
    throw new HttpError(400, 'Invalid order ID.');
  }
  return cashfreeRequest(`/orders/${encodeURIComponent(orderId)}`);
}

export function cashfreeMode() {
  return config().environment;
}

export function verifyCashfreeWebhook(rawBody, timestamp, signature) {
  const { clientSecret } = config();
  if (!timestamp || !signature) return false;
  const timestampNumber = Number(timestamp);
  if (!Number.isFinite(timestampNumber) || Math.abs(Date.now() - timestampNumber) > 5 * 60 * 1000) {
    return false;
  }
  const expected = crypto
    .createHmac('sha256', clientSecret)
    .update(`${timestamp}${rawBody}`)
    .digest('base64');
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);
  return expectedBuffer.length === signatureBuffer.length
    && crypto.timingSafeEqual(expectedBuffer, signatureBuffer);
}

