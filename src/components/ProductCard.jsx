import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { SafeImg } from './ui.jsx';
import { useStore } from '../context/StoreContext.jsx';
import { money } from '../utils/format.js';

export default function ProductCard({ product: p }) {
  const { wishlist, toggleWish } = useStore();
  const on = wishlist.includes(p.id);
  return (
    <article className="pcard">
      <div className="pimg">
        <Link to={`/products/${p.id}`} aria-label={`View ${p.name}`}><SafeImg src={p.mainImg} alt={p.name} /></Link>
        <button className={`heart${on ? ' on' : ''}`} onClick={() => toggleWish(p.id)} aria-pressed={on} aria-label={on ? `Remove ${p.name} from wishlist` : `Add ${p.name} to wishlist`}>
          <Heart size={18} fill={on ? 'currentColor' : 'none'} aria-hidden />
        </button>
        {p.available === false && <span className="badge">Unavailable</span>}
      </div>
      <Link to={`/products/${p.id}`} className="pinfo"><h3>{p.name}</h3><span>{money(p.price)}</span></Link>
    </article>
  );
}
