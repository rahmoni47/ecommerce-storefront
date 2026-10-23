import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, ChevronDown } from 'lucide-react';
import { getCategories } from '../services/api.js';
import { useStore } from '../context/StoreContext.jsx';

const utils = [['Tracking Package', '/tracking'], ['FAQ', '/faq'], ['About Us', '/about'], ['Contact Us', '/contact']];

export default function Header() {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const [sp] = useSearchParams();
  const { cartCount, wishlist } = useStore();
  const [cats, setCats] = useState([]);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  useEffect(() => { getCategories().then(setCats).catch(() => setCats([])); }, []);
  useEffect(() => { if (pathname === '/catalog') { setQ(sp.get('q') || ''); setCat(sp.get('category') || ''); } }, [pathname, sp]);

  const submit = (e) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (q.trim()) p.set('q', q.trim());
    if (cat) p.set('category', cat);
    nav(`/catalog${p.toString() ? '?' + p : ''}`);
  };
  return (
    <header className="header">
      <Link to="/" className="logo" aria-label="ECOMMERCE home">ECOMMERCE</Link>
      <form className="searchbar" role="search" onSubmit={submit}>
        <Search size={18} aria-hidden />
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products" aria-label="Search products" />
        <span className="sel">
          <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Category">
            <option value="">All categories</option>
            {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <ChevronDown size={14} aria-hidden />
        </span>
        <button className="go" type="submit">Search</button>
      </form>
      <div className="right">
        <nav className="utils" aria-label="Utility">{utils.map(([t, to]) => <NavLink key={to} to={to}>{t}</NavLink>)}</nav>
        <div className="icons">
          <Link to="/wishlist" aria-label={`Wishlist, ${wishlist.length} items`}><Heart size={20} aria-hidden />{wishlist.length > 0 && <i>{wishlist.length}</i>}</Link>
          <Link to="/cart" aria-label={`Cart, ${cartCount} items`}><ShoppingBag size={20} aria-hidden />{cartCount > 0 && <i>{cartCount}</i>}</Link>
        </div>
      </div>
    </header>
  );
}
