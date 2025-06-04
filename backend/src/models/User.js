import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

export class User extends Model {}

User.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  firstName: { type: DataTypes.STRING, allowNull: true },
  lastName: { type: DataTypes.STRING, allowNull: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('customer', 'trucker', 'dealership', 'admin'), allowNull: false },
  googleId: { type: DataTypes.STRING, allowNull: true, unique: true },
  facebookId: { type: DataTypes.STRING, allowNull: true, unique: true },
  // Add more fields as needed
}, {
  sequelize,
  modelName: 'User',
});
