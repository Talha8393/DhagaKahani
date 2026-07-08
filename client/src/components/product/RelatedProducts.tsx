import type { Product } from '../../types';
import { ProductGrid } from './ProductGrid';

interface RelatedProductsProps {
  products: Product[];
  loading?: boolean;
}

export function RelatedProducts({ products, loading }: RelatedProductsProps) {
  if (!loading && products.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
      <ProductGrid products={products} loading={loading} />
    </section>
  );
}
