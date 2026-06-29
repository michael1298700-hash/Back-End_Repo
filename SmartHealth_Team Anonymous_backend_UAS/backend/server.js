import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';

import { initDatabase } from './database/database.js';
import { swaggerDefinition } from './docs/swagger.js';
import { requestLogger } from './middleware/logger.js';
import { authenticate, authorize, ownDataOnly } from './middleware/auth.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

import userRoutes       from './routes/users.js';
import doctorRoutes     from './routes/doctors.js';
import appointmentRoutes from './routes/appointments.js';
import healthRecordRoutes from './routes/healthRecords.js';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',');
app.use(cors({
  origin: true, // Izinkan semua origin
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDefinition, {
  customSiteTitle: 'SmartHealth API Docs',
  swaggerOptions: { persistAuthorization: true },
}));

(async () => {
  try {
    await initDatabase();
    console.log('✅  Database Sequelize siap');

    app.use('/api/users', userRoutes);

    app.use('/api/doctors', doctorRoutes);

    app.use('/api/appointments', authenticate, appointmentRoutes);

    app.use('/api/health-records', authenticate, healthRecordRoutes);

    app.get('/api/health', (req, res) => {
      res.json({
        success: true,
        message: 'SmartHealth API v2.0 berjalan',
        timestamp: new Date().toISOString(),
        docs: `/api-docs`,
      });
    });

    app.use(notFoundHandler);
    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`🚀  Server : http://localhost:${PORT}`);
      console.log(`📄  Docs   : http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('❌  Gagal inisialisasi database:', error);
    process.exit(1);
  }
})();
