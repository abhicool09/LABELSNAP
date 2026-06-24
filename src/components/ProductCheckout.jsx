import React, { useEffect, useState } from 'react';
import { apiRequest, loadCashfree, pendingOrderKey } from '../lib/commerce';

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  address: '',
  address2: '',
  city: '',
  state: '',
  pincode: '',
};

export default function ProductCheckout({ productId }) {
  const [product, setProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [form, setForm] = useState(EMPTY_FORM);
  const [serviceability, setServiceability] = useState(null);
  const [checking, setChecking] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    apiRequest('/api/catalog')
      .then((data) => setProduct(data.products.find((item) => item.id === productId) || null))
      .catch(() => setProduct(null));
  }, [productId]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && !paying) setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, paying]);

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    if (key === 'pincode') setServiceability(null);
  };

  const checkDelivery = async () => {
    setChecking(true);
    setError('');
    try {
      const result = await apiRequest('/api/shiprocket/serviceability', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity, pincode: form.pincode }),
      });
      setServiceability(result);
      if (!result.serviceable) setError('No prepaid courier service is currently available for this PIN code.');
      return result.serviceable;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setChecking(false);
    }
  };

  const startPayment = async (event) => {
    event.preventDefault();
    setPaying(true);
    setError('');
    try {
      const deliveryAvailable = serviceability?.serviceable || await checkDelivery();
      if (!deliveryAvailable) return;
      const order = await apiRequest('/api/cashfree/create-order', {
        method: 'POST',
        body: JSON.stringify({
          productId,
          quantity,
          customer: { name: form.name, email: form.email, phone: form.phone },
          shipping: form,
        }),
      });
      sessionStorage.setItem(pendingOrderKey(order.orderId), JSON.stringify({
        productId,
        quantity,
        shipping: form,
        fulfillmentToken: order.fulfillmentToken,
      }));
      const Cashfree = await loadCashfree();
      const cashfree = Cashfree({ mode: order.mode });
      await cashfree.checkout({
        paymentSessionId: order.paymentSessionId,
        redirectTarget: '_self',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setPaying(false);
    }
  };

  const configured = product?.configured;
  const price = configured ? new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(product.price) : null;

  return (
    <>
      <div className="product-buy-row">
        <span className="product-price">{price || 'Price coming soon'}</span>
        <button
          type="button"
          className="product-buy-button"
          disabled={!configured}
          onClick={() => setOpen(true)}
        >
          {configured ? 'Buy now' : 'Checkout not configured'}
        </button>
      </div>

      {open && (
        <div className="checkout-backdrop" role="presentation" onMouseDown={() => !paying && setOpen(false)}>
          <section className="checkout-dialog" role="dialog" aria-modal="true" aria-labelledby={`checkout-${productId}`} onMouseDown={(event) => event.stopPropagation()}>
            <button className="checkout-close" type="button" onClick={() => setOpen(false)} disabled={paying} aria-label="Close checkout">×</button>
            <span className="eyebrow">Secure Cashfree checkout</span>
            <h2 id={`checkout-${productId}`}>{product.name}</h2>
            <p className="checkout-summary">{price} per pack · prepaid shipping through Shiprocket</p>

            <form onSubmit={startPayment}>
              <div className="checkout-grid">
                <label>Name<input required value={form.name} onChange={(event) => update('name', event.target.value)} autoComplete="name" /></label>
                <label>Email<input required type="email" value={form.email} onChange={(event) => update('email', event.target.value)} autoComplete="email" /></label>
                <label>Phone<input required inputMode="numeric" pattern="[0-9]{10}" value={form.phone} onChange={(event) => update('phone', event.target.value)} autoComplete="tel" /></label>
                <label>Quantity<input required type="number" min="1" max="20" value={quantity} onChange={(event) => { setQuantity(Number(event.target.value)); setServiceability(null); }} /></label>
                <label className="checkout-span">Address<input required value={form.address} onChange={(event) => update('address', event.target.value)} autoComplete="street-address" /></label>
                <label className="checkout-span">Address line 2<input value={form.address2} onChange={(event) => update('address2', event.target.value)} /></label>
                <label>City<input required value={form.city} onChange={(event) => update('city', event.target.value)} autoComplete="address-level2" /></label>
                <label>State<input required value={form.state} onChange={(event) => update('state', event.target.value)} autoComplete="address-level1" /></label>
                <label>PIN code<input required inputMode="numeric" pattern="[0-9]{6}" value={form.pincode} onChange={(event) => update('pincode', event.target.value)} autoComplete="postal-code" /></label>
              </div>

              <div className="checkout-serviceability">
                <button type="button" onClick={checkDelivery} disabled={checking || form.pincode.length !== 6}>
                  {checking ? 'Checking…' : 'Check delivery'}
                </button>
                {serviceability?.serviceable && <span>✓ Delivery available</span>}
              </div>
              {error && <div className="alert error"><span className="icon">!</span><p>{error}</p></div>}
              <button className="btn-primary w-full" type="submit" disabled={paying}>
                {paying ? 'Opening secure checkout…' : `Pay ${configured ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(product.price * quantity) : ''}`}
              </button>
              <p className="checkout-note">Payment details are collected securely by Cashfree. LabelSnap never sees card or UPI credentials.</p>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
