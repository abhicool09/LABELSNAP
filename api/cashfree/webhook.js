import { handleError, HttpError, json } from '../_lib/http.js';
import { verifyCashfreeWebhook } from '../_lib/cashfree.js';

export async function POST(request) {
  try {
    const rawBody = await request.text();
    const timestamp = request.headers.get('x-webhook-timestamp');
    const signature = request.headers.get('x-webhook-signature');
    if (!verifyCashfreeWebhook(rawBody, timestamp, signature)) {
      throw new HttpError(401, 'Invalid webhook signature.');
    }
    JSON.parse(rawBody);
    return json({ received: true });
  } catch (error) {
    return handleError(error);
  }
}

