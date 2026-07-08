import { apiRequest } from './api';
import type { Order, CouponValidation } from '../types';

export const orderService = {
  getAll() {
    return apiRequest<Order[]>('/orders');
  },

  getById(id: string) {
    return apiRequest<Order>(`/orders/${id}`);
  },

  create(data: Omit<Order, 'id' | 'orderNumber' | 'userId' | 'status' | 'createdAt' | 'updatedAt'>) {
    return apiRequest<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  validateCoupon(code: string, subtotal: number) {
    return apiRequest<CouponValidation>('/orders/validate-coupon', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal }),
    });
  },

  mockPayment(simulateFailure = false) {
    return apiRequest<{ success: boolean; transactionId?: string; message?: string }>(
      '/orders/mock-payment',
      {
        method: 'POST',
        body: JSON.stringify({ simulateFailure }),
      },
    );
  },
};
