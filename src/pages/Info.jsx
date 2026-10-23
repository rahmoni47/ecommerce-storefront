import { Link } from 'react-router-dom';
const PAGES = {
  faq: ['FAQ', 'Questions and answers have not been published for this store yet.'],
  about: ['About Us', 'The store has not published its story yet.'],
  contact: ['Contact Us', 'Contact details have not been published for this store yet.'],
  tracking: ['Tracking Package', 'Order tracking is not available online yet. After you place an order, keep the order number shown on the confirmation page and ask the store about its status.'],
};
export default function Info({ page }) {
  const [title, text] = PAGES[page];
  return <div className="container page narrow"><h1>{title}</h1><p>{text}</p><Link className="btn" to="/catalog">Continue shopping</Link></div>;
}
