import sequelize from './sequelize.js';
import bcrypt from 'bcryptjs';

import Doctor from '../models/Doctor.js';
import JadwalDokter from '../models/JadwalDokter.js';
import User from '../models/User.js';
import Staff from '../models/Staff.js';
import Appointment from '../models/Appointment.js';
import HealthRecord from '../models/HealthRecord.js';

export async function initDatabase() {
  // force: false = jangan drop tabel, alter: true = sesuaikan kolom jika ada perubahan
  await sequelize.sync({ force: false, alter: true });
  console.log('Tables synced via Sequelize');

  await seedData();
}

async function seedData() {
  try {
    const doctorCount = await Doctor.count();
    if (doctorCount === 0) {
      console.log('Seeding doctors...');
      const doctors = await Doctor.bulkCreate([
        { nama_lengkap: 'Dr. Sarah Johnson, Sp.JP',    sub_spesialisasi: 'Kardiologi Umum',        email: 'sarah.johnson@smarthealth.com',   nomor_telepon: '+628123456789', mulai_praktik: '2013-01-01', pengalaman: 12, biaya: 350000, image_url: 'https://randomuser.me/api/portraits/women/1.jpg', rating: 4.8 },
        { nama_lengkap: 'Dr. Michael Chen, Sp.JP(K)',  sub_spesialisasi: 'Kardiologi Intervensi',  email: 'michael.chen@smarthealth.com',    nomor_telepon: '+628123456790', mulai_praktik: '2010-01-01', pengalaman: 15, biaya: 400000, image_url: 'https://randomuser.me/api/portraits/men/2.jpg',   rating: 4.9 },
        { nama_lengkap: 'Dr. Emily Rodriguez, Sp.JP',  sub_spesialisasi: 'Kardiologi Anak',        email: 'emily.rodriguez@smarthealth.com', nomor_telepon: '+628123456791', mulai_praktik: '2017-01-01', pengalaman: 8,  biaya: 300000, image_url: 'https://randomuser.me/api/portraits/women/3.jpg', rating: 4.7 },
        { nama_lengkap: 'Dr. James Wilson, Sp.JP',     sub_spesialisasi: 'Ekokardiografi',         email: 'james.wilson@smarthealth.com',    nomor_telepon: '+628123456792', mulai_praktik: '2015-01-01', pengalaman: 10, biaya: 320000, image_url: 'https://randomuser.me/api/portraits/men/4.jpg',   rating: 4.6 },
        { nama_lengkap: 'Dr. Lisa Wang, Sp.JP(K)',     sub_spesialisasi: 'Elektrofisiologi',       email: 'lisa.wang@smarthealth.com',       nomor_telepon: '+628123456793', mulai_praktik: '2011-01-01', pengalaman: 14, biaya: 380000, image_url: 'https://randomuser.me/api/portraits/women/5.jpg', rating: 4.9 },
        { nama_lengkap: 'Dr. Robert Taylor, Sp.BTKV', sub_spesialisasi: 'Bedah Kardiotoraks',     email: 'robert.taylor@smarthealth.com',   nomor_telepon: '+628123456794', mulai_praktik: '2014-01-01', pengalaman: 11, biaya: 360000, image_url: 'https://randomuser.me/api/portraits/men/6.jpg',   rating: 4.7 },
        { nama_lengkap: 'Dr. Anita Putri, Sp.PD',     sub_spesialisasi: 'Penyakit Dalam Umum',    email: 'anita.putri@smarthealth.com',     nomor_telepon: '+628123456795', mulai_praktik: '2016-01-01', pengalaman: 9,  biaya: 280000, image_url: 'https://randomuser.me/api/portraits/women/7.jpg', rating: 4.6 },
        { nama_lengkap: 'Dr. Budi Hartono, Sp.PD-KGH',sub_spesialisasi: 'Ginjal & Hipertensi',   email: 'budi.hartono@smarthealth.com',    nomor_telepon: '+628123456796', mulai_praktik: '2012-01-01', pengalaman: 13, biaya: 350000, image_url: 'https://randomuser.me/api/portraits/men/8.jpg',   rating: 4.8 },
      ]);

      await JadwalDokter.bulkCreate([
        { id_dokter: doctors[0].id, hari: 'Senin',  jam_buka: '09:00', jam_tutup: '17:00', durasi_slot_menit: 30 },
        { id_dokter: doctors[0].id, hari: 'Rabu',   jam_buka: '09:00', jam_tutup: '17:00', durasi_slot_menit: 30 },
        { id_dokter: doctors[0].id, hari: 'Jumat',  jam_buka: '09:00', jam_tutup: '17:00', durasi_slot_menit: 30 },
        { id_dokter: doctors[1].id, hari: 'Selasa', jam_buka: '10:00', jam_tutup: '18:00', durasi_slot_menit: 45 },
        { id_dokter: doctors[1].id, hari: 'Kamis',  jam_buka: '10:00', jam_tutup: '18:00', durasi_slot_menit: 45 },
        { id_dokter: doctors[2].id, hari: 'Senin',  jam_buka: '08:00', jam_tutup: '16:00', durasi_slot_menit: 30 },
        { id_dokter: doctors[2].id, hari: 'Kamis',  jam_buka: '08:00', jam_tutup: '16:00', durasi_slot_menit: 30 },
        { id_dokter: doctors[3].id, hari: 'Selasa', jam_buka: '09:00', jam_tutup: '17:00', durasi_slot_menit: 30 },
        { id_dokter: doctors[3].id, hari: 'Kamis',  jam_buka: '09:00', jam_tutup: '17:00', durasi_slot_menit: 30 },
        { id_dokter: doctors[4].id, hari: 'Rabu',   jam_buka: '11:00', jam_tutup: '19:00', durasi_slot_menit: 30 },
        { id_dokter: doctors[4].id, hari: 'Kamis',  jam_buka: '11:00', jam_tutup: '19:00', durasi_slot_menit: 30 },
        { id_dokter: doctors[4].id, hari: 'Jumat',  jam_buka: '11:00', jam_tutup: '19:00', durasi_slot_menit: 30 },
        { id_dokter: doctors[5].id, hari: 'Senin',  jam_buka: '09:00', jam_tutup: '17:00', durasi_slot_menit: 60 },
        { id_dokter: doctors[5].id, hari: 'Selasa', jam_buka: '09:00', jam_tutup: '17:00', durasi_slot_menit: 60 },
        { id_dokter: doctors[5].id, hari: 'Rabu',   jam_buka: '09:00', jam_tutup: '17:00', durasi_slot_menit: 60 },
        { id_dokter: doctors[6].id, hari: 'Senin',  jam_buka: '08:00', jam_tutup: '16:00', durasi_slot_menit: 30 },
        { id_dokter: doctors[6].id, hari: 'Rabu',   jam_buka: '08:00', jam_tutup: '16:00', durasi_slot_menit: 30 },
        { id_dokter: doctors[7].id, hari: 'Selasa', jam_buka: '10:00', jam_tutup: '18:00', durasi_slot_menit: 45 },
        { id_dokter: doctors[7].id, hari: 'Jumat',  jam_buka: '10:00', jam_tutup: '18:00', durasi_slot_menit: 45 },
      ]);
      console.log('Doctors & schedules seeded');
    }

    const userCount = await User.count();
    if (userCount === 0) {
      console.log('Seeding users...');
      const hashedPassword = await bcrypt.hash('password123', 10);
      await User.bulkCreate([
        {
          nama_lengkap: 'John Doe',
          nik: '1271010101900001',
          email: 'john@example.com',
          password: hashedPassword,
          jenis_kelamin: 'Laki-laki',
          tanggal_lahir: '1990-01-01',
          alamat: 'Jl. Merdeka No.1, Medan',
          nomor_telepon: '628123456780',
          role: 'patient',
        },
        {
          nama_lengkap: 'Sari Dewi',
          nik: '1271010101950002',
          email: 'sari@example.com',
          password: hashedPassword,
          jenis_kelamin: 'Perempuan',
          tanggal_lahir: '1995-05-15',
          alamat: 'Jl. Sudirman No.5, Medan',
          nomor_telepon: '628123456781',
          role: 'patient',
        },
      ]);
      console.log('Users seeded');
    }

    const staffCount = await Staff.count();
    if (staffCount === 0) {
      console.log('Seeding staff...');
      const hashedStaff = await bcrypt.hash('staff123', 10);
      await Staff.bulkCreate([
        {
          nama_lengkap: 'Admin Rumah Sakit',
          email: 'admin@smarthealth.com',
          password: hashedStaff,
          jabatan: 'Administrator',
          nomor_telepon: '628111000001',
          role: 'admin',
          is_active: true,
        },
        {
          nama_lengkap: 'Siti Rahayu',
          email: 'resepsionis@smarthealth.com',
          password: hashedStaff,
          jabatan: 'Resepsionis',
          nomor_telepon: '628111000002',
          role: 'staff',
          is_active: true,
        },
        {
          nama_lengkap: 'Budi Santoso',
          email: 'kasir@smarthealth.com',
          password: hashedStaff,
          jabatan: 'Kasir',
          nomor_telepon: '628111000003',
          role: 'staff',
          is_active: true,
        },
      ]);
      console.log('Staff seeded');
    }

    console.log('✅ Seed selesai');
  } catch (err) {
    console.error('❌ Seed error:', err.message);
  }
}
