import { getProduct } from '../_lib/catalog.js';
import { handleError, HttpError, json, readJson, requireMethod } from '../_lib/http.js';
import { checkServiceability } from '../_lib/shiprocket.js';

export async function POST(request) {
  try {
    requireMethod(request, 'POST');
    const body = await readJson(request);
    const product = getProduct(body.productId);
    const quantity = Math.max(1, Math.min(20, Number.parseInt(body.quantity, 10) || 1));
    const pincode = String(body.pincode || '').replace(/\D/g, '');
    if (!/^\d{6}$/.test(pincode)) throw new HttpError(400, 'Enter a valid 6-digit PIN code.');
    const result = await checkServiceability({
      deliveryPostcode: pincode,
      weight: Number((product.package.weight * quantity).toFixed(3)),
      cod: 0,
    });
    const couriers = result?.data?.available_courier_companies || [];
    return json({
      serviceable: couriers.length > 0,
      couriers: couriers.slice(0, 8).map((courier) => ({
        id: courier.courier_company_id,
        name: courier.courier_name,
        rate: courier.rate,
        estimatedDeliveryDays: courier.estimated_delivery_days,
        etd: courier.etd,
      })),
    });
  } catch (error) {
    return handleError(error);
  }
}

