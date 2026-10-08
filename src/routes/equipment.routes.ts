import { Router } from 'express';
import { obtenerEquipos, crearEquipo, actualizarEquipo } from '../controllers/equipment.controller';
const router = Router();
router.get('/', obtenerEquipos);
router.post('/', crearEquipo);
router.patch('/:id', actualizarEquipo);
export default router;
