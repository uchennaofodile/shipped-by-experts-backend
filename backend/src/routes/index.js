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
// ...

router.use('/auth', authRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/shipments', shipmentRoutes);
router.use('/payments', paymentRoutes);
router.use('/matching', matchingRoutes);
router.use('/tracking', trackingRoutes);
router.use('/admin', adminRoutes);
// router.use('/users', userRoutes);
// ...

export default router;
