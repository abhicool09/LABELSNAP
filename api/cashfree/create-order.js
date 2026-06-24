import crypto from 'node:crypto';
import { getProduct } from '../_lib/catalog.js';
import { cashfreeMode, createCashfreeOrder } from '../_lib/cashfree.js';
import { createFulfillmentToken } from '../_lib/fulfillment.js';
import { handleError, HttpError, json, readJson, requireMethod } from '../_lib/http.js';

function cleanText(value, max = 100) {
  return String(value || '').trim().slice(0, max);
}

function validPhone(value) {
  return String(value || '').replace(/\D/g, '').slice(-10);
}

export async function POST(request) {
  try {
    requireMethod(request, 'POST');
    const body = await readJson(request);
    const product = getProduct(body.productId);
    const quantity = Math.max(1, Math.min(20, Number.parseInt(body.quantity, 10) || 1));
    const name = cleanText(body.customer?.name);
    const email = cleanText(body.customer?.email);
    const phone = validPhone(body.customer?.phone);
    if (name.length < 2 || phone.length !== 10 || !email.includes('@')) {
      throw new HttpError(400, 'Enter a valid name, email address and 10-digit phone number.');
    }
    const shipping = {
      name,
      email,
      phone,
      address: cleanText(body.shipping?.address, 200),
      address2: cleanText(body.shipping?.address2, 200),
      city: cleanText(body.shipping?.city),
      state: cleanText(body.shipping?.state),
      pincode: String(body.shipping?.pincode || '').replace(/\D/g, ''),
    };
    if (!shipping.address || !shipping.city || !shipping.state || shipping.pincode.length !== 6) {
      throw new HttpError(400, 'Complete the shipping address, city, state and 6-digit PIN code.');
    }

    const orderId = `ls_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const origin = new URL(request.url).origin;
    const amount = Number((product.price * quantity).toFixed(2));
    const order = await createCashfreeOrder({
      order_id: orderId,
      order_amount: amount,
      order_currency: 'INR',
      customer_details: {
        customer_id: `customer_${crypto.createHash('sha256').update(`${email}:${phone}`).digest('hex').slice(0, 18)}`,
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
      },
      order_meta: {
        return_url: `${origin}/checkout/complete?order_id={order_id}`,
        notify_url: `${origin}/api/cashfree/webhook`,
      },
      order_note: `${product.name} × ${quantity}`,
      order_tags: {
        product_id: product.id,
        sku: product.sku,
        quantity: String(quantity),
      },
    });

    return json({
      orderId: order.order_id,
      paymentSessionId: order.payment_session_id,
      fulfillmentToken: createFulfillmentToken({
        orderId: order.order_id,
        productId: product.id,
        quantity,
        shipping,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      }),
      amount,
      currency: 'INR',
      mode: cashfreeMode(),
    });
  } catch (error) {
    return handleError(error);
  }
}
