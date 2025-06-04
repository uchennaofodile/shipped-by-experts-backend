import express from 'express';
import { updateShipmentStatus, getShipmentStatus } from '../controllers/trackingController.js';
import { authenticate } from '../middleware/auth.js';
const router = express.Router();

router.patch('/:id/status', authenticate, updateShipmentStatus);
router.get('/:id/status', authenticate, getShipmentStatus);

export default router;
