# SmartHealth Backend v2.0
**Tim Anonymous — Universitas Mikroskil**  
Laurencio Luckson (241110805) · Ervian Mentari · Shawn Michael · Jonathan Felix Fubrianto

---

## Stack
- **Runtime**: Node.js (ESM)
- **Framework**: Express.js
- **ORM**: Sequelize + SQLite
- **Auth**: JWT (jsonwebtoken + bcryptjs)
- **Validasi**: express-validator
- **Docs**: Swagger UI (`/api-docs`)

---

## Menjalankan Lokal

```bash
cd backend
npm install
cp .env.example .env   # isi JWT_SECRET
npm run dev            # atau: npm start
```

Server: `http://localhost:5000`  
Swagger: `http://localhost:5000/api-docs`

---

## Struktur

```
backend/
├── server.js              ← Entry point + routing layer + middleware setup
├── .env                   ← Konfigurasi environment
├── package.json
├── database/
│   ├── sequelize.js       ← Koneksi Sequelize/SQLite
│   └── database.js        ← Init tabel + seed data
├── models/                ← Model Sequelize (TIDAK DIUBAH)
│   ├── User.js
│   ├── Staff.js
│   ├── Doctor.js
│   ├── Appointment.js
│   ├── HealthRecord.js
│   └── JadwalDokter.js
├── routes/                ← Handler route (TIDAK DIUBAH)
│   ├── users.js
│   ├── doctors.js
│   ├── appointments.js
│   └── healthRecords.js
├── middleware/            ← ★ BARU
│   ├── auth.js            ← authenticate, authorize, ownDataOnly
│   ├── logger.js          ← requestLogger
│   └── errorHandler.js    ← errorHandler, notFoundHandler
└── docs/
    └── swagger.js         ← Definisi OpenAPI 3.0
```

---

## Autentikasi & Otorisasi

### Login
```
POST /api/users/login         → pasien
POST /api/users/staff/login   → staff/admin
```
Response mengandung `token` JWT.

### Gunakan token
```
Authorization: Bearer <token>
```

### Role
| tipe      | Akses |
|-----------|-------|
| `patient` | Data milik sendiri (appointments, health-records, profil) |
| `staff`   | Semua data, update status, statistik |

---

## Endpoint Utama

| Method | Path | Auth | Deskripsi |
|--------|------|------|-----------|
| POST | `/api/users/register` | — | Daftar pasien |
| POST | `/api/users/login` | — | Login pasien |
| POST | `/api/users/staff/login` | — | Login staff |
| GET | `/api/users/profile/:id` | ✅ | Profil pasien |
| GET | `/api/users/patients` | ✅ staff | List pasien |
| GET | `/api/doctors` | — | List dokter |
| GET | `/api/doctors/:id` | — | Detail dokter |
| GET | `/api/doctors/:id/available-slots?date=` | — | Slot tersedia |
| POST | `/api/appointments` | ✅ | Buat janji |
| GET | `/api/appointments/patient/:id` | ✅ | Riwayat pasien |
| GET | `/api/appointments/all` | ✅ staff | Semua janji |
| PATCH | `/api/appointments/:id/status` | ✅ staff | Update status |
| DELETE | `/api/appointments/:id` | ✅ | Batalkan janji |
| POST | `/api/health-records` | ✅ | Tambah rekam medis |
| GET | `/api/health-records/patient/:id` | ✅ | Rekam medis pasien |
| DELETE | `/api/health-records/:id` | ✅ | Hapus rekam medis |

Dokumentasi lengkap: **`/api-docs`**

---

## Deploy ke Railway

1. Push ke GitHub
2. Buat project baru di [railway.app](https://railway.app)
3. Tambahkan variabel environment:
   - `PORT=5000`
   - `JWT_SECRET=<ganti-dengan-secret-kuat>`
   - `ALLOWED_ORIGINS=https://your-frontend.vercel.app`
   - `NODE_ENV=production`
4. Railway otomatis menjalankan `npm start`

## Deploy ke Render

1. New Web Service → connect repo
2. Build command: `npm install`
3. Start command: `npm start`
4. Tambahkan env vars seperti di atas

---

## Akun Default (Seed)

| Tipe | Email | Password |
|------|-------|----------|
| Pasien | john@example.com | password123 |
| Staff | admin@smarthealth.com | admin123 |
