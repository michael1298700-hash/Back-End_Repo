import express from 'express';
import { Op } from 'sequelize';
import Doctor from '../models/Doctor.js';
import JadwalDokter from '../models/JadwalDokter.js';
import Appointment from '../models/Appointment.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const where = {};
    if (req.query.sub_spesialisasi) {
      where.sub_spesialisasi = req.query.sub_spesialisasi;
    }
    const doctors = await Doctor.findAll({ where, order: [['nama_lengkap', 'ASC']] });
    res.json({ success: true, doctors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/specializations', async (req, res) => {
  try {
    const rows = await Doctor.findAll({
      attributes: ['sub_spesialisasi'],
      group: ['sub_spesialisasi'],
      order: [['sub_spesialisasi', 'ASC']],
    });
    const specializations = rows.map(r => r.sub_spesialisasi);
    res.json({ success: true, specializations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

    const schedules = await JadwalDokter.findAll({
      where: { id_dokter: req.params.id },
      order: [['id', 'ASC']],
    });

    const urutanHari = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
    schedules.sort((a, b) => urutanHari.indexOf(a.hari) - urutanHari.indexOf(b.hari));

    res.json({ success: true, doctor, schedules });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:id/schedules', async (req, res) => {
  try {
    const urutanHari = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
    const schedules = await JadwalDokter.findAll({
      where: { id_dokter: req.params.id },
      order: [['id', 'ASC']],
    });
    schedules.sort((a, b) => urutanHari.indexOf(a.hari) - urutanHari.indexOf(b.hari));
    res.json({ success: true, schedules });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:id/available-slots', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ success: false, message: 'Parameter date wajib diisi' });

    const namaHari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const targetDate = new Date(date);
    const hariIni = namaHari[targetDate.getDay()];

    const jadwal = await JadwalDokter.findOne({
      where: { id_dokter: req.params.id, hari: hariIni },
    });

    if (!jadwal) {
      return res.json({ success: true, slots: [], pesan: `Dokter tidak praktik pada hari ${hariIni}` });
    }

    const startOfDay = new Date(date + 'T00:00:00.000Z');
    const endOfDay   = new Date(date + 'T23:59:59.999Z');

    const bookedAppointments = await Appointment.findAll({
      where: {
        id_dokter: req.params.id,
        waktu_janji: { [Op.between]: [startOfDay, endOfDay] },
        status: { [Op.ne]: 'Dibatalkan' },
      },
      attributes: ['waktu_janji'],
    });

    const bookedSet = new Set(
      bookedAppointments.map(a => {
        const d = new Date(a.waktu_janji);
        return d.getUTCHours() + ':' + d.getUTCMinutes().toString().padStart(2, '0');
      })
    );

    const slots = [];
    const [openH, openM] = jadwal.jam_buka.split(':').map(Number);
    const [closeH, closeM] = jadwal.jam_tutup.split(':').map(Number);

    let current = new Date(date + 'T00:00:00.000Z');
    current.setUTCHours(openH, openM, 0, 0);
    const end = new Date(date + 'T00:00:00.000Z');
    end.setUTCHours(closeH, closeM, 0, 0);

    while (current < end) {
      const timeStr = current.getUTCHours() + ':' + current.getUTCMinutes().toString().padStart(2, '0');
      if (!bookedSet.has(timeStr)) {
        slots.push({
          waktu: current.toISOString(),
          waktu_display: current.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'UTC',
          }),
        });
      }
      current = new Date(current.getTime() + jadwal.durasi_slot_menit * 60 * 1000);
    }

    res.json({
      success: true,
      slots,
      jadwal: {
        hari: jadwal.hari,
        jam_buka: jadwal.jam_buka,
        jam_tutup: jadwal.jam_tutup,
        durasi_slot_menit: jadwal.durasi_slot_menit,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
