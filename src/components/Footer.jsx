import { Link } from 'react-router-dom';
export default function Footer() {
  return (
    <footer className="footer">
      <div><strong className="logo">ECOMMERCE</strong><p>Relaxed fits and everyday pieces.</p></div>
      <nav aria-label="Footer">
        <Link to="/">Home</Link><Link to="/catalog">Catalog</Link><Link to="/about">About Us</Link>
        <Link to="/contact">Contact Us</Link><Link to="/faq">FAQ</Link><Link to="/tracking">Tracking Package</Link>
      </nav>
    </footer>
  );
}
