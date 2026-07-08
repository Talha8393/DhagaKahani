import type { Request, Response } from 'express';
import { productService } from '../services/product.service.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const result = await productService.getAll({
    category: req.query.category as string,
    minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
    maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
    minRating: req.query.minRating ? Number(req.query.minRating) : undefined,
    inStock: req.query.inStock === 'true',
    search: req.query.search as string,
    featured: req.query.featured === 'true',
    isNew: req.query.isNew === 'true',
    sort: req.query.sort as string,
    page: req.query.page ? Number(req.query.page) : 1,
    limit: req.query.limit ? Number(req.query.limit) : 12,
  });
  res.json(result);
});

export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.getById(req.params.id);
  res.json(product);
});

export const getProductBySlug = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.getBySlug(req.params.slug);
  res.json(product);
});

export const getRelatedProducts = asyncHandler(async (req: Request, res: Response) => {
  const products = await productService.getRelated(req.params.id);
  res.json(products);
});

export const getCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await productService.getCategories();
  res.json(categories);
});
