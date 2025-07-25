import Stripe from 'stripe';
import { Payment } from '../models/Payment.js';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
  try {
    // Require authentication (assume req.user is set by auth middleware)
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { amount, shipmentId } = req.body;
    // Input validation
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Invalid or missing amount' });
    }
    if (!shipmentId) {
      return res.status(400).json({ error: 'Missing shipmentId' });
    }
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
    console.error('Payment intent error:', err);
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

// Stripe Webhook Handler
export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody || req.body, // req.rawBody is needed if using bodyParser.raw({type: 'application/json'})
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      // Update payment status to succeeded
      await Payment.update(
        { status: 'succeeded' },
        { where: { stripePaymentId: paymentIntent.id } }
      );
      break;
    }
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      // Update payment status to failed
      await Payment.update(
        { status: 'failed' },
        { where: { stripePaymentId: paymentIntent.id } }
      );
      break;
    }
    // ... handle other event types as needed
    default:
      // Unexpected event type
      break;
  }

  // Return a 200 response to acknowledge receipt of the event
  res.json({ received: true });
};
