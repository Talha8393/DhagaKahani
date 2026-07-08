import { productService } from './product.service.js';
import { orderService } from './order.service.js';
import type { Product, Order } from '../types/index.js';

export class AdminService {
  async getDashboardStats() {
    const orders = await orderService.getAll();
    const products = (await productService.getAll({ limit: 1000 })).data;

    const totalRevenue = orders
      .filter((o) => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    const lowStock = products.filter((p) => p.stock <= 5);

    const statusCounts = orders.reduce(
      (acc, o) => {
        acc[o.status] = (acc[o.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalOrders: orders.length,
      totalRevenue,
      totalProducts: products.length,
      lowStockCount: lowStock.length,
      lowStockProducts: lowStock.slice(0, 5),
      ordersByStatus: statusCounts,
      recentOrders: orders.slice(0, 5),
    };
  }

  async getAllProducts() {
    return (await productService.getAll({ limit: 1000 })).data;
  }

  async createProduct(data: Omit<Product, 'id' | 'slug' | 'createdAt'>) {
    return productService.create(data);
  }

  async updateProduct(id: string, data: Partial<Product>) {
    return productService.update(id, data);
  }

  async deleteProduct(id: string) {
    return productService.delete(id);
  }

  async getAllOrders() {
    return orderService.getAll();
  }

  async updateOrderStatus(id: string, status: Order['status']) {
    return orderService.updateStatus(id, status);
  }
}

export const adminService = new AdminService();
