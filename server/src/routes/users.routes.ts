import { Router } from 'express';
import * as usersController from '../controllers/users.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.patch('/profile', usersController.updateProfile);
router.get('/addresses', usersController.getAddresses);
router.post('/addresses', usersController.addAddress);
router.patch('/addresses/:id', usersController.updateAddress);
router.delete('/addresses/:id', usersController.deleteAddress);
router.get('/wishlist', usersController.getWishlist);
router.post('/wishlist/toggle', usersController.toggleWishlist);

export default router;
