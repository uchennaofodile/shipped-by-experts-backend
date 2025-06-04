import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

export class Payment extends Model {}

Payment.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: { type: DataTypes.UUID, allowNull: false }, // FK to User
  shipmentId: { type: DataTypes.UUID, allowNull: false }, // FK to Shipment
  amount: { type: DataTypes.FLOAT, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'pending' },
  stripePaymentId: { type: DataTypes.STRING },
}, {
  sequelize,
  modelName: 'Payment',
});
