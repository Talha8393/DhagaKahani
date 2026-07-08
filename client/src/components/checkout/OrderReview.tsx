import type { CartLineItem, CartTotals, ShippingFormData, PaymentMethod } from '../../types/cart';
import { formatPrice } from '../../utils/formatters';

interface OrderReviewProps {
  items: CartLineItem[];
  totals: CartTotals;
  shipping: ShippingFormData;
  paymentMethod: PaymentMethod;
  couponCode?: string | null;
}

const paymentLabels: Record<PaymentMethod, string> = {
  card: 'Credit / Debit Card',
  cod: 'Cash on Delivery',
  wallet: 'Digital Wallet',
};

export function OrderReview({ items, totals, shipping, paymentMethod, couponCode }: OrderReviewProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Review Your Order</h2>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Items</h3>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={`${item.productId}-${item.variantId}`} className="flex gap-3">
              <img src={item.productImage} alt="" className="w-14 h-14 rounded-lg object-cover bg-gray-100" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.productName}</p>
                {item.variantLabel && <p className="text-xs text-gray-500">{item.variantLabel}</p>}
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-medium">{formatPrice(item.unitPrice * item.quantity)}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Shipping Address</h3>
        <address className="text-sm text-gray-600 not-italic">
          {shipping.fullName}<br />
          {shipping.street}<br />
          {shipping.city}, {shipping.state} {shipping.zipCode}<br />
          {shipping.country}<br />
          {shipping.phone}
        </address>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-1">Payment</h3>
        <p className="text-sm text-gray-600">{paymentLabels[paymentMethod]}</p>
      </div>

      <dl className="space-y-1 text-sm border-t border-gray-200 pt-4">
        <div className="flex justify-between"><dt className="text-gray-600">Subtotal</dt><dd>{formatPrice(totals.subtotal)}</dd></div>
        {couponCode && (
          <div className="flex justify-between text-green-600"><dt>Coupon ({couponCode})</dt><dd>-{formatPrice(totals.discount)}</dd></div>
        )}
        <div className="flex justify-between"><dt className="text-gray-600">Shipping</dt><dd>{totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}</dd></div>
        <div className="flex justify-between"><dt className="text-gray-600">Tax</dt><dd>{formatPrice(totals.tax)}</dd></div>
        <div className="flex justify-between font-bold text-base pt-2 border-t"><dt>Total</dt><dd>{formatPrice(totals.total)}</dd></div>
      </dl>
    </div>
  );
}
