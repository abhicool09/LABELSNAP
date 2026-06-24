import { HttpError } from './http.js';

const BASE_URL = 'https://apiv2.shiprocket.in/v1/external';
let cachedToken = null;
let tokenExpiresAt = 0;

function credentials() {
  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;
  if (!email || !password) {
    throw new HttpError(503, 'Shiprocket API-user credentials are not configured.');
  }
  return { email, password };
}

async function token() {
  if (cachedToken && Date.now() < tokenExpiresAt) return cachedToken;
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(credentials()),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.token) {
    throw new HttpError(response.status || 502, data.message || 'Shiprocket authentication failed.', data);
  }
  cachedToken = data.token;
  tokenExpiresAt = Date.now() + 8 * 60 * 60 * 1000;
  return cachedToken;
}

async function shiprocketRequest(path, options = {}) {
  const authToken = await token();
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${authToken}`,
      ...(options.headers || {}),
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new HttpError(response.status, data.message || 'Shiprocket request failed.', data);
  }
  return data;
}

export function checkServiceability({ deliveryPostcode, weight, cod = 0 }) {
  const pickupPostcode = process.env.SHIPROCKET_PICKUP_POSTCODE;
  if (!pickupPostcode) throw new HttpError(503, 'SHIPROCKET_PICKUP_POSTCODE is not configured.');
  const params = new URLSearchParams({
    pickup_postcode: pickupPostcode,
    delivery_postcode: String(deliveryPostcode),
    weight: String(weight),
    cod: String(cod),
  });
  return shiprocketRequest(`/courier/serviceability/?${params.toString()}`);
}

export function createShiprocketOrder(payload) {
  return shiprocketRequest('/orders/create/adhoc', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function trackShipment(awb) {
  return shiprocketRequest(`/courier/track/awb/${encodeURIComponent(awb)}`);
}

