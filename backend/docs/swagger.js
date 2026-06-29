/**
 * Konfigurasi Swagger / OpenAPI 3.0 untuk SmartHealth API.
 * Digenerate secara manual agar kompatibel dengan ESM tanpa build step.
 */

export const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'SmartHealth API',
    version: '2.0.0',
    description: `
## SmartHealth REST API — Tim Anonymous

Backend Express.js + Sequelize + SQLite untuk sistem manajemen kesehatan.

### Autentikasi
Gunakan endpoint \`POST /api/users/login\` atau \`POST /api/users/staff/login\` untuk mendapatkan token JWT.  
Sertakan token pada header: \`Authorization: Bearer <token>\`

### Role
| Tipe | Deskripsi |
|------|-----------|
| \`patient\` | Pasien terdaftar |
| \`staff\`   | Staff/admin klinik |
    `,
    contact: {
      name: 'Tim Anonymous — Universitas Mikroskil',
    },
  },
  servers: [
    { url: 'http://localhost:5000', description: 'Development' },
    { url: 'https://your-app.railway.app', description: 'Production (ganti URL)' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      // ── User / Pasien ───────────────────────────────────────────────
      UserRegister: {
        type: 'object',
        required: ['nama_lengkap', 'nik', 'email', 'password', 'jenis_kelamin', 'tanggal_lahir', 'nomor_telepon'],
        properties: {
          nama_lengkap: { type: 'string', example: 'Budi Santoso' },
          nik: { type: 'string', minLength: 16, maxLength: 16, example: '1271010101900001' },
          email: { type: 'string', format: 'email', example: 'budi@email.com' },
          password: { type: 'string', minLength: 6, example: 'password123' },
          jenis_kelamin: { type: 'string', enum: ['Laki-laki', 'Perempuan'], example: 'Laki-laki' },
          tanggal_lahir: { type: 'string', format: 'date', example: '1990-01-01' },
          nomor_telepon: { type: 'string', example: '08123456789' },
          alamat: { type: 'string', example: 'Jl. Mawar No. 1, Medan' },
        },
      },
      UserLogin: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'john@example.com' },
          password: { type: 'string', example: 'password123' },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
          user: { $ref: '#/components/schemas/UserProfile' },
        },
      },
      UserProfile: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          nama_lengkap: { type: 'string', example: 'John Doe' },
          email: { type: 'string', example: 'john@example.com' },
          nik: { type: 'string', example: '1271010101900001' },
          jenis_kelamin: { type: 'string', example: 'Laki-laki' },
          tanggal_lahir: { type: 'string', example: '1990-01-01' },
          nomor_telepon: { type: 'string', example: '08123456789' },
          role: { type: 'string', example: 'patient' },
          tipe: { type: 'string', example: 'patient' },
        },
      },
      // ── Doctor ──────────────────────────────────────────────────────
      Doctor: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          nama_lengkap: { type: 'string', example: 'Dr. Sarah Johnson, Sp.JP' },
          sub_spesialisasi: { type: 'string', example: 'Kardiologi Umum' },
          email: { type: 'string', example: 'sarah.johnson@smarthealth.com' },
          nomor_telepon: { type: 'string', example: '+628123456789' },
          pengalaman: { type: 'integer', example: 12 },
          biaya: { type: 'number', example: 350000 },
          rating: { type: 'number', example: 4.8 },
          image_url: { type: 'string', example: 'https://...' },
        },
      },
      // ── Appointment ─────────────────────────────────────────────────
      AppointmentCreate: {
        type: 'object',
        required: ['id_dokter', 'id_pasien', 'waktu_janji'],
        properties: {
          id_dokter: { type: 'integer', example: 1 },
          id_pasien: { type: 'integer', example: 1 },
          id_jadwal: { type: 'integer', example: 1 },
          waktu_janji: { type: 'string', format: 'date-time', example: '2024-06-10T09:00:00.000Z' },
          gejala: { type: 'string', example: 'Sesak napas, nyeri dada' },
          catatan: { type: 'string', example: 'Riwayat hipertensi' },
        },
      },
      AppointmentStatusUpdate: {
        type: 'object',
        required: ['status'],
        properties: {
          status: {
            type: 'string',
            enum: ['Terjadwal', 'Selesai', 'Dibatalkan', 'Tidak Hadir'],
            example: 'Selesai',
          },
        },
      },
      // ── HealthRecord ────────────────────────────────────────────────
      HealthRecordCreate: {
        type: 'object',
        required: ['id_pasien', 'jenis_rekam', 'judul', 'tanggal'],
        properties: {
          id_pasien: { type: 'integer', example: 1 },
          jenis_rekam: { type: 'string', example: 'Lab' },
          judul: { type: 'string', example: 'Hasil Cek Darah Rutin' },
          deskripsi: { type: 'string', example: 'Hemoglobin 13.5 g/dL' },
          tanggal: { type: 'string', format: 'date', example: '2024-06-01' },
          file_url: { type: 'string', example: 'https://...' },
        },
      },
      // ── Generic ─────────────────────────────────────────────────────
      SuccessMessage: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Operasi berhasil' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Terjadi kesalahan' },
        },
      },
    },
  },

  paths: {
    // ════════════════════════════════════════════════════════════════
    // USERS
    // ════════════════════════════════════════════════════════════════
    '/api/users/register': {
      post: {
        tags: ['Auth'],
        summary: 'Registrasi pasien baru',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UserRegister' } } },
        },
        responses: {
          201: { description: 'Registrasi berhasil', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
          400: { description: 'Validasi gagal / email sudah dipakai', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/api/users/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login pasien',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UserLogin' } } },
        },
        responses: {
          200: { description: 'Login berhasil', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
          401: { description: 'Kredensial salah', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/api/users/staff/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login staff/admin',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UserLogin' } } },
        },
        responses: {
          200: { description: 'Login berhasil', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
          401: { description: 'Kredensial salah', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          403: { description: 'Akun tidak aktif', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/api/users/profile/{id}': {
      get: {
        tags: ['Users'],
        summary: 'Ambil profil pasien berdasarkan ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Profil ditemukan', content: { 'application/json': { schema: { properties: { success: { type: 'boolean' }, user: { $ref: '#/components/schemas/UserProfile' } } } } } },
          401: { description: 'Tidak terautentikasi' },
          403: { description: 'Akses ditolak' },
          404: { description: 'User tidak ditemukan' },
        },
      },
    },
    '/api/users/patients': {
      get: {
        tags: ['Users'],
        summary: 'List semua pasien (hanya staff)',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'List pasien' },
          401: { description: 'Tidak terautentikasi' },
          403: { description: 'Bukan staff' },
        },
      },
    },
    '/api/users/patients/stats': {
      get: {
        tags: ['Users'],
        summary: 'Statistik total pasien (hanya staff)',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Statistik pasien' },
          403: { description: 'Bukan staff' },
        },
      },
    },

    // ════════════════════════════════════════════════════════════════
    // DOCTORS
    // ════════════════════════════════════════════════════════════════
    '/api/doctors': {
      get: {
        tags: ['Doctors'],
        summary: 'List semua dokter (publik)',
        parameters: [
          { name: 'sub_spesialisasi', in: 'query', schema: { type: 'string' }, description: 'Filter spesialisasi' },
        ],
        responses: {
          200: { description: 'List dokter', content: { 'application/json': { schema: { properties: { success: { type: 'boolean' }, doctors: { type: 'array', items: { $ref: '#/components/schemas/Doctor' } } } } } } },
        },
      },
    },
    '/api/doctors/specializations': {
      get: {
        tags: ['Doctors'],
        summary: 'List semua spesialisasi (publik)',
        responses: {
          200: { description: 'List spesialisasi' },
        },
      },
    },
    '/api/doctors/{id}': {
      get: {
        tags: ['Doctors'],
        summary: 'Detail dokter + jadwal (publik)',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Detail dokter' },
          404: { description: 'Dokter tidak ditemukan' },
        },
      },
    },
    '/api/doctors/{id}/schedules': {
      get: {
        tags: ['Doctors'],
        summary: 'Jadwal praktek dokter (publik)',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Jadwal dokter' } },
      },
    },
    '/api/doctors/{id}/available-slots': {
      get: {
        tags: ['Doctors'],
        summary: 'Slot waktu tersedia pada tanggal tertentu',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
          { name: 'date', in: 'query', required: true, schema: { type: 'string', format: 'date' }, example: '2024-06-10' },
        ],
        responses: {
          200: { description: 'Slot tersedia' },
          400: { description: 'Parameter date wajib' },
        },
      },
    },

    // ════════════════════════════════════════════════════════════════
    // APPOINTMENTS
    // ════════════════════════════════════════════════════════════════
    '/api/appointments': {
      post: {
        tags: ['Appointments'],
        summary: 'Buat janji temu baru',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/AppointmentCreate' } } },
        },
        responses: {
          201: { description: 'Janji temu berhasil dibuat' },
          401: { description: 'Tidak terautentikasi' },
        },
      },
    },
    '/api/appointments/all': {
      get: {
        tags: ['Appointments'],
        summary: 'Semua janji temu (hanya staff)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string' } },
          { name: 'date', in: 'query', schema: { type: 'string', format: 'date' } },
        ],
        responses: {
          200: { description: 'List semua janji temu' },
          403: { description: 'Bukan staff' },
        },
      },
    },
    '/api/appointments/stats': {
      get: {
        tags: ['Appointments'],
        summary: 'Statistik janji temu (hanya staff)',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Statistik' },
          403: { description: 'Bukan staff' },
        },
      },
    },
    '/api/appointments/patient/{patientId}': {
      get: {
        tags: ['Appointments'],
        summary: 'Riwayat janji temu pasien',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'patientId', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'List janji temu' },
          403: { description: 'Akses ditolak' },
        },
      },
    },
    '/api/appointments/upcoming/{patientId}': {
      get: {
        tags: ['Appointments'],
        summary: 'Janji temu mendatang pasien',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'patientId', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'List janji mendatang' },
          403: { description: 'Akses ditolak' },
        },
      },
    },
    '/api/appointments/{id}/status': {
      patch: {
        tags: ['Appointments'],
        summary: 'Update status janji temu (hanya staff)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/AppointmentStatusUpdate' } } },
        },
        responses: {
          200: { description: 'Status diperbarui' },
          403: { description: 'Bukan staff' },
          404: { description: 'Tidak ditemukan' },
        },
      },
    },
    '/api/appointments/{id}': {
      delete: {
        tags: ['Appointments'],
        summary: 'Batalkan janji temu (pasien sendiri)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { properties: { patientId: { type: 'integer', example: 1 } } } } },
        },
        responses: {
          200: { description: 'Dibatalkan' },
          403: { description: 'Akses ditolak' },
          404: { description: 'Tidak ditemukan' },
        },
      },
    },

    // ════════════════════════════════════════════════════════════════
    // HEALTH RECORDS
    // ════════════════════════════════════════════════════════════════
    '/api/health-records': {
      post: {
        tags: ['Health Records'],
        summary: 'Tambah rekam medis baru',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/HealthRecordCreate' } } },
        },
        responses: {
          201: { description: 'Rekam medis ditambahkan' },
          401: { description: 'Tidak terautentikasi' },
        },
      },
    },
    '/api/health-records/patient/{patientId}': {
      get: {
        tags: ['Health Records'],
        summary: 'Rekam medis pasien',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'patientId', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'List rekam medis' },
          403: { description: 'Akses ditolak' },
        },
      },
    },
    '/api/health-records/patient/{patientId}/type/{jenis}': {
      get: {
        tags: ['Health Records'],
        summary: 'Rekam medis pasien berdasarkan jenis',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'patientId', in: 'path', required: true, schema: { type: 'integer' } },
          { name: 'jenis', in: 'path', required: true, schema: { type: 'string' }, example: 'Lab' },
        ],
        responses: {
          200: { description: 'List rekam medis' },
          403: { description: 'Akses ditolak' },
        },
      },
    },
    '/api/health-records/{id}': {
      delete: {
        tags: ['Health Records'],
        summary: 'Hapus rekam medis (pasien sendiri)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { properties: { patientId: { type: 'integer' } } } } },
        },
        responses: {
          200: { description: 'Dihapus' },
          403: { description: 'Akses ditolak' },
          404: { description: 'Tidak ditemukan' },
        },
      },
    },
  },
};
