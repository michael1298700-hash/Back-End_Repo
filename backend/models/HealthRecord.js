import { DataTypes } from 'sequelize';
import sequelize from '../database/sequelize.js';
import User from './User.js';

const HealthRecord = sequelize.define('HealthRecord', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_pasien: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: User, key: 'id' },
  },
  jenis_rekam: { type: DataTypes.STRING(100), allowNull: false },
  judul: { type: DataTypes.STRING(255), allowNull: false },
  deskripsi: { type: DataTypes.TEXT },
  tanggal: { type: DataTypes.DATEONLY, allowNull: false },
  file_url: { type: DataTypes.STRING(500) },
}, {
  tableName: 'inf_health_records',
  timestamps: true,
  createdAt: 'dibuat_pada',
  updatedAt: false,
});

HealthRecord.belongsTo(User, { foreignKey: 'id_pasien', as: 'patient' });
User.hasMany(HealthRecord, { foreignKey: 'id_pasien', as: 'healthRecords', onDelete: 'CASCADE' });

export default HealthRecord;
