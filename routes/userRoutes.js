const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Customer registration
router.post('/register/customer', userController.registerCustomer);
// Trucker registration
router.post('/register/trucker', userController.registerTrucker);
// User profile (generic, can be expanded)
router.get('/profile/:userId', userController.getProfile);

module.exports = router;
