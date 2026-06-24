import { handleError, HttpError, json } from '../_lib/http.js';
import { trackShipment } from '../_lib/shiprocket.js';

export async function GET(request) {
  try {
    const awb = new URL(request.url).searchParams.get('awb');
    if (!/^[a-zA-Z0-9-]{5,40}$/.test(awb || '')) throw new HttpError(400, 'Invalid AWB number.');
    const tracking = await trackShipment(awb);
    return json(tracking);
  } catch (error) {
    return handleError(error);
  }
}
