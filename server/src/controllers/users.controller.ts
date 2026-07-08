import type { Request, Response } from 'express';
import { userService } from '../services/user.service.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.updateProfile(req.user!.userId, req.body);
  res.json(user);
});

export const getAddresses = asyncHandler(async (req: Request, res: Response) => {
  const addresses = await userService.getAddresses(req.user!.userId);
  res.json(addresses);
});

export const addAddress = asyncHandler(async (req: Request, res: Response) => {
  const address = await userService.addAddress(req.user!.userId, req.body);
  res.status(201).json(address);
});

export const updateAddress = asyncHandler(async (req: Request, res: Response) => {
  const address = await userService.updateAddress(req.user!.userId, req.params.id, req.body);
  res.json(address);
});

export const deleteAddress = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.deleteAddress(req.user!.userId, req.params.id);
  res.json(result);
});

export const getWishlist = asyncHandler(async (req: Request, res: Response) => {
  const wishlist = await userService.getWishlist(req.user!.userId);
  res.json(wishlist);
});

export const toggleWishlist = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.toggleWishlist(req.user!.userId, req.body.productId);
  res.json(result);
});
