// Basic dynamic pricing: price = base + (distance * rate) - discount for filled capacity
export const calculatePrice = ({ distance, vehicleSize, truckCapacityUtilization }) => {
  const base = 100; // base price in USD
  const ratePerMile = 1.5;
  const sizeMultiplier = vehicleSize === 'large' ? 1.5 : 1;
  const utilizationDiscount = truckCapacityUtilization > 0.7 ? 0.85 : 1; // 15% off if >70% full
  // For MVP, distance is required
  const price = (base + distance * ratePerMile) * sizeMultiplier * utilizationDiscount;
  return Math.round(price * 100) / 100;
};
