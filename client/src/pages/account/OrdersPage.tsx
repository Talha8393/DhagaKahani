import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { OrderStatusBadge } from '../../components/account/OrderStatusBadge';
import { Skeleton } from '../../components/ui/Skeleton';
import { Button } from '../../components/ui/Button';
import { useOrders } from '../../hooks/useOrders';
import { formatPrice, formatDate } from '../../utils/formatters';

export default function OrdersPage() {
  const { orders, loading, error } = useOrders();

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 text-center text-red-600">
        {error}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
        <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h2>
        <p className="text-gray-500 mb-6">When you place an order, it will appear here.</p>
        <Link to="/products"><Button>Start Shopping</Button></Link>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
      {orders.map((order) => (
        <Link
          key={order.id}
          to={`/account/orders/${order.id}`}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 hover:bg-gray-50 transition-colors"
        >
          <div>
            <div className="flex items-center gap-3 mb-1">
              <p className="font-semibold text-gray-900">{order.orderNumber}</p>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="text-sm text-gray-500">{formatDate(order.createdAt)} · {order.items.length} item(s)</p>
            <p className="text-sm text-gray-500 capitalize mt-0.5">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}</p>
          </div>
          <div className="flex items-center gap-4">
            <p className="font-bold text-gray-900">{formatPrice(order.total)}</p>
            <span className="text-sm text-brand-600 font-medium">View →</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
