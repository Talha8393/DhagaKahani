import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Product } from '../../types';
import { ProductGrid } from '../product/ProductGrid';

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  loading?: boolean;
  viewAllLink?: string;
}

export function ProductSection({ title, subtitle, products, loading, viewAllLink }: ProductSectionProps) {
  return (
    <section className="py-12">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {viewAllLink && (
          <Link to={viewAllLink} className="flex items-center gap-1 text-brand-600 hover:text-brand-700 font-medium text-sm">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
      <ProductGrid products={products} loading={loading} />
    </section>
  );
}
