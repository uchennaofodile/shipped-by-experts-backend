import express from 'express';
const router = express.Router();

import authRoutes from './authRoutes.js';
import vehicleRoutes from './vehicleRoutes.js';
// import userRoutes from './userRoutes.js';
import shipmentRoutes from './shipmentRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import matchingRoutes from './matchingRoutes.js';
import trackingRoutes from './trackingRoutes.js';
import adminRoutes from './adminRoutes.js';
import profileRoutes from './profileRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import reviewRoutes from './reviewRoutes.js';
import oauthRoutes from './oauthRoutes.js';
import bookingRoutes from './bookingRoutes.js';
// ...

router.use('/auth', authRoutes);
router.use('/auth', oauthRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/shipments', shipmentRoutes);
router.use('/payments', paymentRoutes);
router.use('/matching', matchingRoutes);
router.use('/tracking', trackingRoutes);
router.use('/admin', adminRoutes);
router.use('/profile', profileRoutes);
router.use('/notifications', notificationRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/reviews', reviewRoutes);
router.use('/bookings', bookingRoutes);
// router.use('/users', userRoutes);
// ...

export default router;
