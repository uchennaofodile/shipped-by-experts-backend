import express from 'express';
import { getProfile, updateProfile, changePassword } from '../controllers/profileController.js';
import { authenticate } from '../middleware/auth.js';
const router = express.Router();

router.get('/', authenticate, getProfile);
router.put('/', authenticate, updateProfile);
router.put('/password', authenticate, changePassword);

export default router;
