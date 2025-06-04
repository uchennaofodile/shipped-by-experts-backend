// Central route aggregator (add more routes as needed)
const express = require('express');
const router = express.Router();

router.use('/users', require('./userRoutes'));
router.use('/shipments', require('./shipmentRoutes'));
router.use('/matching', require('./matchingRoutes'));
router.use('/pricing', require('./pricingRoutes'));
router.use('/tracking', require('./trackingRoutes'));
router.use('/payments', require('./paymentRoutes'));
router.use('/verification', require('./verificationRoutes'));
router.use('/admin', require('./adminRoutes'));

module.exports = router;
