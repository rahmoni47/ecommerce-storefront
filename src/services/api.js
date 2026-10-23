import { API_BASE } from '../utils/format.js';

export class ApiError extends Error {
  constructor(message, status, data) { super(message); this.status = status; this.data = data; }
}

async function request(path, { method = 'GET', params, body } = {}) {
  const url = new URL(API_BASE + path);
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    (Array.isArray(v) ? v : [v]).forEach((x) => url.searchParams.append(k, x));
  });
  let res;
  try {
    res = await fetch(url, { method, headers: body ? { 'Content-Type': 'application/json' } : undefined, body: body ? JSON.stringify(body) : undefined });
  } catch {
    throw new ApiError('Cannot reach the store server. Check your connection and try again.', 0);
  }
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) {
    const msg = (data && typeof data === 'object' && (data.message || data.error || data.detail)) || (typeof data === 'string' && data) || `Request failed (${res.status})`;
    throw new ApiError(msg, res.status, data);
  }
  return data;
}

// Spring Pageable is sent as flat page/size/sort params (the Swagger "pageable" object is a Spring quirk).
export const getProducts = ({ page = 0, size = 12, sort } = {}) => request('/api/v1/products', { params: { page, size, sort } });
export const searchProducts = ({ query, page = 0, size = 12, sort }) => request('/api/v1/products/search', { params: { query, page, size, sort } });
export const getProduct = (id) => request(`/api/v1/products/${id}`);
export const getCategories = () => request('/api/v1/categories/all');
export const getCategory = (id) => request(`/api/v1/categories/${id}`); // includes its products
export const getAvailableStates = () => request('/api/v1/states/available');
export const createOrder = (payload) => request('/api/v1/orders', { method: 'POST', body: payload });
