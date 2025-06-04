import express from 'express';
import { createPaymentIntent, updatePaymentStatus } from '../controllers/paymentController.js';
import { authenticate } from '../middleware/auth.js';
const router = express.Router();

router.post('/create-intent', authenticate, createPaymentIntent);
router.post('/update-status', authenticate, updatePaymentStatus);

export default router;
