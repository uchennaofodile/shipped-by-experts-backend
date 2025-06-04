import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

export class Vehicle extends Model {}

Vehicle.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  make: { type: DataTypes.STRING, allowNull: false },
  model: { type: DataTypes.STRING, allowNull: false },
  year: { type: DataTypes.INTEGER, allowNull: false },
  vin: { type: DataTypes.STRING },
  size: { type: DataTypes.STRING },
  ownerId: { type: DataTypes.UUID, allowNull: false }, // FK to User
}, {
  sequelize,
  modelName: 'Vehicle',
});
