import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'smarthealth-secret-key-2024';

/**
 * Verifikasi JWT token dari header Authorization.
 * Menyimpan payload ke req.user.
 */
export function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Token tidak ditemukan' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, SECRET);
    req.user = payload; // { id, email, role, tipe }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token sudah kadaluarsa' });
    }
    return res.status(401).json({ success: false, message: 'Token tidak valid' });
  }
}

/**
 * Otorisasi berdasarkan tipe: 'patient' | 'staff' | keduanya.
 * Gunakan setelah authenticate().
 * Contoh: authorize('staff') atau authorize('patient', 'staff')
 */
export function authorize(...allowedTypes) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Tidak terautentikasi' });
    }
    if (!allowedTypes.includes(req.user.tipe)) {
      return res.status(403).json({
        success: false,
        message: `Akses ditolak. Hanya untuk: ${allowedTypes.join(', ')}`,
      });
    }
    next();
  };
}

/**
 * Pastikan pasien hanya bisa akses datanya sendiri.
 * Bandingkan req.user.id dengan param/body patientId.
 */
export function ownDataOnly(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Tidak terautentikasi' });
  }
  // Staff boleh akses semua
  if (req.user.tipe === 'staff') return next();

  const targetId = parseInt(req.params.patientId || req.params.id || req.body.patientId);
  if (req.user.id !== targetId) {
    return res.status(403).json({ success: false, message: 'Akses ditolak: bukan data Anda' });
  }
  next();
}
