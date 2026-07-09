import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface PageMetaProps {
  title: string;
  description?: string;
  noIndex?: boolean;
}

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function PageMeta({ title, description, noIndex }: PageMetaProps) {
  const location = useLocation();
  const fullTitle = title === 'Home' ? 'Dhaga Kahani - Quality Products Online' : `${title} | Dhaga Kahani`;

  useEffect(() => {
    document.title = fullTitle;

    const desc = description || 'Dhaga Kahani — your one-stop shop for electronics, clothing, home goods, and more. Free shipping on orders over $75.';
    setMeta('description', desc);
    setMeta('og:title', fullTitle, 'property');
    setMeta('og:description', desc, 'property');
    setMeta('og:type', 'website', 'property');
    setMeta('og:url', window.location.origin + location.pathname, 'property');
    setMeta('robots', noIndex ? 'noindex, nofollow' : 'index, follow');
  }, [fullTitle, description, noIndex, location.pathname]);

  return null;
}
