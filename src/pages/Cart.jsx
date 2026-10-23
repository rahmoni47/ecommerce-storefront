import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { SafeImg, Empty } from '../components/ui.jsx';
import { money } from '../utils/format.js';

export default function Cart() {
  const { cart, setQty, removeItem, subtotal } = useStore();
  if (!cart.length) return <div className="container page"><Empty title="Your cart is empty"><Link className="btn" to="/catalog">Continue shopping</Link></Empty></div>;
  return (
    <div className="container page">
      <h1>Cart</h1>
      <div className="cartgrid">
        <ul className="lines">
          {cart.map((i) => (
            <li key={i.key}>
              <Link to={`/products/${i.productId}`} className="thumb"><SafeImg src={i.mainImg} alt={i.name} /></Link>
              <div className="grow"><h2>{i.name}</h2><p className="muted">{[i.size && `Size ${i.size}`, i.color].filter(Boolean).join(' · ')}</p><p>{money(i.price)}</p></div>
              <div className="qty" role="group" aria-label={`Quantity for ${i.name}`}>
                <button onClick={() => setQty(i.key, i.quantity - 1)} disabled={i.quantity <= 1} aria-label="Decrease quantity"><Minus size={16} /></button>
                <output>{i.quantity}</output>
                <button onClick={() => setQty(i.key, i.quantity + 1)} aria-label="Increase quantity"><Plus size={16} /></button>
              </div>
              <strong>{money(i.price * i.quantity)}</strong>
              <button className="icon" onClick={() => removeItem(i.key)} aria-label={`Remove ${i.name}`}><Trash2 size={18} /></button>
            </li>
          ))}
        </ul>
        <aside className="summary"><h2>Summary</h2>
          <p className="row"><span>Subtotal</span><strong>{money(subtotal)}</strong></p>
          <p className="muted">Delivery is added at checkout.</p>
          <Link className="btn block" to="/checkout">Proceed to checkout</Link>
          <Link className="btn ghost block" to="/catalog">Continue shopping</Link>
        </aside>
      </div>
    </div>
  );
}
