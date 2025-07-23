const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS, // App password
  },
});

async function sendBookingConfirmationEmail(to, bookingDetails) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Your Car Shipment Booking is Confirmed!',
    text: `Thank you for booking with Shipped By Experts!\n\nDetails:\nVehicle: ${bookingDetails.make} ${bookingDetails.model} (${bookingDetails.year})\nPickup: ${bookingDetails.pickup}\nDrop-off: ${bookingDetails.dropoff}\nEstimated Cost: $${bookingDetails.estimatedCost}\n\nWe will contact you soon with further details.`,
  };
  await transporter.sendMail(mailOptions);
}

module.exports = { sendBookingConfirmationEmail };
