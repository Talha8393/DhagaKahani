import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import type { Product } from '../../types';
import { formatPrice, getEffectivePrice, getDiscountPercent } from '../../utils/formatters';
import { Badge } from '../ui/Badge';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const price = getEffectivePrice(product.price, product.discountPrice);
  const hasDiscount = product.discountPrice != null;

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group block rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {hasDiscount && (
          <Badge variant="danger" className="absolute top-2 left-2">
            -{getDiscountPercent(product.price, product.discountPrice!)}%
          </Badge>
        )}
        {product.isNew && (
          <Badge variant="brand" className="absolute top-2 right-2">New</Badge>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-500 mb-1">{product.category}</p>
        <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-brand-600 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mt-1">
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
          <span className="text-sm text-gray-600">{product.rating}</span>
          <span className="text-sm text-gray-400">({product.reviewCount})</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-lg font-bold text-gray-900">{formatPrice(price)}</span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">{formatPrice(product.price)}</span>
          )}
        </div>
        {product.stock <= 0 && (
          <p className="text-sm text-red-600 mt-1">Out of stock</p>
        )}
      </div>
    </Link>
  );
}
