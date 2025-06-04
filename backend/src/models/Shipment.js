import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

export class Shipment extends Model {}

Shipment.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  customerId: { type: DataTypes.UUID, allowNull: false }, // FK to User
  truckerId: { type: DataTypes.UUID }, // FK to User
  vehicleId: { type: DataTypes.UUID, allowNull: false }, // FK to Vehicle
  pickupLocation: { type: DataTypes.STRING, allowNull: false },
  dropoffLocation: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'pending' },
  price: { type: DataTypes.FLOAT },
  scheduledPickup: { type: DataTypes.DATE },
  scheduledDropoff: { type: DataTypes.DATE },
}, {
  sequelize,
  modelName: 'Shipment',
});
