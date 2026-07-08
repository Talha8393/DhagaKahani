import { Link } from 'react-router-dom';
import type { CartTotals } from '../../types/cart';
import { formatPrice } from '../../utils/formatters';
import { FREE_SHIPPING_THRESHOLD } from '../../utils/constants';
import { Button } from '../ui/Button';
import { CouponInput, CouponHint } from './CouponInput';

interface CartSummaryProps {
  totals: CartTotals;
  itemCount: number;
  showCheckout?: boolean;
  showCoupon?: boolean;
}

export function CartSummary({ totals, itemCount, showCheckout = true, showCoupon = true }: CartSummaryProps) {
  const amountToFreeShipping = FREE_SHIPPING_THRESHOLD - totals.subtotal;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-24">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

      {showCoupon && totals.subtotal > 0 && (
        <div className="mb-4">
          <CouponInput subtotal={totals.subtotal} />
          <CouponHint />
        </div>
      )}

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-gray-600">Subtotal ({itemCount} items)</dt>
          <dd className="font-medium">{formatPrice(totals.subtotal)}</dd>
        </div>
        {totals.discount > 0 && (
          <div className="flex justify-between text-green-600">
            <dt>Discount</dt>
            <dd className="font-medium">-{formatPrice(totals.discount)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-gray-600">Shipping</dt>
          <dd className="font-medium">
            {totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-600">Tax</dt>
          <dd className="font-medium">{formatPrice(totals.tax)}</dd>
        </div>
        <div className="flex justify-between pt-2 border-t border-gray-200 text-base">
          <dt className="font-semibold text-gray-900">Total</dt>
          <dd className="font-bold text-gray-900">{formatPrice(totals.total)}</dd>
        </div>
      </dl>

      {amountToFreeShipping > 0 && totals.subtotal > 0 && (
        <p className="text-xs text-gray-500 mt-3">
          Add {formatPrice(amountToFreeShipping)} more for free shipping!
        </p>
      )}

      {showCheckout && totals.subtotal > 0 && (
        <Link to="/checkout" className="block mt-6">
          <Button size="lg" className="w-full">Proceed to Checkout</Button>
        </Link>
      )}
    </div>
  );
}
