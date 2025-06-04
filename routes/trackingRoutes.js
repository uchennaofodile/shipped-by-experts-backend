const express = require('express');
const router = express.Router();
const trackingController = require('../controllers/trackingController');

// Real-time tracking endpoint
router.get('/:shipmentId', trackingController.trackShipment);

module.exports = router;
