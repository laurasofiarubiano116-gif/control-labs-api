import { Router } from 'express';
import {
  obtenerEquipos,
  crearEquipo,
  actualizarEquipo
} from '../controllers/equipment.controller';
import { validarId } from '../middlewares/validateId.middleware';

const router = Router();

router.get('/', obtenerEquipos);
router.post('/', crearEquipo);
router.patch('/:id', validarId, actualizarEquipo);

export default router;
