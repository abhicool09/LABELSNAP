let cashfreePromise;

export function loadCashfree() {
  if (window.Cashfree) return Promise.resolve(window.Cashfree);
  if (cashfreePromise) return cashfreePromise;
  cashfreePromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.async = true;
    script.onload = () => resolve(window.Cashfree);
    script.onerror = () => reject(new Error('Cashfree checkout could not be loaded.'));
    document.head.appendChild(script);
  });
  return cashfreePromise;
}

export async function apiRequest(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      'content-type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Request failed.');
  return data;
}

export function pendingOrderKey(orderId) {
  return `labelsnap:pending-order:${orderId}`;
}

