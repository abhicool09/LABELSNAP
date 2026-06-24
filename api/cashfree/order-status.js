import { fetchCashfreeOrder } from '../_lib/cashfree.js';
import { handleError, json } from '../_lib/http.js';

export async function GET(request) {
  try {
    const orderId = new URL(request.url).searchParams.get('order_id');
    const order = await fetchCashfreeOrder(orderId);
    return json({
      orderId: order.order_id,
      status: order.order_status,
      amount: order.order_amount,
      currency: order.order_currency,
      tags: order.order_tags || {},
    });
  } catch (error) {
    return handleError(error);
  }
}

