import { Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CartLineItem } from '../../types/cart';
import { useCartStore } from '../../store/useCartStore';
import { formatPrice } from '../../utils/formatters';

interface CartItemProps {
  item: CartLineItem;
}

export function CartItemRow({ item }: CartItemProps) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <div className="flex gap-4 py-4 border-b border-gray-100 last:border-0">
      <Link to={`/products/${item.slug}`} className="flex-shrink-0">
        <img
          src={item.productImage}
          alt={item.productName}
          className="w-24 h-24 object-cover rounded-lg bg-gray-100"
        />
      </Link>
      <div className="flex-1 min-w-0">
        <Link to={`/products/${item.slug}`} className="font-medium text-gray-900 hover:text-brand-600 line-clamp-2">
          {item.productName}
        </Link>
        {item.variantLabel && (
          <p className="text-sm text-gray-500 mt-0.5">{item.variantLabel}</p>
        )}
        <p className="text-sm font-semibold text-gray-900 mt-1">{formatPrice(item.unitPrice)}</p>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
              className="p-1.5 hover:bg-gray-50 rounded-l-lg"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
              className="p-1.5 hover:bg-gray-50 rounded-r-lg"
              aria-label="Increase quantity"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <button
            onClick={() => removeItem(item.productId, item.variantId)}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            aria-label="Remove item"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="text-right hidden sm:block">
        <p className="font-semibold text-gray-900">{formatPrice(item.unitPrice * item.quantity)}</p>
      </div>
    </div>
  );
}
