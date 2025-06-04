import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

export class Review extends Model {}

Review.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  shipmentId: { type: DataTypes.UUID, allowNull: false },
  reviewerId: { type: DataTypes.UUID, allowNull: false },
  revieweeId: { type: DataTypes.UUID, allowNull: false },
  rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
  comment: { type: DataTypes.STRING },
}, {
  sequelize,
  modelName: 'Review',
});
