export const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const CUR = import.meta.env.VITE_CURRENCY_LABEL || '';
export const money = (n) => `${Number(n ?? 0).toLocaleString('en-US')}${CUR ? ' ' + CUR : ''}`;
// Image fields are strings; absolute URLs pass through, relative paths resolve against the API host.
export const imgUrl = (p) => (!p ? null : /^(https?:|data:|blob:)/.test(p) ? p : `${API_BASE}${p.startsWith('/') ? '' : '/'}${p}`);
// The order request has no delivery-type field, so the backend decides the fee. StateResponse has two
// numbers (price, deliveryToHome); this picks which one is shown as a pre-order ESTIMATE. The
// authoritative fee is the deliveryPrice in the order response.
export const DELIVERY_ESTIMATE_FIELD = 'price';
