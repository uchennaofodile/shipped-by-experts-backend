const { sendBookingConfirmationEmail } = require('../services/emailService');

// POST /api/book-shipment
async function bookShipment(req, res) {
  try {
    const { email, make, model, year, pickup, dropoff, estimatedCost } = req.body;
    // Here you could save the booking to the database if needed
    await sendBookingConfirmationEmail(email, { make, model, year, pickup, dropoff, estimatedCost });
    res.status(200).json({ message: 'Booking confirmed and email sent.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process booking.' });
  }
}

module.exports = { bookShipment };
