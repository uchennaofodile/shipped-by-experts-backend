import { Shipment } from '../models/Shipment.js';

export const updateShipmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const shipment = await Shipment.findByPk(id);
    if (!shipment) return res.status(404).json({ error: 'Shipment not found' });
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
