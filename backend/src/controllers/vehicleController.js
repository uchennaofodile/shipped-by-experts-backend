import { Vehicle } from '../models/Vehicle.js';

export const addVehicle = async (req, res) => {
  try {
    const { make, model, year, vin, size } = req.body;
    const ownerId = req.user.id;
    const vehicle = await Vehicle.create({ make, model, year, vin, size, ownerId });
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add vehicle' });
  }
};

export const listVehicles = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const vehicles = await Vehicle.findAll({ where: { ownerId } });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
};

export const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = req.user.id;
    const deleted = await Vehicle.destroy({ where: { id, ownerId } });
    if (!deleted) return res.status(404).json({ error: 'Vehicle not found' });
    res.json({ message: 'Vehicle deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete vehicle' });
  }
};
