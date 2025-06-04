import express from 'express';
import { customerDashboard, truckerDashboard, dealershipDashboard, adminDashboard } from '../controllers/dashboardController.js';
import { authenticate, authorize } from '../middleware/auth.js';
const router = express.Router();

router.get('/customer', authenticate, authorize('customer'), customerDashboard);
router.get('/trucker', authenticate, authorize('trucker'), truckerDashboard);
router.get('/dealership', authenticate, authorize('dealership'), dealershipDashboard);
router.get('/admin', authenticate, authorize('admin'), adminDashboard);

export default router;
