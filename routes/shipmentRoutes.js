const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipmentController');

// Book a shipment (customer or dealership)
router.post('/book', shipmentController.bookShipment);
// Bulk upload for dealerships
router.post('/bulk-upload', shipmentController.bulkUpload);
// Get shipment status
router.get('/:shipmentId', shipmentController.getShipmentStatus);

module.exports = router;
