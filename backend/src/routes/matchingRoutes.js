import express from 'express';
import { matchShipments } from '../controllers/matchingController.js';
import { authenticate } from '../middleware/auth.js';
const router = express.Router();

router.post('/', authenticate, matchShipments);

export default router;
