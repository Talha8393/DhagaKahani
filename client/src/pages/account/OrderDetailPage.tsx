import { Link, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { OrderStatusBadge } from '../../components/account/OrderStatusBadge';
import { Skeleton } from '../../components/ui/Skeleton';
import { useOrder } from '../../hooks/useOrders';
import { formatPrice, formatDate } from '../../utils/formatters';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { order, loading, error } = useOrder(id);

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
        <p className="text-red-600 mb-4">{error || 'Order not found'}</p>
        <Link to="/account/orders" className="text-brand-600 hover:underline">← Back to orders</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/account/orders" className="inline-flex items-center gap-1 text-sm text-brand-600 hover:underline">
        <ChevronLeft className="h-4 w-4" /> Back to orders
      </Link>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{order.orderNumber}</h2>
            <p className="text-sm text-gray-500 mt-1">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Shipping Address</h3>
            <address className="text-sm text-gray-600 not-italic">
              {order.shippingAddress.fullName}<br />
              {order.shippingAddress.street}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
              {order.shippingAddress.country}
            </address>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Payment</h3>
            <p className="text-sm text-gray-600 capitalize">
              {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}
            </p>
            {order.couponCode && (
              <p className="text-sm text-green-600 mt-1">Coupon: {order.couponCode}</p>
            )}
          </div>
        </div>

        <h3 className="text-sm font-semibold text-gray-700 mb-3">Items</h3>
        <div className="space-y-3 mb-6">
          {order.items.map((item, i) => (
            <div key={i} className="flex gap-4">
              <img src={item.productImage} alt="" className="w-16 h-16 rounded-lg object-cover bg-gray-100" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.productName}</p>
                {item.variantLabel && <p className="text-sm text-gray-500">{item.variantLabel}</p>}
                <p className="text-sm text-gray-500">Qty: {item.quantity} × {formatPrice(item.unitPrice)}</p>
              </div>
              <p className="font-medium">{formatPrice(item.unitPrice * item.quantity)}</p>
            </div>
          ))}
        </div>

        <dl className="space-y-2 text-sm border-t border-gray-100 pt-4 max-w-xs ml-auto">
          <div className="flex justify-between"><dt className="text-gray-600">Subtotal</dt><dd>{formatPrice(order.subtotal)}</dd></div>
          {order.discount > 0 && (
            <div className="flex justify-between text-green-600"><dt>Discount</dt><dd>-{formatPrice(order.discount)}</dd></div>
          )}
          <div className="flex justify-between"><dt className="text-gray-600">Shipping</dt><dd>{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</dd></div>
          <div className="flex justify-between"><dt className="text-gray-600">Tax</dt><dd>{formatPrice(order.tax)}</dd></div>
          <div className="flex justify-between font-bold text-base pt-2 border-t"><dt>Total</dt><dd>{formatPrice(order.total)}</dd></div>
        </dl>
      </div>
    </div>
  );
}
