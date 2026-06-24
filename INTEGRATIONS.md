# Cashfree and Shiprocket setup

LabelSnap now contains real Cashfree Payment Gateway and Shiprocket API integrations. Secrets are used only in Vercel Functions under `api/`; they are never included in the Vite browser bundle.

## 1. Configure Vercel environment variables

Copy every variable from `.env.example` into Vercel Project Settings → Environment Variables.

- Start with `CASHFREE_ENV=sandbox`.
- Product prices are per pack in INR.
- Cashfree currently collects the configured product total. Shiprocket courier charges are billed to your Shiprocket account, so include any shipping allowance you want to recover in the configured product price.
- Package dimensions and weight must describe one packed unit ready for courier collection.
- `SHIPROCKET_PICKUP_LOCATION` must exactly match the pickup-location nickname in your Shiprocket account.

## 2. Cashfree dashboard

1. Generate the Payment Gateway App ID and Secret Key.
2. Whitelist the production LabelSnap domain.
3. Register this webhook URL using API version `2025-01-01`:

   `https://YOUR_DOMAIN/api/cashfree/webhook`

4. Subscribe to payment success, failed and user-dropped events.
5. Complete sandbox testing before changing `CASHFREE_ENV` to `production`.

The integration creates orders on the server, opens Cashfree Hosted Checkout v3 with `payment_session_id`, and verifies `order_status === "PAID"` on the server before creating a shipment.

## 3. Shiprocket dashboard

1. Open Settings → API → Configure.
2. Create a dedicated API user. Do not use the main account password.
3. Put that API user's email/password in `SHIPROCKET_EMAIL` and `SHIPROCKET_PASSWORD`.
4. Set the exact pickup nickname and pickup PIN code.

The checkout checks prepaid courier serviceability before payment. After Cashfree confirms payment, LabelSnap creates an ad-hoc Shiprocket order using the paid product and the customer shipping address.

## 4. Local integration testing

`vite` serves only the frontend. Use Vercel's local runtime to test `/api` functions:

```powershell
npx vercel dev
```

Never commit a populated `.env` file.
