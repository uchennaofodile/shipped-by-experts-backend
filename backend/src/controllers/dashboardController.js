import { Shipment } from '../models/Shipment.js';
import { User } from '../models/User.js';

export const customerDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const active = await Shipment.count({ where: { customerId: userId, status: ['pending', 'accepted', 'in_transit'] } });
    const completed = await Shipment.count({ where: { customerId: userId, status: 'delivered' } });
    res.json({ activeShipments: active, completedShipments: completed });
  } catch (err) {
    err.status = 500;
    err.isPublic = false;
    next(err);
  }
};

export const truckerDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const assigned = await Shipment.count({ where: { truckerId: userId, status: ['accepted', 'in_transit'] } });
    const delivered = await Shipment.count({ where: { truckerId: userId, status: 'delivered' } });
    res.json({ assignedShipments: assigned, deliveredShipments: delivered });
  } catch (err) {
    err.status = 500;
    err.isPublic = false;
    next(err);
  }
};

export const dealershipDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const active = await Shipment.count({ where: { customerId: userId, status: ['pending', 'accepted', 'in_transit'] } });
    const completed = await Shipment.count({ where: { customerId: userId, status: 'delivered' } });
    res.json({ activeShipments: active, completedShipments: completed });
  } catch (err) {
    err.status = 500;
    err.isPublic = false;
    next(err);
  }
};

export const adminDashboard = async (req, res, next) => {
  try {
    const users = await User.count();
    const shipments = await Shipment.count();
    res.json({ totalUsers: users, totalShipments: shipments });
  } catch (err) {
    err.status = 500;
    err.isPublic = false;
    next(err);
  }
};
