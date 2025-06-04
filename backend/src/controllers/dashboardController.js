import { Shipment } from '../models/Shipment.js';
import { User } from '../models/User.js';

export const customerDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const active = await Shipment.count({ where: { customerId: userId, status: ['pending', 'accepted', 'in_transit'] } });
    const completed = await Shipment.count({ where: { customerId: userId, status: 'delivered' } });
    res.json({ activeShipments: active, completedShipments: completed });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dashboard' });
  }
};

export const truckerDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const assigned = await Shipment.count({ where: { truckerId: userId, status: ['accepted', 'in_transit'] } });
    const delivered = await Shipment.count({ where: { truckerId: userId, status: 'delivered' } });
    res.json({ assignedShipments: assigned, deliveredShipments: delivered });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dashboard' });
  }
};

export const dealershipDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const active = await Shipment.count({ where: { customerId: userId, status: ['pending', 'accepted', 'in_transit'] } });
    const completed = await Shipment.count({ where: { customerId: userId, status: 'delivered' } });
    res.json({ activeShipments: active, completedShipments: completed });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dashboard' });
  }
};

export const adminDashboard = async (req, res) => {
  try {
    const users = await User.count();
    const shipments = await Shipment.count();
    res.json({ totalUsers: users, totalShipments: shipments });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dashboard' });
  }
};
