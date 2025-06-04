import express from 'express';
import { listUsers, listShipments } from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/auth.js';
const router = express.Router();

router.get('/users', authenticate, authorize('admin'), listUsers);
router.get('/shipments', authenticate, authorize('admin'), listShipments);

export default router;
