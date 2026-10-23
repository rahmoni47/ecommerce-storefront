import { Link } from 'react-router-dom';
import useAsync from '../hooks/useAsync.js';
import { getProduct } from '../services/api.js';
import { useStore } from '../context/StoreContext.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { ProductSkeletons, Empty } from '../components/ui.jsx';

export default function Wishlist() {
  const { wishlist } = useStore();
  const key = wishlist.join(',');
  const { data, loading } = useAsync(() => Promise.all(wishlist.map((id) => getProduct(id).catch(() => null))), [key]);
  const items = (data || []).filter(Boolean);
  return (
    <div className="container page"><h1>Wishlist</h1>
      <p className="muted">Saved on this device only.</p>
      {wishlist.length === 0 ? <Empty title="Nothing saved yet"><Link className="btn" to="/catalog">Browse products</Link></Empty>
        : loading ? <ProductSkeletons n={wishlist.length} />
        : <div className="grid products">{items.map((p) => <ProductCard key={p.id} product={p} />)}</div>}
    </div>
  );
}
