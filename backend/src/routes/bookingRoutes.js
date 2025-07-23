const express = require('express');
const router = express.Router();
const { bookShipment } = require('../controllers/bookingController');

router.post('/book-shipment', bookShipment);

module.exports = router;
