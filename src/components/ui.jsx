import { useState } from 'react';
import { AlertCircle, ImageOff } from 'lucide-react';
import { imgUrl } from '../utils/format.js';

export function SafeImg({ src, alt = '', className = '', ...rest }) {
  const [bad, setBad] = useState(false);
  const url = imgUrl(src);
  if (!url || bad) return <div className={`img-fallback ${className}`} role="img" aria-label={alt || 'No image'}><ImageOff size={28} aria-hidden /></div>;
  return <img src={url} alt={alt} className={className} loading="lazy" onError={() => setBad(true)} {...rest} />;
}
export const ProductSkeletons = ({ n = 8 }) => (
  <div className="grid products" aria-busy="true" aria-label="Loading products">
    {Array.from({ length: n }, (_, i) => <div className="pcard" key={i}><div className="pimg skeleton" /><div className="skeleton line" /><div className="skeleton line short" /></div>)}
  </div>
);
export const ErrorBox = ({ error, retry }) => (
  <div className="state" role="alert"><AlertCircle aria-hidden /><p>{error?.message || 'Something went wrong.'}</p>{retry && <button className="btn" onClick={retry}>Try again</button>}</div>
);
export const Empty = ({ title, children }) => <div className="state"><h2>{title}</h2>{children}</div>;
export const Pills = ({ items, value, onChange, label }) => (
  <div className="pills" role="group" aria-label={label}>
    {items.map((it) => <button key={it.id ?? 'all'} className={`pill${value === it.id ? ' on' : ''}`} aria-pressed={value === it.id} onClick={() => onChange(it.id)}>{it.name}</button>)}
  </div>
);
