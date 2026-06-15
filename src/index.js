import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './shared/database/connection.js';
import { errorHandler } from './shared/utils/http.js';
import { authMiddleware } from './shared/middleware/auth.js';
import authRoutes from './domains/auth/auth.routes.js';
import usersRoutes from './domains/users/users.routes.js';
import patientsRoutes from './domains/patients/patients.routes.js';
import alertsRoutes from './domains/alerts/alerts.routes.js';
import sightingsRoutes from './domains/sightings/sightings.routes.js';
import uploadRoutes from './domains/upload/upload.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);

app.use(authMiddleware);

app.use('/api/users', usersRoutes);
app.use('/api/patients', patientsRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/sightings', sightingsRoutes);

app.use(errorHandler);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Database connected and synced.');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();
