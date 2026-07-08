import type { Request, Response } from 'express';
import { orderService } from '../services/order.service.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await orderService.getByUser(req.user!.userId);
  res.json(orders);
});

export const getOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await orderService.getById(req.params.id, req.user!.userId);
  res.json(order);
});

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await orderService.create({ ...req.body, userId: req.user!.userId });
  res.status(201).json(order);
});

export const validateCoupon = asyncHandler(async (req: Request, res: Response) => {
  const result = await orderService.validateCoupon(req.body.code, req.body.subtotal);
  res.json(result);
});

export const mockPayment = asyncHandler(async (req: Request, res: Response) => {
  const { simulateFailure } = req.body;
  // EXTENSION: Integrate Stripe/PayPal here
  if (simulateFailure) {
    return res.status(402).json({ success: false, message: 'Payment declined (mock)' });
  }
  res.json({ success: true, transactionId: `txn_mock_${Date.now()}` });
});
