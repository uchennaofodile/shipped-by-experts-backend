import express from 'express';
import { bookShipment, listShipments, getShipment } from '../controllers/shipmentController.js';
import { authenticate } from '../middleware/auth.js';
const router = express.Router();

router.post('/', authenticate, bookShipment);
router.get('/', authenticate, listShipments);
router.get('/:id', authenticate, getShipment);

export default router;
