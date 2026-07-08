import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { OrderTable } from '../../components/admin/OrderTable';
import { Skeleton } from '../../components/ui/Skeleton';
import { useToastStore } from '../../store/useToastStore';
import type { Order, OrderStatus } from '../../types';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const addToast = useToastStore((s) => s.addToast);

  useEffect(() => {
    adminService.getOrders().then(setOrders).finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      const updated = await adminService.updateOrderStatus(orderId, status);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      addToast(`Order updated to ${status}`);
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Update failed', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Orders</h1>

      {loading ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : orders.length === 0 ? (
        <div className="bg-white border rounded-xl p-12 text-center text-gray-500">
          No orders yet.
        </div>
      ) : (
        <OrderTable orders={orders} onStatusChange={handleStatusChange} updatingId={updatingId} />
      )}
    </div>
  );
}
