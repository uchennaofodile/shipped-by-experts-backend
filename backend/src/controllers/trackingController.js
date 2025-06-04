import { Shipment } from '../models/Shipment.js';

// Define allowed status transitions and which roles can perform them
const statusTransitions = {
  pending: { accepted: ['trucker', 'admin'] },
  accepted: { in_transit: ['trucker', 'admin'] },
  in_transit: { delivered: ['trucker', 'admin'] },
  delivered: {}, // Terminal state
};

export const updateShipmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const shipment = await Shipment.findByPk(id);
    if (!shipment) return res.status(404).json({ error: 'Shipment not found' });
    const currentStatus = shipment.status;
    // Check if transition is valid
    if (!statusTransitions[currentStatus] || !statusTransitions[currentStatus][status]) {
      return res.status(400).json({ error: `Invalid status transition from ${currentStatus} to ${status}` });
    }
    // Check if user role is allowed
    const allowedRoles = statusTransitions[currentStatus][status];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: `Role ${req.user.role} not allowed to change status from ${currentStatus} to ${status}` });
    }
    shipment.status = status;
    await shipment.save();
    res.json({ message: 'Shipment status updated', shipment });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update shipment status' });
  }
};

export const getShipmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const shipment = await Shipment.findByPk(id);
    if (!shipment) return res.status(404).json({ error: 'Shipment not found' });
    res.json({ status: shipment.status, shipment });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch shipment status' });
  }
};
