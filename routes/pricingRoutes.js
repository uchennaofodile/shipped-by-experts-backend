const express = require('express');
const router = express.Router();
const pricingController = require('../controllers/pricingController');

// Dynamic pricing endpoint
router.post('/calculate', pricingController.calculatePrice);

module.exports = router;
