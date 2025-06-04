const express = require('express');
const router = express.Router();
const verificationController = require('../controllers/verificationController');

// Driver verification endpoint
router.post('/verify', verificationController.verifyDriver);
// Ratings endpoint
router.post('/rate', verificationController.rateUser);

module.exports = router;
