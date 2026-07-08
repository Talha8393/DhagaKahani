import { Router } from 'express';
import * as adminController from '../controllers/admin.controller.js';
import { authMiddleware } from '../middleware/auth.js';
import { adminOnly } from '../middleware/adminOnly.js';

const router = Router();

router.use(authMiddleware, adminOnly);

router.get('/dashboard', adminController.getDashboard);
router.get('/products', adminController.getAdminProducts);
router.post('/products', adminController.createProduct);
router.patch('/products/:id', adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);
router.get('/orders', adminController.getAdminOrders);
router.patch('/orders/:id/status', adminController.updateOrderStatus);

export default router;
