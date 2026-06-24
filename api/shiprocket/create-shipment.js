import { getProduct } from '../_lib/catalog.js';
import { fetchCashfreeOrder } from '../_lib/cashfree.js';
import { verifyFulfillmentToken } from '../_lib/fulfillment.js';
import { handleError, HttpError, json, readJson, requireMethod } from '../_lib/http.js';
import { createShiprocketOrder } from '../_lib/shiprocket.js';

const clean = (value, max = 120) => String(value || '').trim().slice(0, max);
const digits = (value) => String(value || '').replace(/\D/g, '');

export async function POST(request) {
  try {
    requireMethod(request, 'POST');
    const body = await readJson(request);
    const fulfillment = verifyFulfillmentToken(body.fulfillmentToken);
    const cashfreeOrder = await fetchCashfreeOrder(fulfillment.orderId);
    if (cashfreeOrder.order_status !== 'PAID') {
      throw new HttpError(409, 'Payment is not confirmed yet.');
    }

    const productId = cashfreeOrder.order_tags?.product_id;
    const quantity = Math.max(1, Math.min(20, Number.parseInt(cashfreeOrder.order_tags?.quantity, 10) || 1));
    const product = getProduct(productId);
    if (fulfillment.productId !== productId || fulfillment.quantity !== quantity) {
      throw new HttpError(409, 'Fulfillment details do not match the paid order.');
    }
    const expectedAmount = Number((product.price * quantity).toFixed(2));
    if (Math.abs(Number(cashfreeOrder.order_amount) - expectedAmount) > 0.01) {
      throw new HttpError(409, 'Paid amount does not match the configured product total.');
    }

    const shipping = fulfillment.shipping || {};
    const nameParts = clean(shipping.name).split(/\s+/);
    const firstName = nameParts.shift() || '';
    const lastName = nameParts.join(' ');
    const phone = digits(shipping.phone).slice(-10);
    const pincode = digits(shipping.pincode);
    if (!firstName || phone.length !== 10 || pincode.length !== 6 || !clean(shipping.address) || !clean(shipping.city) || !clean(shipping.state)) {
      throw new HttpError(400, 'Complete the shipping name, phone, address, city, state and PIN code.');
    }
    const pickupLocation = process.env.SHIPROCKET_PICKUP_LOCATION;
    if (!pickupLocation) throw new HttpError(503, 'SHIPROCKET_PICKUP_LOCATION is not configured.');

    const dateParts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(new Date()).map(({ type, value }) => [type, value]));
    const orderDate = `${dateParts.year}-${dateParts.month}-${dateParts.day} ${dateParts.hour}:${dateParts.minute}`;

    const shipment = await createShiprocketOrder({
      order_id: cashfreeOrder.order_id,
      order_date: orderDate,
      pickup_location: pickupLocation,
      billing_customer_name: firstName,
      billing_last_name: lastName,
      billing_address: clean(shipping.address, 200),
      billing_address_2: clean(shipping.address2, 200),
      billing_city: clean(shipping.city),
      billing_pincode: pincode,
      billing_state: clean(shipping.state),
      billing_country: 'India',
      billing_email: clean(shipping.email || cashfreeOrder.customer_details?.customer_email),
      billing_phone: phone,
      shipping_is_billing: true,
      order_items: [{
        name: product.name,
        sku: product.sku,
        units: quantity,
        selling_price: product.price,
      }],
      payment_method: 'Prepaid',
      sub_total: expectedAmount,
      length: product.package.length,
      breadth: product.package.breadth,
      height: Number((product.package.height * quantity).toFixed(2)),
      weight: Number((product.package.weight * quantity).toFixed(3)),
    });

    return json({
      created: true,
      orderId: shipment.order_id,
      shipmentId: shipment.shipment_id,
      status: shipment.status,
      statusCode: shipment.status_code,
    });
  } catch (error) {
    return handleError(error);
  }
}
