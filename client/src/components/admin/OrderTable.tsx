import type { Order, OrderStatus } from '../../types';
import { formatPrice, formatDate } from '../../utils/formatters';
import { OrderStatusBadge } from '../account/OrderStatusBadge';
import { ORDER_STATUSES } from '../../utils/constants';

interface OrderTableProps {
  orders: Order[];
  onStatusChange: (orderId: string, status: OrderStatus) => void;
  updatingId?: string | null;
}

export function OrderTable({ orders, onStatusChange, updatingId }: OrderTableProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Order</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Date</th>
              <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Customer</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-right px-4 py-3 font-medium">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{order.orderNumber}</p>
                  <p className="text-xs text-gray-500 md:hidden">{formatDate(order.createdAt)}</p>
                </td>
                <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{formatDate(order.createdAt)}</td>
                <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{order.shippingAddress.fullName}</td>
                <td className="px-4 py-3">
                  <select
                    value={order.status}
                    onChange={(e) => onStatusChange(order.id, e.target.value as OrderStatus)}
                    disabled={updatingId === order.id}
                    className="rounded-lg border border-gray-300 px-2 py-1 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:opacity-50"
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <div className="mt-1 sm:hidden">
                    <OrderStatusBadge status={order.status} />
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-medium">{formatPrice(order.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
