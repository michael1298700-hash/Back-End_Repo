import express from 'express';
import HealthRecord from '../models/HealthRecord.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { id_pasien, jenis_rekam, judul, deskripsi, tanggal, file_url } = req.body;
    const record = await HealthRecord.create({
      id_pasien, jenis_rekam, judul, deskripsi, tanggal,
      file_url: file_url || null,
    });
    res.status(201).json({ success: true, record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/patient/:patientId', async (req, res) => {
  try {
    const records = await HealthRecord.findAll({
      where: { id_pasien: req.params.patientId },
      order: [['tanggal', 'DESC']],
    });
    res.json({ success: true, records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/patient/:patientId/type/:jenis', async (req, res) => {
  try {
    const records = await HealthRecord.findAll({
      where: { id_pasien: req.params.patientId, jenis_rekam: req.params.jenis },
      order: [['tanggal', 'DESC']],
    });
    res.json({ success: true, records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { patientId } = req.body;
    const record = await HealthRecord.findOne({
      where: { id: req.params.id, id_pasien: patientId },
    });
    if (!record) return res.status(404).json({ success: false, message: 'Rekam medis tidak ditemukan' });
    await record.destroy();
    res.json({ success: true, message: 'Rekam medis dihapus' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
