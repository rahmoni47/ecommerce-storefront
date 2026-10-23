import { useSearchParams } from 'react-router-dom';
import useAsync from '../hooks/useAsync.js';
import { getProducts, searchProducts, getCategories, getCategory } from '../services/api.js';
import ProductCard from '../components/ProductCard.jsx';
import { ProductSkeletons, ErrorBox, Empty, Pills } from '../components/ui.jsx';

const SORTS = [['', 'Default'], ['createdAt,desc', 'Newest'], ['price,asc', 'Price: low to high'], ['price,desc', 'Price: high to low']];
const SIZE = 12;
const clientSort = (list, sort) => {
  if (!sort) return list;
  const [f, d] = sort.split(',');
  return [...list].sort((a, b) => (d === 'desc' ? -1 : 1) * (f === 'price' ? a.price - b.price : String(a.createdAt).localeCompare(String(b.createdAt))));
};

export default function Catalog() {
  const [sp, setSp] = useSearchParams();
  const q = sp.get('q') || '', category = sp.get('category') || '', sort = sp.get('sort') || '', page = Number(sp.get('page') || 0);
  const set = (patch) => { const n = new URLSearchParams(sp); Object.entries(patch).forEach(([k, v]) => (v ? n.set(k, v) : n.delete(k))); if (!('page' in patch)) n.delete('page'); setSp(n); };

  const cats = useAsync(getCategories, []);
  const res = useAsync(async () => {
    if (q) { // search endpoint is paged; category narrows client-side using categoryId
      const r = await searchProducts({ query: q, page, size: SIZE, sort });
      return { items: category ? (r.content || []).filter((p) => p.categoryId === category) : r.content || [], pages: r.page?.totalPages ?? 1 };
    }
    if (category) { const c = await getCategory(category); return { items: clientSort(c.products || [], sort), pages: 1 }; }
    const r = await getProducts({ page, size: SIZE, sort });
    return { items: r.content || [], pages: r.page?.totalPages ?? 1 };
  }, [q, category, sort, page]);

  return (
    <div className="container page">
      <h1>{q ? `Results for “${q}”` : 'Catalog'}</h1>
      <div className="toolbar">
        {cats.data && <Pills label="Filter by category" value={category || null} onChange={(id) => set({ category: id })} items={[{ id: null, name: 'All' }, ...cats.data]} />}
        <label className="sort">Sort <select value={sort} onChange={(e) => set({ sort: e.target.value })}>{SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
      </div>
      {res.loading ? <ProductSkeletons n={12} /> : res.error ? <ErrorBox error={res.error} retry={res.retry} />
        : res.data.items.length === 0 ? <Empty title="No products found"><p>Try a different search or category.</p></Empty>
        : <div className="grid products">{res.data.items.map((p) => <ProductCard key={p.id} product={p} />)}</div>}
      {res.data && res.data.pages > 1 && (
        <nav className="pager" aria-label="Pagination">
          <button className="btn ghost" disabled={page <= 0} onClick={() => set({ page: String(page - 1) || '0' })}>Previous</button>
          <span>Page {page + 1} of {res.data.pages}</span>
          <button className="btn ghost" disabled={page + 1 >= res.data.pages} onClick={() => set({ page: String(page + 1) })}>Next</button>
        </nav>
      )}
    </div>
  );
}
