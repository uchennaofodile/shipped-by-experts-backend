const { sendBookingConfirmationEmail } = require('../services/emailService');
const { Booking } = require('../models/Booking');

// POST /api/book-shipment
async function bookShipment(req, res) {
  try {
    // Require authentication (assume req.user is set by auth middleware)
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { email, make, model, year, pickup, dropoff, estimatedCost } = req.body;
    // Input validation
    if (!email || !make || !model || !year || !pickup || !dropoff) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
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
    console.error('Booking error:', err);
    res.status(500).json({ error: 'Failed to process booking.' });
  }
}

module.exports = { bookShipment };
