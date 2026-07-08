import { Link, useParams, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { PageMeta } from '../components/layout/PageMeta';
import { Button } from '../components/ui/Button';
import { formatPrice, formatDate } from '../utils/formatters';
import type { Order } from '../types';

export default function OrderConfirmationPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const location = useLocation();
  const order = (location.state as { order?: Order })?.order;

  if (!order) {
    return (
      <>
        <PageMeta title="Order Confirmation" />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h1>
          {orderNumber && (
            <p className="text-gray-600 mb-6">Order <span className="font-semibold">{orderNumber}</span> has been placed.</p>
          )}
          <Link to="/products"><Button>Continue Shopping</Button></Link>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta title="Order Confirmation" />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">Thank you for your purchase.</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Order Number</span>
            <span className="font-semibold text-gray-900">{order.orderNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Date</span>
            <span>{formatDate(order.createdAt)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Payment</span>
            <span className="capitalize">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Status</span>
            <span className="text-brand-600 font-medium">{order.status}</span>
          </div>
          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Items</p>
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm py-1">
                <span>{item.productName} × {item.quantity}</span>
                <span>{formatPrice(item.unitPrice * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-4 flex justify-between font-bold">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>

        <div className="flex gap-4 justify-center mt-8">
          <Link to="/account/orders"><Button variant="outline">View Orders</Button></Link>
          <Link to="/products"><Button>Continue Shopping</Button></Link>
        </div>
      </div>
    </>
  );
}
