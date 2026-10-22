import { Router } from 'express';
import {
  obtenerAmbientes,
  crearAmbiente,
  actualizarAmbiente
} from '../controllers/environment.controller';
import { validarId } from '../middlewares/validateId.middleware';

const router = Router();

router.get('/', obtenerAmbientes);
router.post('/', crearAmbiente);
router.patch('/:id', validarId, actualizarAmbiente);

export default router;
