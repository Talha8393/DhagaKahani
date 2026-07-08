import { Router } from 'express';
import * as productsController from '../controllers/products.controller.js';

const router = Router();

router.get('/', productsController.getProducts);
router.get('/categories', productsController.getCategories);
router.get('/slug/:slug', productsController.getProductBySlug);
router.get('/:id/related', productsController.getRelatedProducts);
router.get('/:id', productsController.getProduct);

export default router;
