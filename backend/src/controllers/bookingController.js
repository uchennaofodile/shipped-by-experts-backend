const { sendBookingConfirmationEmail } = require('../services/emailService');
const { Booking } = require('../models/Booking');

// POST /api/book-shipment
async function bookShipment(req, res, next) {
  try {
    // Require authentication (assume req.user is set by auth middleware)
    if (!req.user) {
      const err = new Error('Unauthorized');
      err.status = 401;
      err.isPublic = true;
      return next(err);
    }
    const { email, make, model, year, pickup, dropoff, estimatedCost } = req.body;
    // Input validation
    if (!email || !make || !model || !year || !pickup || !dropoff) {
      const err = new Error('Missing required fields');
      err.status = 400;
      err.isPublic = true;
      return next(err);
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      const err = new Error('Invalid email address');
      err.status = 400;
      err.isPublic = true;
      return next(err);
    }
    // Save booking to database
    const booking = await Booking.create({
      userId: req.user.id,
      email,
      make,
      model,
      year,
      pickup,
      dropoff,
      estimatedCost: estimatedCost || 0
    });
    // Send confirmation email
    await sendBookingConfirmationEmail(email, { make, model, year, pickup, dropoff, estimatedCost });
    res.status(200).json({ message: 'Booking confirmed and email sent.', bookingId: booking.id });
  } catch (err) {
    err.status = 500;
    err.isPublic = false;
    next(err);
  }
}

module.exports = { bookShipment };
