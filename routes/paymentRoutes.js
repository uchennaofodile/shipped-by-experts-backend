const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Payment processing endpoint
router.post('/pay', paymentController.processPayment);
// Invoicing endpoint
router.post('/invoice', paymentController.generateInvoice);

module.exports = router;
