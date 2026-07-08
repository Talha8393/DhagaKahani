import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import {
  DashboardStatsCards,
  OrdersByStatusChart,
  LowStockAlert,
  RecentOrdersTable,
} from '../../components/admin/DashboardStats';
import { Skeleton } from '../../components/ui/Skeleton';
import type { DashboardStats } from '../../types';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminService
      .getDashboard()
      .then(setStats)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return <div className="text-red-600 bg-white rounded-xl p-6 border">{error || 'Failed to load dashboard'}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <DashboardStatsCards stats={stats} />
      <div className="grid lg:grid-cols-2 gap-6">
        <OrdersByStatusChart stats={stats} />
        <LowStockAlert products={stats.lowStockProducts} />
      </div>
      <RecentOrdersTable orders={stats.recentOrders} />
    </div>
  );
}
