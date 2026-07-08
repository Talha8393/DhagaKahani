import type { CartLineItem, CartTotals } from '../../types/cart';
import { formatPrice } from '../../utils/formatters';

interface OrderSummarySidebarProps {
  items: CartLineItem[];
  totals: CartTotals;
}

export function OrderSummarySidebar({ items, totals }: OrderSummarySidebarProps) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
      <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
        {items.map((item) => (
          <div key={`${item.productId}-${item.variantId}`} className="flex gap-2 text-sm">
            <img src={item.productImage} alt="" className="w-10 h-10 rounded object-cover bg-gray-100" />
            <div className="flex-1 min-w-0">
              <p className="line-clamp-1 text-gray-900">{item.productName}</p>
              <p className="text-gray-500">×{item.quantity}</p>
            </div>
            <span className="font-medium">{formatPrice(item.unitPrice * item.quantity)}</span>
          </div>
        ))}
      </div>
      <dl className="space-y-1 text-sm border-t border-gray-200 pt-3">
        <div className="flex justify-between"><dt className="text-gray-600">Subtotal</dt><dd>{formatPrice(totals.subtotal)}</dd></div>
        {totals.discount > 0 && (
          <div className="flex justify-between text-green-600"><dt>Discount</dt><dd>-{formatPrice(totals.discount)}</dd></div>
        )}
        <div className="flex justify-between"><dt className="text-gray-600">Shipping</dt><dd>{totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}</dd></div>
        <div className="flex justify-between"><dt className="text-gray-600">Tax</dt><dd>{formatPrice(totals.tax)}</dd></div>
        <div className="flex justify-between font-bold pt-2 border-t border-gray-200"><dt>Total</dt><dd>{formatPrice(totals.total)}</dd></div>
      </dl>
    </div>
  );
}
