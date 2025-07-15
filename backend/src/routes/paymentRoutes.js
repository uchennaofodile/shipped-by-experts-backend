import express from 'express';
import { createPaymentIntent, updatePaymentStatus, stripeWebhook } from '../controllers/paymentController.js';
import { authenticate } from '../middleware/auth.js';
const router = express.Router();

router.post('/create-intent', authenticate, createPaymentIntent);
router.post('/update-status', authenticate, updatePaymentStatus);

// Stripe webhook endpoint (no authentication, raw body required)
router.post('/webhook', stripeWebhook);

export default router;
