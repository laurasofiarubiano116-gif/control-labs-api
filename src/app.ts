import express from 'express';
import cors from 'cors';
import routes from './routes';
import authRoutes from './routes/auth.routes';
import errorHandler from './middlewares/error.middleware';

const app = express();

app.use(cors());
app.use(express.json());

// Rutas de préstamos
app.use('/api/v1', routes);

// Rutas de autenticación
app.use('/api/v1/auth', authRoutes);

// Health Check
app.get('/api/v1/health', (_req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'ControlLabs API operando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Manejo centralizado de errores
app.use(errorHandler);

export default app;