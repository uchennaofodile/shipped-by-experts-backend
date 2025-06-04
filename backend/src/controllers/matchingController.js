import { Shipment } from '../models/Shipment.js';
import { matchShipmentToTruckers } from '../services/matchingService.js';

export const matchShipments = async (req, res) => {
  try {
    const { shipmentId } = req.body;
    const shipment = await Shipment.findByPk(shipmentId);
    if (!shipment) return res.status(404).json({ error: 'Shipment not found' });
    const matches = await matchShipmentToTruckers(shipment);
    res.json({ matches });
  } catch (err) {
    res.status(500).json({ error: 'Failed to match shipment' });
  }
};
