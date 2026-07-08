import type { Request, Response } from 'express';
import { adminService } from '../services/admin.service.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getDashboard = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await adminService.getDashboardStats();
  res.json(stats);
});

export const getAdminProducts = asyncHandler(async (_req: Request, res: Response) => {
  const products = await adminService.getAllProducts();
  res.json(products);
});

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await adminService.createProduct(req.body);
  res.status(201).json(product);
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await adminService.updateProduct(req.params.id, req.body);
  res.json(product);
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const result = await adminService.deleteProduct(req.params.id);
  res.json(result);
});

export const getAdminOrders = asyncHandler(async (_req: Request, res: Response) => {
  const orders = await adminService.getAllOrders();
  res.json(orders);
});

export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const order = await adminService.updateOrderStatus(req.params.id, req.body.status);
  res.json(order);
});
