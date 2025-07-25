const express = require('express');
const router = express.Router();
const { bookShipment } = require('../controllers/bookingController');
const { authenticate } = require('../middleware/auth');

router.post('/book-shipment', authenticate, bookShipment);

module.exports = router;
