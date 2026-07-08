import { apiRequest } from './api';
import type { Product, Order, DashboardStats } from '../types';

export const adminService = {
  getDashboard() {
    return apiRequest<DashboardStats>('/admin/dashboard');
  },

  getProducts() {
    return apiRequest<Product[]>('/admin/products');
  },

  createProduct(data: Omit<Product, 'id' | 'slug' | 'createdAt'>) {
    return apiRequest<Product>('/admin/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateProduct(id: string, data: Partial<Product>) {
    return apiRequest<Product>(`/admin/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  deleteProduct(id: string) {
    return apiRequest<{ message: string }>(`/admin/products/${id}`, {
      method: 'DELETE',
    });
  },

  getOrders() {
    return apiRequest<Order[]>('/admin/orders');
  },

  updateOrderStatus(id: string, status: Order['status']) {
    return apiRequest<Order>(`/admin/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};
