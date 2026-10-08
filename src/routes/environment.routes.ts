import { Router } from 'express';
import { obtenerAmbientes, crearAmbiente, actualizarAmbiente } from '../controllers/environment.controller';
const router = Router();
router.get('/', obtenerAmbientes);
router.post('/', crearAmbiente);
router.patch('/:id', actualizarAmbiente);
export default router;
