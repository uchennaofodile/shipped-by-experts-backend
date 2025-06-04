import Stripe from 'stripe';
import { Payment } from '../models/Payment.js';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, shipmentId } = req.body;
    const userId = req.user.id;
    // Create a Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects cents
      currency: 'usd',
      metadata: { userId, shipmentId },
    });
    // Save payment record (pending)
    await Payment.create({
      userId,
      shipmentId,
      amount,
      status: 'pending',
      stripePaymentId: paymentIntent.id,
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentIntentId, status } = req.body;
    const payment = await Payment.findOne({ where: { stripePaymentId: paymentIntentId } });
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    payment.status = status;
    await payment.save();
    res.json({ message: 'Payment status updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update payment status' });
  }
};
