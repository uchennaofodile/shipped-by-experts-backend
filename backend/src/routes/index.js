import express from 'express';
const router = express.Router();

import authRoutes from './authRoutes.js';
import vehicleRoutes from './vehicleRoutes.js';
// import userRoutes from './userRoutes.js';
import shipmentRoutes from './shipmentRoutes.js';
import paymentRoutes from './paymentRoutes.js';
// ...

router.use('/auth', authRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/shipments', shipmentRoutes);
router.use('/payments', paymentRoutes);
// router.use('/users', userRoutes);
// ...

export default router;
