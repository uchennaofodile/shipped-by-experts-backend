import express from 'express';
import { submitReview, getUserReviews } from '../controllers/reviewController.js';
import { authenticate } from '../middleware/auth.js';
const router = express.Router();

router.post('/', authenticate, submitReview);
router.get('/:userId', getUserReviews);

export default router;
