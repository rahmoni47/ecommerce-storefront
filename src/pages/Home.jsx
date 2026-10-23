import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import useAsync from '../hooks/useAsync.js';
import { getProducts, getCategories, getCategory } from '../services/api.js';
import ProductCard from '../components/ProductCard.jsx';
import { SafeImg, ProductSkeletons, ErrorBox, Empty, Pills } from '../components/ui.jsx';

export default function Home() {
  const [cat, setCat] = useState(null);
  const cats = useAsync(getCategories, []);
  const trending = useAsync(() => (cat ? getCategory(cat).then((c) => c.products || []) : getProducts({ size: 8 }).then((r) => r.content || [])), [cat]);
  const products = (trending.data || []).slice(0, 8);
  // Hero visuals reuse real product photos from the catalog; the cards only show what the backend returns.
  const photos = (products.length ? products : []).filter((p) => p.mainImg);
  const pic = (i) => photos[i % Math.max(photos.length, 1)]?.mainImg;

  return (
    <>
      <section className="bento container" aria-label="Featured">
        <div className="card campaign sage">
          <div className="copy">
            <p className="label">New season</p>
            <h1>Color of Summer Outfit</h1>
            <p>Fresh colors, relaxed fits, and timeless pieces for your perfect summer look.</p>
            <Link className="btn light" to="/catalog?sort=createdAt,desc">View collection <ArrowRight size={16} aria-hidden /></Link>
          </div>
          {pic(0) && <SafeImg className="bg" src={pic(0)} alt="" />}
        </div>
        <Link to="/catalog" className="card side cool"><div className="copy"><h2>Outdoor Active</h2><p>Gear up for new adventures.</p></div>{pic(1) && <SafeImg className="bg" src={pic(1)} alt="" />}<span className="arrow"><ArrowUpRight size={18} aria-hidden /></span></Link>
        <Link to="/catalog" className="card side beige"><div className="copy"><h2>Casual Comfort</h2><p>Everyday looks for real life.</p></div>{pic(2) && <SafeImg className="bg" src={pic(2)} alt="" />}<span className="arrow"><ArrowUpRight size={18} aria-hidden /></span></Link>
      </section>

      <section className="inspire container" aria-labelledby="insp">
        <div className="itext">
          <p className="label">Style guide</p>
          <h2 id="insp">Casual Inspirations</h2>
          <p>Discover effortless looks, mixing comfort with modern style. Find your next favorite outfit.</p>
          <Link className="btn ghost" to="/catalog">Explore inspirations <ArrowRight size={16} aria-hidden /></Link>
        </div>
        <Link to="/catalog" className="card story clay"><h3>Say it with Shirt</h3>{pic(3) && <SafeImg className="bg" src={pic(3)} alt="" />}<span className="arrow"><ArrowUpRight size={18} aria-hidden /></span></Link>
        <Link to="/catalog" className="card story grey"><h3>Funky never get old</h3>{pic(4) && <SafeImg className="bg" src={pic(4)} alt="" />}<span className="arrow"><ArrowUpRight size={18} aria-hidden /></span></Link>
      </section>

      <section className="container trending" aria-labelledby="trend">
        <p className="label">Trending products</p>
        <h2 id="trend">Popular Right Now</h2>
        {cats.data && cats.data.length > 0 && <Pills label="Filter by category" value={cat} onChange={setCat} items={[{ id: null, name: 'All' }, ...cats.data]} />}
        {trending.loading ? <ProductSkeletons /> : trending.error ? <ErrorBox error={trending.error} retry={trending.retry} />
          : products.length === 0 ? <Empty title="No products here yet"><p>Try another category.</p></Empty>
          : <div className="grid products">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>}
        <div className="center"><Link className="btn" to="/catalog">Browse the full catalog</Link></div>
      </section>
    </>
  );
}
