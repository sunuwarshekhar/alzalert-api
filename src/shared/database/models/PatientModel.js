import { DataTypes } from 'sequelize';
import sequelize from '../connection.js';

const PatientModel = sequelize.define(
  'Patient',
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    date_of_birth: { type: DataTypes.DATEONLY, allowNull: true },
    photo_url: { type: DataTypes.TEXT, allowNull: true },
    medical_notes: { type: DataTypes.TEXT, allowNull: true },
    caregiver_id: { type: DataTypes.UUID, allowNull: false },
  },
  { tableName: 'patients', timestamps: true, createdAt: 'created_at', updatedAt: false }
);

export default PatientModel;
