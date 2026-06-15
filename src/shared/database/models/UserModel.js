import { DataTypes } from 'sequelize';
import sequelize from '../connection.js';

const UserModel = sequelize.define(
  'User',
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
    password_hash: { type: DataTypes.TEXT, allowNull: false },
    phone: { type: DataTypes.STRING(20), allowNull: true },
    role: { type: DataTypes.ENUM('caregiver', 'community', 'admin'), allowNull: false },
  },
  { tableName: 'users', timestamps: true, createdAt: 'created_at', updatedAt: false }
);

export default UserModel;
