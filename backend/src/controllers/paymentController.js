import Stripe from 'stripe';
import { Payment } from '../models/Payment.js';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res, next) => {
  try {
    // Require authentication (assume req.user is set by auth middleware)
    if (!req.user) {
      const err = new Error('Unauthorized');
      err.status = 401;
      err.isPublic = true;
      return next(err);
    }
    const { amount, shipmentId } = req.body;
    // Input validation
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      const err = new Error('Invalid or missing amount');
      err.status = 400;
      err.isPublic = true;
      return next(err);
    }
    if (!shipmentId) {
      const err = new Error('Missing shipmentId');
      err.status = 400;
      err.isPublic = true;
      return next(err);
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
    err.status = 500;
    err.isPublic = false;
    next(err);
  }
};

export const updatePaymentStatus = async (req, res, next) => {
  try {
    // Require authentication (assume req.user is set by auth middleware)
    if (!req.user) {
      const err = new Error('Unauthorized');
      err.status = 401;
      err.isPublic = true;
      return next(err);
    }
    const { paymentIntentId, status } = req.body;
    // Input validation
    if (!paymentIntentId || typeof paymentIntentId !== 'string') {
      const err = new Error('Invalid or missing paymentIntentId');
      err.status = 400;
      err.isPublic = true;
      return next(err);
    }
    if (!status || !['pending', 'succeeded', 'failed'].includes(status)) {
      const err = new Error('Invalid or missing status');
      err.status = 400;
      err.isPublic = true;
      return next(err);
    }
    const payment = await Payment.findOne({ where: { stripePaymentId: paymentIntentId } });
    if (!payment) {
      const err = new Error('Payment not found');
      err.status = 404;
      err.isPublic = true;
      return next(err);
    }
    payment.status = status;
    await payment.save();
    res.json({ message: 'Payment status updated' });
  } catch (err) {
    err.status = 500;
    err.isPublic = false;
    next(err);
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
