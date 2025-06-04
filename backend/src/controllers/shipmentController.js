import { Shipment } from '../models/Shipment.js';
import { Vehicle } from '../models/Vehicle.js';

export const bookShipment = async (req, res) => {
  try {
    const { vehicleId, pickupLocation, dropoffLocation, scheduledPickup } = req.body;
    const customerId = req.user.id;
    // Optionally, check vehicle ownership
    const vehicle = await Vehicle.findOne({ where: { id: vehicleId, ownerId: customerId } });
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found or not owned by user' });
    const shipment = await Shipment.create({
      customerId,
      vehicleId,
      pickupLocation,
      dropoffLocation,
      scheduledPickup,
      status: 'pending',
    });
    res.status(201).json(shipment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to book shipment' });
  }
};

export const listShipments = async (req, res) => {
  try {
    const userId = req.user.id;
    const shipments = await Shipment.findAll({ where: { customerId: userId } });
    res.json(shipments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch shipments' });
  }
};

export const getShipment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const shipment = await Shipment.findOne({ where: { id, customerId: userId } });
    if (!shipment) return res.status(404).json({ error: 'Shipment not found' });
    res.json(shipment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch shipment' });
  }
};
