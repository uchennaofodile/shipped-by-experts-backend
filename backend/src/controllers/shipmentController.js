import { Shipment } from '../models/Shipment.js';
import { Vehicle } from '../models/Vehicle.js';
import { calculatePrice } from '../services/pricingService.js';

// Helper: calculate dummy distance for MVP
const getDistance = (pickup, dropoff) => {
  // In real app, use Google Maps API or similar
  return Math.floor(Math.random() * 1000) + 100; // 100-1100 miles
};

export const bookShipment = async (req, res, next) => {
  try {
    const { vehicleId, pickupLocation, dropoffLocation, scheduledPickup } = req.body;
    const customerId = req.user.id;
    // Optionally, check vehicle ownership
    const vehicle = await Vehicle.findOne({ where: { id: vehicleId, ownerId: customerId } });
    if (!vehicle) {
      const err = new Error('Vehicle not found or not owned by user');
      err.status = 404;
      err.isPublic = true;
      return next(err);
    }
    // Calculate price
    const distance = getDistance(pickupLocation, dropoffLocation);
    const price = calculatePrice({
      distance,
      vehicleSize: vehicle.size || 'standard',
      truckCapacityUtilization: 0.5, // For MVP, static value
    });
    const shipment = await Shipment.create({
      customerId,
      vehicleId,
      pickupLocation,
      dropoffLocation,
      scheduledPickup,
      status: 'pending',
      price,
    });
    res.status(201).json(shipment);
  } catch (err) {
    err.status = 500;
    err.isPublic = false;
    next(err);
  }
};

export const listShipments = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const shipments = await Shipment.findAll({ where: { customerId: userId } });
    res.json(shipments);
  } catch (err) {
    err.status = 500;
    err.isPublic = false;
    next(err);
  }
};

export const getShipment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const shipment = await Shipment.findOne({ where: { id, customerId: userId } });
    if (!shipment) {
      const err = new Error('Shipment not found');
      err.status = 404;
      err.isPublic = true;
      return next(err);
    }
    res.json(shipment);
  } catch (err) {
    err.status = 500;
    err.isPublic = false;
    next(err);
  }
};
