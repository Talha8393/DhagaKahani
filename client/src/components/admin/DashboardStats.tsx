import { formatPrice } from '../../utils/formatters';
import type { DashboardStats } from '../../types';

interface DashboardStatsCardsProps {
  stats: DashboardStats;
}

export function DashboardStatsCards({ stats }: DashboardStatsCardsProps) {
  const cards = [
    { label: 'Total Revenue', value: formatPrice(stats.totalRevenue), color: 'text-green-600 bg-green-50' },
    { label: 'Total Orders', value: stats.totalOrders.toString(), color: 'text-brand-600 bg-brand-50' },
    { label: 'Products', value: stats.totalProducts.toString(), color: 'text-purple-600 bg-purple-50' },
    { label: 'Low Stock', value: stats.lowStockCount.toString(), color: stats.lowStockCount > 0 ? 'text-red-600 bg-red-50' : 'text-gray-600 bg-gray-50' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">{card.label}</p>
          <p className={`text-2xl font-bold ${card.color.split(' ')[0]}`}>{card.value}</p>
        </div>
      ))}
    </div>
  );
}

export function OrdersByStatusChart({ stats }: { stats: DashboardStats }) {
  const statuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'] as const;
  const max = Math.max(...statuses.map((s) => stats.ordersByStatus[s] || 0), 1);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-4">Orders by Status</h3>
      <div className="space-y-3">
        {statuses.map((status) => {
          const count = stats.ordersByStatus[status] || 0;
          const pct = (count / max) * 100;
          return (
            <div key={status}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">{status}</span>
                <span className="font-medium">{count}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function LowStockAlert({ products }: { products: DashboardStats['lowStockProducts'] }) {
  if (products.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-2">Low Stock Alerts</h3>
        <p className="text-sm text-green-600">All products are well stocked.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-red-200 rounded-xl p-6 shadow-sm">
      <h3 className="font-semibold text-red-700 mb-4">Low Stock Alerts</h3>
      <div className="space-y-3">
        {products.map((p) => (
          <div key={p.id} className="flex items-center gap-3">
            <img src={p.images[0]} alt="" className="w-10 h-10 rounded object-cover bg-gray-100" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
              <p className="text-xs text-red-600">{p.stock} left in stock</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RecentOrdersTable({ orders }: { orders: DashboardStats['recentOrders'] }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">Recent Orders</h3>
      </div>
      {orders.length === 0 ? (
        <p className="p-6 text-sm text-gray-500">No orders yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left px-6 py-3 font-medium">Order</th>
                <th className="text-left px-6 py-3 font-medium">Status</th>
                <th className="text-right px-6 py-3 font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-900">{order.orderNumber}</td>
                  <td className="px-6 py-3 text-gray-600">{order.status}</td>
                  <td className="px-6 py-3 text-right font-medium">{formatPrice(order.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
