import { DataTypes } from 'sequelize';
import sequelize from '../database/sequelize.js';
import Doctor from './Doctor.js';

const JadwalDokter = sequelize.define('JadwalDokter', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_dokter: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Doctor, key: 'id' },
  },
  hari: { type: DataTypes.STRING(10), allowNull: false },
  jam_buka: { type: DataTypes.STRING(5), allowNull: false },
  jam_tutup: { type: DataTypes.STRING(5), allowNull: false },
  durasi_slot_menit: { type: DataTypes.INTEGER, defaultValue: 30 },
}, {
  tableName: 'inf_jadwal_dokter',
  timestamps: false,
});

Doctor.hasMany(JadwalDokter, { foreignKey: 'id_dokter', as: 'schedules', onDelete: 'CASCADE' });
JadwalDokter.belongsTo(Doctor, { foreignKey: 'id_dokter', as: 'doctor' });

export default JadwalDokter;
