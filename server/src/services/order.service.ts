import { v4 as uuidv4 } from 'uuid';
import { db } from './db.service.js';
import { generateOrderNumber } from '../utils/helpers.js';
import { AppError } from '../middleware/errorHandler.js';
import type { Order, OrderStatus, Address, Coupon } from '../types/index.js';

export class OrderService {
  async getByUser(userId: string) {
    const orders = await db.getOrders<Order[]>();
    return orders
      .filter((o) => o.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getById(id: string, userId?: string) {
    const orders = await db.getOrders<Order[]>();
    const order = orders.find((o) => o.id === id);
    if (!order) throw new AppError(404, 'Order not found');
    if (userId && order.userId !== userId) throw new AppError(403, 'Access denied');
    return order;
  }

  async getAll() {
    const orders = await db.getOrders<Order[]>();
    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async create(data: {
    userId: string;
    items: Order['items'];
    shippingAddress: Address;
    paymentMethod: Order['paymentMethod'];
    subtotal: number;
    tax: number;
    shipping: number;
    discount: number;
    total: number;
    couponCode?: string;
  }) {
    const orders = await db.getOrders<Order[]>();
    const now = new Date().toISOString();
    const order: Order = {
      id: uuidv4(),
      orderNumber: generateOrderNumber(),
      ...data,
      status: 'Processing',
      createdAt: now,
      updatedAt: now,
    };
    orders.push(order);
    await db.saveOrders(orders);
    return order;
  }

  async updateStatus(id: string, status: OrderStatus) {
    const orders = await db.getOrders<Order[]>();
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) throw new AppError(404, 'Order not found');
    orders[index].status = status;
    orders[index].updatedAt = new Date().toISOString();
    await db.saveOrders(orders);
    return orders[index];
  }

  async validateCoupon(code: string, subtotal: number) {
    const coupons = await db.getCoupons<Coupon[]>();
    const coupon = coupons.find((c) => c.code.toUpperCase() === code.toUpperCase() && c.active);
    if (!coupon) throw new AppError(400, 'Invalid coupon code');
    if (subtotal < coupon.minOrder) {
      throw new AppError(400, `Minimum order of $${coupon.minOrder} required for this coupon`);
    }
    const discount =
      coupon.type === 'percentage'
        ? Math.round(subtotal * (coupon.value / 100) * 100) / 100
        : coupon.value;
    return { coupon, discount: Math.min(discount, subtotal) };
  }
}

export const orderService = new OrderService();
