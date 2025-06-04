import express from 'express';
import { addVehicle, listVehicles, deleteVehicle } from '../controllers/vehicleController.js';
import { authenticate } from '../middleware/auth.js';
const router = express.Router();

router.post('/', authenticate, addVehicle);
router.get('/', authenticate, listVehicles);
router.delete('/:id', authenticate, deleteVehicle);

export default router;
