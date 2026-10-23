import { Link } from 'react-router-dom';
export default function NotFound() {
  return <div className="container page narrow"><h1>Page not found</h1><p>That address doesn’t exist.</p><Link className="btn" to="/">Go home</Link></div>;
}
