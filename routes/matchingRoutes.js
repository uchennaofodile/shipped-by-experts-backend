const express = require('express');
const router = express.Router();
const matchingController = require('../controllers/matchingController');

// AI matching endpoint
router.post('/match', matchingController.matchShipments);

module.exports = router;
