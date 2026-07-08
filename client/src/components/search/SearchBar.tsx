import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '../ui/Input';
import { useDebounce } from '../../hooks/useDebounce';
import { productService } from '../../services/productService';
import { formatPrice, getEffectivePrice } from '../../utils/formatters';
import type { Product } from '../../types';

interface SearchBarProps {
  className?: string;
  onSearch?: () => void;
}

export function SearchBar({ className = '', onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const debouncedQuery = useDebounce(query, 200);

  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (trimmed.length < 1) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    productService
      .getAll({ search: trimmed, limit: 6 })
      .then((res) => {
        if (!cancelled) {
          setSuggestions(res.data);
          setActiveIndex(-1);
        }
      })
      .catch(() => {
        if (!cancelled) setSuggestions([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [debouncedQuery]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const goToSearchResults = (term: string) => {
    if (!term.trim()) return;
    navigate(`/products?search=${encodeURIComponent(term.trim())}`);
    setQuery('');
    setOpen(false);
    setSuggestions([]);
    onSearch?.();
  };

  const goToProduct = (slug: string) => {
    navigate(`/products/${slug}`);
    setQuery('');
    setOpen(false);
    setSuggestions([]);
    onSearch?.();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      goToProduct(suggestions[activeIndex].slug);
    } else {
      goToSearchResults(query);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || suggestions.length === 0) {
      if (e.key === 'Escape') setOpen(false);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i < suggestions.length - 1 ? i + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i > 0 ? i - 1 : suggestions.length - 1));
    } else if (e.key === 'Escape') {
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  const showDropdown = open && query.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div ref={containerRef} className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
        <Input
          type="search"
          placeholder="Search products..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className="pl-10"
          aria-label="Search products"
          aria-autocomplete="list"
          aria-expanded={showDropdown}
          aria-controls="search-suggestions"
          autoComplete="off"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 animate-spin" />
        )}

        {showDropdown && (
          <ul
            id="search-suggestions"
            role="listbox"
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-[100] max-h-80 overflow-y-auto"
          >
            {loading && suggestions.length === 0 ? (
              <li className="px-4 py-3 text-sm text-gray-500">Searching...</li>
            ) : suggestions.length === 0 ? (
              <li className="px-4 py-3 text-sm text-gray-500">No products found for "{query.trim()}"</li>
            ) : (
              <>
                {suggestions.map((product, index) => (
                  <li key={product.id} role="option" aria-selected={index === activeIndex}>
                    <button
                      type="button"
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => goToProduct(product.slug)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        index === activeIndex ? 'bg-brand-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <img
                        src={product.images[0]}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.category}</p>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 flex-shrink-0">
                        {formatPrice(getEffectivePrice(product.price, product.discountPrice))}
                      </span>
                    </button>
                  </li>
                ))}
                <li className="border-t border-gray-100">
                  <button
                    type="submit"
                    className="w-full px-4 py-2.5 text-sm text-brand-600 font-medium hover:bg-gray-50 text-left"
                  >
                    View all results for "{query.trim()}"
                  </button>
                </li>
              </>
            )}
          </ul>
        )}
      </div>
    </form>
  );
}
