import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';

const Ctx = createContext(null);
const load = (k) => { try { return JSON.parse(localStorage.getItem(k)) || []; } catch { return []; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } };

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => load('store.cart'));
  const [wishlist, setWishlist] = useState(() => load('store.wishlist')); // local only: the API has no wishlist
  useEffect(() => save('store.cart', cart), [cart]);
  useEffect(() => save('store.wishlist', wishlist), [wishlist]);

  const addToCart = useCallback((p, { color = '', size = '', quantity = 1 } = {}) => {
    const key = [p.id, color, size].join('|');
    setCart((c) => c.some((x) => x.key === key)
      ? c.map((x) => (x.key === key ? { ...x, quantity: x.quantity + quantity } : x))
      : [...c, { key, productId: p.id, name: p.name, price: p.price, mainImg: p.mainImg, color, size, quantity }]);
  }, []);
  const setQty = useCallback((key, q) => setCart((c) => c.map((x) => (x.key === key ? { ...x, quantity: Math.max(1, q) } : x))), []);
  const removeItem = useCallback((key) => setCart((c) => c.filter((x) => x.key !== key)), []);
  const clearCart = useCallback(() => setCart([]), []);
  const toggleWish = useCallback((id) => setWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id])), []);

  const value = useMemo(() => ({
    cart, addToCart, setQty, removeItem, clearCart, wishlist, toggleWish,
    cartCount: cart.reduce((n, i) => n + i.quantity, 0),
    subtotal: cart.reduce((n, i) => n + i.price * i.quantity, 0),
  }), [cart, wishlist, addToCart, setQty, removeItem, clearCart, toggleWish]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const useStore = () => useContext(Ctx);
