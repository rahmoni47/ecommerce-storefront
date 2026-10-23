import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import useAsync from '../hooks/useAsync.js';
import { getAvailableStates, createOrder } from '../services/api.js';
import { useStore } from '../context/StoreContext.jsx';
import { ErrorBox } from '../components/ui.jsx';
import { money, DELIVERY_ESTIMATE_FIELD } from '../utils/format.js';

const blank = { customerFirstName: '', customerLastName: '', customerPhone: '', shippingAddress: '', state: '' };

export default function Checkout() {
  const { cart, subtotal, clearCart } = useStore();
  const states = useAsync(getAvailableStates, []);
  const [f, setF] = useState(blank);
  const [errs, setErrs] = useState({});
  const [busy, setBusy] = useState(false);
  const [apiErr, setApiErr] = useState(null);
  const [order, setOrder] = useState(null);
  const lock = useRef(false);

  if (order) return (
    <div className="container page narrow"><h1>Order received</h1>
      <p>The store confirmed your order.</p>
      <dl className="receipt">
        <dt>Order</dt><dd>{order.id}</dd><dt>Status</dt><dd>{order.status}</dd>
        <dt>Products</dt><dd>{money(order.productsPrice)}</dd><dt>Delivery</dt><dd>{money(order.deliveryPrice)}</dd><dt>Total</dt><dd><strong>{money(order.totalPrice)}</strong></dd>
      </dl>
      <Link className="btn" to="/catalog">Continue shopping</Link>
    </div>
  );
  if (!cart.length) return <div className="container page"><div className="state"><h2>Your cart is empty</h2><Link className="btn" to="/catalog">Browse products</Link></div></div>;

  const st = (states.data || []).find((s) => String(s.id) === f.state);
  const estimate = st ? st[DELIVERY_ESTIMATE_FIELD] : null;
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const validate = () => {
    const e = {};
    if (!f.customerFirstName.trim()) e.customerFirstName = 'Enter your first name.';
    else if (f.customerFirstName.length > 50) e.customerFirstName = 'Use 50 characters or fewer.';
    if (!f.customerLastName.trim()) e.customerLastName = 'Enter your last name.';
    else if (f.customerLastName.length > 50) e.customerLastName = 'Use 50 characters or fewer.';
    if (!f.customerPhone.trim()) e.customerPhone = 'Enter a phone number.';
    else if (!/^[0-9+\s().-]{6,}$/.test(f.customerPhone)) e.customerPhone = 'Enter a valid phone number.';
    if (!f.shippingAddress.trim()) e.shippingAddress = 'Enter your delivery address.';
    if (!f.state) e.state = 'Choose where to deliver.';
    return e;
  };
  const submit = async (ev) => {
    ev.preventDefault();
    if (lock.current) return;
    const e = validate(); setErrs(e);
    if (Object.keys(e).length) return;
    lock.current = true; setBusy(true); setApiErr(null);
    try {
      const res = await createOrder({
        customerFirstName: f.customerFirstName.trim(), customerLastName: f.customerLastName.trim(),
        customerPhone: f.customerPhone.trim(), shippingAddress: f.shippingAddress.trim(), state: Number(f.state),
        orderItems: cart.map((i) => ({ productId: i.productId, color: i.color || undefined, size: i.size || undefined, quantity: i.quantity, price: i.price })),
      });
      clearCart(); setOrder(res); // only after the backend confirmed
    } catch (err) { setApiErr(err); } finally { lock.current = false; setBusy(false); }
  };
  const field = (k, label, props = {}) => (
    <div className="field"><label htmlFor={k}>{label}</label>
      <input id={k} value={f[k]} onChange={set(k)} aria-invalid={!!errs[k]} aria-describedby={errs[k] ? `${k}-e` : undefined} {...props} />
      {errs[k] && <p className="err" id={`${k}-e`}>{errs[k]}</p>}</div>
  );
  return (
    <div className="container page">
      <h1>Checkout</h1>
      <form className="cartgrid" onSubmit={submit} noValidate>
        <div className="formcol">
          <div className="two">{field('customerFirstName', 'First name', { autoComplete: 'given-name', maxLength: 50 })}{field('customerLastName', 'Last name', { autoComplete: 'family-name', maxLength: 50 })}</div>
          {field('customerPhone', 'Phone', { type: 'tel', autoComplete: 'tel' })}
          <div className="field"><label htmlFor="state">Delivery state</label>
            <select id="state" value={f.state} onChange={set('state')} aria-invalid={!!errs.state}>
              <option value="">{states.loading ? 'Loading…' : 'Choose a state'}</option>
              {(states.data || []).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            {errs.state && <p className="err">{errs.state}</p>}
            {states.error && <ErrorBox error={states.error} retry={states.retry} />}
          </div>
          {field('shippingAddress', 'Address', { autoComplete: 'street-address' })}
        </div>
        <aside className="summary"><h2>Order summary</h2>
          <ul className="mini">{cart.map((i) => <li key={i.key}><span>{i.quantity} × {i.name}</span><span>{money(i.price * i.quantity)}</span></li>)}</ul>
          <p className="row"><span>Products subtotal</span><strong>{money(subtotal)}</strong></p>
          <p className="row"><span>Delivery fee{estimate != null ? ' (estimate)' : ''}</span><strong>{estimate != null ? money(estimate) : 'Choose a state'}</strong></p>
          <p className="row total"><span>Total{estimate != null ? ' (estimate)' : ''}</span><strong>{estimate != null ? money(subtotal + Number(estimate)) : '—'}</strong></p>
          <p className="muted">The store calculates the final delivery fee and total when it receives your order.</p>
          {apiErr && <ErrorBox error={apiErr} />}
          <button className="btn block" type="submit" disabled={busy}>{busy ? 'Placing order…' : 'Place order'}</button>
        </aside>
      </form>
    </div>
  );
}
