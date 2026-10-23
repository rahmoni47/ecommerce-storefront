import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Heart, Minus, Plus } from 'lucide-react';
import useAsync from '../hooks/useAsync.js';
import { getProduct } from '../services/api.js';
import { useStore } from '../context/StoreContext.jsx';
import { SafeImg, ErrorBox } from '../components/ui.jsx';
import { money } from '../utils/format.js';

export default function ProductDetails() {
  const { id } = useParams();
  const { data: p, loading, error, retry } = useAsync(() => getProduct(id), [id]);
  const { addToCart, wishlist, toggleWish } = useStore();
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [active, setActive] = useState(0);
  const [msg, setMsg] = useState('');

  if (loading) return <div className="container page"><div className="detail"><div className="skeleton tall" /><div><div className="skeleton line" /><div className="skeleton line short" /></div></div></div>;
  if (error) return <div className="container page"><ErrorBox error={error.status === 404 ? { message: 'This product could not be found.' } : error} retry={error.status === 404 ? null : retry} /></div>;

  const images = [p.mainImg, ...(p.extraImgs || [])].filter(Boolean);
  const sizes = p.sizes || [], colors = p.colors || [];
  const unavailable = p.available === false;
  const add = () => {
    if (sizes.length && !size) return setMsg('Choose a size first.');
    if (colors.length && !color) return setMsg('Choose a color first.');
    addToCart(p, { size, color, quantity: qty });
    setMsg('Added to your cart.');
  };
  const on = wishlist.includes(p.id);
  return (
    <div className="container page">
      <Link to="/catalog" className="back"><ArrowLeft size={16} aria-hidden /> Back to catalog</Link>
      <div className="detail">
        <div>
          <div className="pimg big"><SafeImg src={images[active]} alt={p.name} /></div>
          {images.length > 1 && <div className="thumbs">{images.map((im, i) => <button key={im + i} className={i === active ? 'on' : ''} onClick={() => setActive(i)} aria-label={`Show image ${i + 1}`}><SafeImg src={im} alt="" /></button>)}</div>}
        </div>
        <div className="dinfo">
          {p.category && <Link className="label" to={`/catalog?category=${p.categoryId}`}>{p.category}</Link>}
          <h1>{p.name}</h1>
          <p className="price">{money(p.price)}</p>
          {p.description && <p className="desc">{p.description}</p>}
          {sizes.length > 0 && <fieldset><legend>Size</legend>{sizes.map((s) => <button key={s} type="button" className={`pill${size === s ? ' on' : ''}`} aria-pressed={size === s} onClick={() => setSize(s)}>{s}</button>)}</fieldset>}
          {colors.length > 0 && <fieldset><legend>Color</legend>{colors.map((c) => <button key={c} type="button" className={`pill${color === c ? ' on' : ''}`} aria-pressed={color === c} onClick={() => setColor(c)}>{c}</button>)}</fieldset>}
          <div className="buy">
            <div className="qty" role="group" aria-label="Quantity">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity"><Minus size={16} /></button>
              <output>{qty}</output>
              <button onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity"><Plus size={16} /></button>
            </div>
            <button className="btn" onClick={add} disabled={unavailable}>{unavailable ? 'Unavailable' : 'Add to cart'}</button>
            <button className={`heart inline${on ? ' on' : ''}`} onClick={() => toggleWish(p.id)} aria-pressed={on} aria-label={on ? 'Remove from wishlist' : 'Add to wishlist'}><Heart size={18} fill={on ? 'currentColor' : 'none'} /></button>
          </div>
          <p className="msg" role="status">{msg} {msg.startsWith('Added') && <Link to="/cart">View cart</Link>}</p>
        </div>
      </div>
    </div>
  );
}
