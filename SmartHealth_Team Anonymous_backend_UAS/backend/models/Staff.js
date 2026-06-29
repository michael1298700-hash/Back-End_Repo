import { DataTypes } from 'sequelize';
import sequelize from '../database/sequelize.js';

const Staff = sequelize.define('Staff', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nama_lengkap: { type: DataTypes.STRING(255), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(255), allowNull: false },
  jabatan: { type: DataTypes.STRING(100), allowNull: false },
  nomor_telepon: { type: DataTypes.STRING(20) },
  role: { type: DataTypes.STRING(20), defaultValue: 'staff' },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName: 'inf_staff',
  timestamps: true,
  createdAt: 'dibuat_pada',
  updatedAt: false,
});

export default Staff;
