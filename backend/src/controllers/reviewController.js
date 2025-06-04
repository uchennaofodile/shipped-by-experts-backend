import { Review } from '../models/Review.js';
import { Shipment } from '../models/Shipment.js';
import { User } from '../models/User.js';

// Submit a review (only after delivery, only if user was involved in shipment)
export const submitReview = async (req, res) => {
  try {
    const { shipmentId, revieweeId, rating, comment } = req.body;
    const reviewerId = req.user.id;
    // Check shipment exists and is delivered
    const shipment = await Shipment.findByPk(shipmentId);
    if (!shipment || shipment.status !== 'delivered') {
      return res.status(400).json({ error: 'Shipment not delivered or not found' });
    }
    // Check reviewer and reviewee were involved
    if (![shipment.customerId, shipment.truckerId].includes(reviewerId) ||
        ![shipment.customerId, shipment.truckerId].includes(revieweeId) ||
        reviewerId === revieweeId) {
      return res.status(403).json({ error: 'Not authorized to review this user for this shipment' });
    }
    // Prevent duplicate reviews for same shipment/user pair
    const existing = await Review.findOne({ where: { shipmentId, reviewerId, revieweeId } });
    if (existing) return res.status(400).json({ error: 'Review already submitted' });
    const review = await Review.create({ shipmentId, reviewerId, revieweeId, rating, comment });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit review' });
  }
};

// Fetch reviews for a user (e.g., trucker profile)
export const getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;
    const reviews = await Review.findAll({ where: { revieweeId: userId } });
    // Calculate average rating
    const avgRating = reviews.length
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2)
      : null;
    res.json({ avgRating, reviews });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};
