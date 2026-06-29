import express from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Staff from '../models/Staff.js';

const router = express.Router();
const SECRET = process.env.JWT_SECRET || 'smarthealth-secret-key-2024';

router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('nama_lengkap').notEmpty().trim(),
  body('nik').isLength({ min: 16, max: 16 }).isNumeric(),
  body('nomor_telepon').isLength({ min: 10, max: 13 }).isNumeric(),
  body('jenis_kelamin').notEmpty(),
  body('tanggal_lahir').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  try {
    const existing = await User.findOne({ where: { email: req.body.email } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email sudah terdaftar' });
    }
    const hashed = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({ ...req.body, password: hashed, role: 'patient' });
    const token = jwt.sign({ id: user.id, email: user.email, role: 'patient', tipe: 'patient' }, SECRET, { expiresIn: '7d' });
    const { password, ...userData } = user.toJSON();
    res.status(201).json({ success: true, user: { ...userData, tipe: 'patient' }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Email atau password salah' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ success: false, message: 'Email atau password salah' });
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, tipe: 'patient' }, SECRET, { expiresIn: '7d' });
    const { password: _, ...userData } = user.toJSON();
    res.json({ success: true, user: { ...userData, tipe: 'patient' }, token });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/staff/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const staff = await Staff.findOne({ where: { email } });
    if (!staff) {
      return res.status(401).json({ success: false, message: 'Email atau password salah' });
    }
    if (!staff.is_active) {
      return res.status(403).json({ success: false, message: 'Akun staff tidak aktif' });
    }
    const valid = await bcrypt.compare(password, staff.password);
    if (!valid) {
      return res.status(401).json({ success: false, message: 'Email atau password salah' });
    }
    const token = jwt.sign({ id: staff.id, email: staff.email, role: staff.role, tipe: 'staff' }, SECRET, { expiresIn: '7d' });
    const { password: _, ...staffData } = staff.toJSON();
    res.json({ success: true, user: { ...staffData, tipe: 'staff' }, token });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
    });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

router.get('/patients', async (req, res) => {
  try {
    const patients = await User.findAll({
      where: { role: 'patient' },
      attributes: { exclude: ['password'] },
      order: [['nama_lengkap', 'ASC']],
    });
    res.json({ success: true, patients });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/patients/stats', async (req, res) => {
  try {
    const total = await User.count({ where: { role: 'patient' } });
    res.json({ success: true, stats: { total } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
