import { Vehicle } from '../models/Vehicle.js';
import csv from 'csv-parser';
import fs from 'fs';

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

// Bulk upload (CSV) for dealerships
export const bulkUploadVehicles = async (req, res) => {
  // For MVP: accept a CSV file path in req.body.csvPath
  try {
    const { csvPath } = req.body;
    const ownerId = req.user.id;
    const vehicles = [];
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => {
        vehicles.push({ ...row, ownerId });
      })
      .on('end', async () => {
        await Vehicle.bulkCreate(vehicles);
        res.json({ message: 'Bulk upload complete', count: vehicles.length });
      });
  } catch (err) {
    res.status(500).json({ error: 'Bulk upload failed' });
  }
};
