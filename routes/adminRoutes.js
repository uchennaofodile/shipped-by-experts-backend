const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Admin dashboard endpoints
router.get('/users', adminController.listUsers);
router.get('/shipments', adminController.listShipments);
router.get('/payments', adminController.listPayments);
router.get('/stats', adminController.getStats);

module.exports = router;
