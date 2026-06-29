import express from 'express';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import User from '../models/User.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { id_dokter, id_pasien, id_jadwal, waktu_janji, gejala, catatan } = req.body;
    const appointment = await Appointment.create({
      id_dokter, id_pasien,
      id_jadwal: id_jadwal || null,
      waktu_janji,
      gejala: gejala || '',
      catatan: catatan || '',
      status: 'Terjadwal',
    });
    const result = await Appointment.findByPk(appointment.id, {
      include: [{ model: Doctor, as: 'doctor', attributes: ['nama_lengkap', 'sub_spesialisasi', 'biaya', 'image_url'] }],
    });
    res.status(201).json({ success: true, appointment: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/patient/:patientId', async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: { id_pasien: req.params.patientId },
      include: [{ model: Doctor, as: 'doctor', attributes: ['nama_lengkap', 'sub_spesialisasi', 'biaya', 'image_url'] }],
      order: [['waktu_janji', 'DESC']],
    });
    res.json({ success: true, appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/upcoming/:patientId', async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: {
        id_pasien: req.params.patientId,
        waktu_janji: { [Op.gt]: new Date() },
        status: 'Terjadwal',
      },
      include: [{ model: Doctor, as: 'doctor', attributes: ['nama_lengkap', 'sub_spesialisasi'] }],
      order: [['waktu_janji', 'ASC']],
    });
    res.json({ success: true, appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/all', async (req, res) => {
  try {
    const where = {};
    if (req.query.status) where.status = req.query.status;
    if (req.query.date) {
      const start = new Date(req.query.date + 'T00:00:00.000Z');
      const end   = new Date(req.query.date + 'T23:59:59.999Z');
      where.waktu_janji = { [Op.between]: [start, end] };
    }
    const appointments = await Appointment.findAll({
      where,
      include: [
        { model: Doctor, as: 'doctor', attributes: ['nama_lengkap', 'sub_spesialisasi'] },
        { model: User,   as: 'patient', attributes: ['nama_lengkap', 'nomor_telepon', 'email'] },
      ],
      order: [['waktu_janji', 'ASC']],
    });
    res.json({ success: true, appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.toISOString().split('T')[0] + 'T00:00:00.000Z');
    const endOfDay   = new Date(today.toISOString().split('T')[0] + 'T23:59:59.999Z');

    const [total, todayCount, terjadwal, selesai] = await Promise.all([
      Appointment.count(),
      Appointment.count({ where: { waktu_janji: { [Op.between]: [startOfDay, endOfDay] } } }),
      Appointment.count({ where: { status: 'Terjadwal' } }),
      Appointment.count({ where: { status: 'Selesai' } }),
    ]);

    res.json({ success: true, stats: { total, today: todayCount, terjadwal, selesai } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['Terjadwal', 'Selesai', 'Dibatalkan', 'Tidak Hadir'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Status tidak valid' });
    }
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) return res.status(404).json({ success: false, message: 'Janji temu tidak ditemukan' });
    await appointment.update({ status });
    res.json({ success: true, message: `Status diperbarui menjadi ${status}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { patientId } = req.body;
    const appointment = await Appointment.findOne({ where: { id: req.params.id, id_pasien: patientId } });
    if (!appointment) return res.status(404).json({ success: false, message: 'Janji temu tidak ditemukan' });
    await appointment.update({ status: 'Dibatalkan' });
    res.json({ success: true, message: 'Janji temu dibatalkan' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
