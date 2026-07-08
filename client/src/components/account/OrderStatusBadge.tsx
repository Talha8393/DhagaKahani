import type { OrderStatus } from '../../types';
import { Badge } from '../ui/Badge';

const statusVariant: Record<OrderStatus, 'default' | 'success' | 'warning' | 'danger' | 'brand'> = {
  Processing: 'warning',
  Shipped: 'brand',
  Delivered: 'success',
  Cancelled: 'danger',
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge variant={statusVariant[status]}>{status}</Badge>;
}
