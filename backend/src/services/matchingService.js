import { Shipment } from '../models/Shipment.js';
import { User } from '../models/User.js';

// Basic AI matching: find available truckers for a shipment based on route and capacity
export const matchShipmentToTruckers = async (shipment) => {
  // For MVP: match truckers with same pickup/dropoff city and available status
  const truckers = await User.findAll({
    where: { role: 'trucker', /* add more filters as needed */ },
    // In a real system, join with TruckerProfile, check capacity, route, etc.
  });
  // Filter truckers by proximity (simple string match for MVP)
  const matches = truckers.filter(trucker => {
    // Placeholder: assume trucker has a profile with preferred routes
    // For now, match all truckers
    return true;
  });
  return matches;
};
