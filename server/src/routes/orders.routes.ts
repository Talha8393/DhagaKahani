import { Router } from 'express';
import * as ordersController from '../controllers/orders.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/validate-coupon', ordersController.validateCoupon);

router.use(authMiddleware);

router.get('/', ordersController.getOrders);
router.get('/:id', ordersController.getOrder);
router.post('/', ordersController.createOrder);
router.post('/mock-payment', ordersController.mockPayment);

export default router;
