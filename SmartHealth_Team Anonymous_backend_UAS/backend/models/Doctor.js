import { DataTypes } from 'sequelize';
import sequelize from '../database/sequelize.js';

const Doctor = sequelize.define('Doctor', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nama_lengkap: { type: DataTypes.STRING(255), allowNull: false },
  sub_spesialisasi: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  nomor_telepon: { type: DataTypes.STRING(50), allowNull: false },
  mulai_praktik: { type: DataTypes.DATEONLY, allowNull: false },
  pengalaman: { type: DataTypes.INTEGER, defaultValue: 0 },
  biaya: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  image_url: { type: DataTypes.STRING(500) },
  rating: { type: DataTypes.DECIMAL(3, 2), defaultValue: 0 },
}, {
  tableName: 'inf_dokter',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

export default Doctor;
