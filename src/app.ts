import express from 'express';
import cors from 'cors';
import apiRoutes from './routes';
import { validarBody } from './middlewares/validateBody.middleware';
import { manejarErrores } from './middlewares/error.middleware';

const app = express();

app.use(cors());
app.use(express.json());
app.use(validarBody);

app.get('/api/v1/health', (_req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'ControlLabs API operando correctamente',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/v1', apiRoutes);

app.use((_req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Ruta no encontrada'
  });
});

app.use(manejarErrores);

export default app;
