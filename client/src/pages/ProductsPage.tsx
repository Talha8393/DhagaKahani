import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { PageMeta } from '../components/layout/PageMeta';
import { ProductGrid } from '../components/product/ProductGrid';
import { ProductFilters, ProductFiltersSidebar, type FilterState } from '../components/product/ProductFilters';
import { Pagination } from '../components/ui/Pagination';
import { Input } from '../components/ui/Input';
import { useDebounce } from '../hooks/useDebounce';
import { useProducts, useCategories } from '../hooks/useProducts';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  const [filters, setFilters] = useState<FilterState>({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minRating: searchParams.get('minRating') || '',
    inStock: searchParams.get('inStock') === 'true',
    sort: searchParams.get('sort') || '',
    search: searchParams.get('search') || '',
  });

  const page = Number(searchParams.get('page') || '1');
  const debouncedSearch = useDebounce(searchInput, 300);

  useEffect(() => {
    setFilters((f) => ({ ...f, search: debouncedSearch }));
  }, [debouncedSearch]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.category) params.set('category', filters.category);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.minRating) params.set('minRating', filters.minRating);
    if (filters.inStock) params.set('inStock', 'true');
    if (filters.sort) params.set('sort', filters.sort);
    if (filters.search) params.set('search', filters.search);
    if (searchParams.get('featured') === 'true') params.set('featured', 'true');
    if (searchParams.get('isNew') === 'true') params.set('isNew', 'true');
    if (page > 1) params.set('page', String(page));
    setSearchParams(params, { replace: true });
  }, [filters, page]);

  const { categories } = useCategories();
  const { products, pagination, loading, error } = useProducts({
    category: filters.category || undefined,
    minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
    minRating: filters.minRating ? Number(filters.minRating) : undefined,
    inStock: filters.inStock || undefined,
    search: filters.search || undefined,
    sort: filters.sort || undefined,
    featured: searchParams.get('featured') === 'true' || undefined,
    isNew: searchParams.get('isNew') === 'true' || undefined,
    page,
    limit: 12,
  });

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    if (page !== 1) setSearchParams((p) => { p.set('page', '1'); return p; });
  };

  const filterProps = {
    filters,
    categories,
    onChange: handleFilterChange,
    viewMode,
    onViewModeChange: setViewMode,
    totalResults: pagination.total,
  };

  return (
    <>
      <PageMeta title="Products" description="Browse our full catalog of quality products." />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {searchParams.get('featured') === 'true'
              ? 'Featured Products'
              : searchParams.get('isNew') === 'true'
                ? 'New Arrivals'
                : filters.category
                  ? categories.find((c) => c.slug === filters.category)?.name || 'Products'
                  : 'All Products'}
          </h1>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <ProductFilters {...filterProps} />

        {error && (
          <div className="text-center py-8 px-4 bg-red-50 border border-red-200 rounded-xl text-red-700" role="alert">
            <p className="font-medium">Failed to load products</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        <div className="flex gap-8 mt-4">
          <ProductFiltersSidebar {...filterProps} />
          <div className="flex-1 min-w-0">
            {viewMode === 'grid' ? (
              <ProductGrid products={products} loading={loading} />
            ) : (
              <div className="space-y-4">
                {loading ? (
                  <ProductGrid products={[]} loading />
                ) : products.length === 0 ? (
                  <p className="text-center text-gray-500 py-16">No products found.</p>
                ) : (
                  products.map((product) => (
                    <Link
                      key={product.id}
                      to={`/products/${product.slug}`}
                      className="flex gap-4 p-4 border border-gray-200 rounded-xl bg-white hover:shadow-md transition-shadow"
                    >
                      <img src={product.images[0]} alt={product.name} className="w-32 h-32 object-cover rounded-lg flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500">{product.category}</p>
                        <h3 className="font-medium text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.shortDescription}</p>
                        <p className="font-bold text-gray-900 mt-2">
                          ${(product.discountPrice ?? product.price).toFixed(2)}
                        </p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}

            {!loading && pagination.totalPages > 1 && (
              <div className="mt-10">
                <Pagination
                  page={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={(p) => setSearchParams((prev) => { prev.set('page', String(p)); return prev; })}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
