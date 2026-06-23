import { DataTypes } from 'sequelize';
import sequelize from '../connection.js';

const SightingModel = sequelize.define(
  'Sighting',
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    alert_id: { type: DataTypes.UUID, allowNull: true },
    reported_by: { type: DataTypes.UUID, allowNull: true },
    location_text: { type: DataTypes.TEXT, allowNull: false },
    notes: { type: DataTypes.TEXT, allowNull: true },
    image_urls: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },
  },
  { tableName: 'sightings', timestamps: true, createdAt: 'created_at', updatedAt: false }
);

export default SightingModel;
