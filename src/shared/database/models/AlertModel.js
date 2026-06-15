import { DataTypes } from 'sequelize';
import sequelize from '../connection.js';

const AlertModel = sequelize.define(
  'Alert',
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    patient_id: { type: DataTypes.UUID, allowNull: true },
    created_by: { type: DataTypes.UUID, allowNull: true },
    status: { type: DataTypes.ENUM('active', 'resolved'), defaultValue: 'active' },
    last_seen_location: { type: DataTypes.TEXT, allowNull: true },
    resolved_at: { type: DataTypes.DATE, allowNull: true },
  },
  { tableName: 'alerts', timestamps: true, createdAt: 'created_at', updatedAt: false }
);

export default AlertModel;
