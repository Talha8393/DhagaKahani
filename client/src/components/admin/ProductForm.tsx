import { Input } from '../ui/Input';
import type { Product } from '../../types';

const CATEGORIES = [
  { name: 'Electronics', slug: 'electronics' },
  { name: 'Clothing', slug: 'clothing' },
  { name: 'Home & Kitchen', slug: 'home-kitchen' },
  { name: 'Sports & Outdoors', slug: 'sports-outdoors' },
  { name: 'Beauty', slug: 'beauty' },
];

export type ProductFormData = Omit<Product, 'id' | 'slug' | 'createdAt'>;

interface ProductFormProps {
  data: ProductFormData;
  onChange: (data: ProductFormData) => void;
}

export function ProductForm({ data, onChange }: ProductFormProps) {
  const update = <K extends keyof ProductFormData>(field: K, value: ProductFormData[K]) => {
    onChange({ ...data, [field]: value });
  };

  const handleCategoryChange = (slug: string) => {
    const cat = CATEGORIES.find((c) => c.slug === slug);
    if (cat) {
      onChange({ ...data, category: cat.name, categorySlug: cat.slug });
    }
  };

  return (
    <div className="space-y-4">
      <Input label="Product Name" value={data.name} onChange={(e) => update('name', e.target.value)} required />
      <Input label="Short Description" value={data.shortDescription} onChange={(e) => update('shortDescription', e.target.value)} required />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={data.description}
          onChange={(e) => update('description', e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          required
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input label="Price (PKR)" type="number" min={0} step={1} value={data.price} onChange={(e) => update('price', parseFloat(e.target.value) || 0)} required />
        <Input label="Discount Price (PKR)" type="number" min={0} step={1} value={data.discountPrice ?? ''} onChange={(e) => update('discountPrice', e.target.value ? parseFloat(e.target.value) : undefined)} />
        <Input label="Stock" type="number" min={0} value={data.stock} onChange={(e) => update('stock', parseInt(e.target.value) || 0)} required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
          value={data.categorySlug}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>
      <Input
        label="Image URL"
        value={data.images[0] || ''}
        onChange={(e) => update('images', [e.target.value])}
        placeholder="https://..."
      />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Input label="Rating" type="number" min={0} max={5} step={0.1} value={data.rating} onChange={(e) => update('rating', parseFloat(e.target.value) || 0)} />
        <Input label="Review Count" type="number" min={0} value={data.reviewCount} onChange={(e) => update('reviewCount', parseInt(e.target.value) || 0)} />
        <Input label="Popularity" type="number" min={0} value={data.popularity} onChange={(e) => update('popularity', parseInt(e.target.value) || 0)} />
      </div>
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={data.featured} onChange={(e) => update('featured', e.target.checked)} className="rounded border-gray-300 text-brand-600" />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={data.isNew} onChange={(e) => update('isNew', e.target.checked)} className="rounded border-gray-300 text-brand-600" />
          New Arrival
        </label>
      </div>
    </div>
  );
}

export function createEmptyProduct(): ProductFormData {
  return {
    name: '',
    description: '',
    shortDescription: '',
    price: 0,
    images: ['https://picsum.photos/seed/new-product/800/800'],
    category: 'Electronics',
    categorySlug: 'electronics',
    stock: 10,
    rating: 4,
    reviewCount: 0,
    reviews: [],
    variants: [{ id: 'var-new', price: 0, stock: 10, sku: 'NEW-SKU' }],
    specs: { Brand: 'StoreBrand', Material: 'Premium', Warranty: '1 Year' },
    featured: false,
    isNew: true,
    popularity: 50,
  };
}
