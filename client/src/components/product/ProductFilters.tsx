import { useState } from 'react';
import { Grid, List, SlidersHorizontal } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { Category } from '../../types';
import { SORT_OPTIONS } from '../../utils/constants';

export interface FilterState {
  category: string;
  minPrice: string;
  maxPrice: string;
  minRating: string;
  inStock: boolean;
  sort: string;
  search: string;
}

interface ProductFiltersProps {
  filters: FilterState;
  categories: Category[];
  onChange: (filters: FilterState) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  totalResults: number;
}

export function ProductFilters({
  filters,
  categories,
  onChange,
  viewMode,
  onViewModeChange,
  totalResults,
}: ProductFiltersProps) {
  const [showMobile, setShowMobile] = useState(false);

  const update = (partial: Partial<FilterState>) => {
    onChange({ ...filters, ...partial });
  };

  const filterPanel = (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
        <select
          value={filters.category}
          onChange={(e) => update({ category: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name} ({c.count})</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => update({ minPrice: e.target.value })}
            min={0}
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => update({ maxPrice: e.target.value })}
            min={0}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
        <select
          value={filters.minRating}
          onChange={(e) => update({ minRating: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          <option value="">Any Rating</option>
          <option value="4">4+ Stars</option>
          <option value="3">3+ Stars</option>
          <option value="2">2+ Stars</option>
        </select>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={filters.inStock}
          onChange={(e) => update({ inStock: e.target.checked })}
          className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
        />
        <span className="text-sm text-gray-700">In stock only</span>
      </label>

      <Button
        variant="outline"
        className="w-full"
        onClick={() =>
          onChange({
            category: '',
            minPrice: '',
            maxPrice: '',
            minRating: '',
            inStock: false,
            sort: '',
            search: filters.search,
          })
        }
      >
        Clear Filters
      </Button>
    </div>
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden"
            onClick={() => setShowMobile(!showMobile)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
          <p className="text-sm text-gray-500">{totalResults} products</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filters.sort}
            onChange={(e) => update({ sort: e.target.value })}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            aria-label="Sort products"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-brand-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              aria-label="Grid view"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-brand-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {showMobile && (
        <div className="lg:hidden mb-6 p-4 border border-gray-200 rounded-xl bg-white">
          {filterPanel}
        </div>
      )}
    </div>
  );
}

export function ProductFiltersSidebar(props: ProductFiltersProps) {
  const { filters, categories, onChange } = props;

  const update = (partial: Partial<FilterState>) => {
    onChange({ ...filters, ...partial });
  };

  return (
    <aside className="hidden lg:block w-64 flex-shrink-0">
      <div className="sticky top-24 p-5 border border-gray-200 rounded-xl bg-white space-y-6">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={filters.category}
            onChange={(e) => update({ category: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name} ({c.count})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
          <div className="flex gap-2">
            <Input type="number" placeholder="Min" value={filters.minPrice} onChange={(e) => update({ minPrice: e.target.value })} min={0} />
            <Input type="number" placeholder="Max" value={filters.maxPrice} onChange={(e) => update({ maxPrice: e.target.value })} min={0} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
          <select
            value={filters.minRating}
            onChange={(e) => update({ minRating: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="">Any Rating</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
          </select>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={filters.inStock} onChange={(e) => update({ inStock: e.target.checked })} className="rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
          <span className="text-sm text-gray-700">In stock only</span>
        </label>
        <Button variant="outline" className="w-full" onClick={() => onChange({ category: '', minPrice: '', maxPrice: '', minRating: '', inStock: false, sort: filters.sort, search: filters.search })}>
          Clear Filters
        </Button>
      </div>
    </aside>
  );
}
