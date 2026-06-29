import { DataTypes } from 'sequelize';
import sequelize from '../database/sequelize.js';

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nama_lengkap: { type: DataTypes.STRING(255), allowNull: false },
  nik: { type: DataTypes.CHAR(16), allowNull: false, unique: true },
  email: { type: DataTypes.STRING(150), unique: true },
  password: { type: DataTypes.STRING(255) },
  jenis_kelamin: { type: DataTypes.STRING(20), allowNull: false },
  tanggal_lahir: { type: DataTypes.DATEONLY, allowNull: false },
  alamat: { type: DataTypes.TEXT },
  nomor_telepon: { type: DataTypes.STRING(20) },
  role: { type: DataTypes.STRING(20), defaultValue: 'patient' },
}, {
  tableName: 'inf_pasien',
  timestamps: true,
  createdAt: 'dibuat_pada',
  updatedAt: false,
});

export default User;
