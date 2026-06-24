import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SEO from '../components/SEO';
import { apiRequest, pendingOrderKey } from '../lib/commerce';

export default function CheckoutComplete() {
  const [params] = useSearchParams();
  const orderId = params.get('order_id');
  const [state, setState] = useState({ status: 'checking', message: 'Confirming your payment…' });
  const [shipment, setShipment] = useState(null);

  useEffect(() => {
    if (!orderId) {
      setState({ status: 'error', message: 'No order ID was returned.' });
      return;
    }
    let cancelled = false;
    const finish = async () => {
      try {
        const payment = await apiRequest(`/api/cashfree/order-status?order_id=${encodeURIComponent(orderId)}`);
        if (payment.status !== 'PAID') {
          if (!cancelled) setState({ status: 'pending', message: `Payment status: ${payment.status}. If you paid successfully, refresh in a moment.` });
          return;
        }
        const pendingRaw = sessionStorage.getItem(pendingOrderKey(orderId));
        if (!pendingRaw) {
          if (!cancelled) setState({ status: 'paid', message: 'Payment confirmed. Contact support with your order ID so shipping can be completed.' });
          return;
        }
        const pending = JSON.parse(pendingRaw);
        if (pending.shipment) {
          if (!cancelled) {
            setShipment(pending.shipment);
            setState({ status: 'success', message: 'Payment confirmed and shipment created.' });
          }
          return;
        }
        const created = await apiRequest('/api/shiprocket/create-shipment', {
          method: 'POST',
          body: JSON.stringify({ fulfillmentToken: pending.fulfillmentToken }),
        });
        sessionStorage.setItem(pendingOrderKey(orderId), JSON.stringify({ ...pending, shipment: created }));
        if (!cancelled) {
          setShipment(created);
          setState({ status: 'success', message: 'Payment confirmed and shipment created.' });
        }
      } catch (error) {
        if (!cancelled) setState({ status: 'error', message: error.message });
      }
    };
    finish();
    return () => { cancelled = true; };
  }, [orderId]);

  return (
    <div className="container py-16">
      <SEO title="Order status" description="Check your LabelSnap thermal label order." canonicalPath="/checkout/complete" />
      <section className={`checkout-result checkout-result--${state.status}`}>
        <span className="checkout-result__icon">{state.status === 'success' ? '✓' : state.status === 'error' ? '!' : '…'}</span>
        <h1>{state.status === 'success' ? 'Order confirmed' : 'Checking your order'}</h1>
        <p>{state.message}</p>
        {orderId && <p className="checkout-order-id">Order ID: <strong>{orderId}</strong></p>}
        {shipment?.shipmentId && <p>Shiprocket shipment ID: <strong>{shipment.shipmentId}</strong></p>}
        <div className="home-hero__actions">
          {(state.status === 'pending' || state.status === 'error') && <button className="btn-primary" type="button" onClick={() => window.location.reload()}>Check again</button>}
          <Link className="btn-secondary" to="/">Back to LabelSnap</Link>
        </div>
      </section>
    </div>
  );
}
