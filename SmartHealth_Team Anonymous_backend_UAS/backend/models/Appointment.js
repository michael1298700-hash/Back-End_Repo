import { DataTypes } from 'sequelize';
import sequelize from '../database/sequelize.js';
import Doctor from './Doctor.js';
import User from './User.js';
import JadwalDokter from './JadwalDokter.js';

const Appointment = sequelize.define('Appointment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_dokter: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Doctor, key: 'id' },
  },
  id_pasien: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: User, key: 'id' },
  },
  id_jadwal: {
    type: DataTypes.INTEGER,
    references: { model: JadwalDokter, key: 'id' },
  },
  waktu_janji: { type: DataTypes.DATE, allowNull: false },
  status: { type: DataTypes.STRING(20), defaultValue: 'Terjadwal' },
  gejala: { type: DataTypes.TEXT },
  catatan: { type: DataTypes.TEXT },
}, {
  tableName: 'inf_janji_temu',
  timestamps: true,
  createdAt: 'dibuat_pada',
  updatedAt: false,
});

Appointment.belongsTo(Doctor, { foreignKey: 'id_dokter', as: 'doctor' });
Appointment.belongsTo(User, { foreignKey: 'id_pasien', as: 'patient' });
Appointment.belongsTo(JadwalDokter, { foreignKey: 'id_jadwal', as: 'jadwal' });

export default Appointment;
