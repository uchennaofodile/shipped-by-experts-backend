import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

export class Notification extends Model {}

Notification.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: { type: DataTypes.UUID, allowNull: false },
  message: { type: DataTypes.STRING, allowNull: false },
  read: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  sequelize,
  modelName: 'Notification',
});
