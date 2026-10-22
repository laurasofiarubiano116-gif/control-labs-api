import { Router } from 'express';
import {
  obtenerPrestamos,
  crearPrestamo,
  aceptarPrestamo,
  obtenerHistorial
} from '../controllers/loan.controller';
import { validarId } from '../middlewares/validateId.middleware';

const router = Router();

router.get('/history', obtenerHistorial);
router.get('/search', obtenerHistorial);
router.get('/', obtenerPrestamos);
router.post('/', crearPrestamo);
router.put('/:id/accept', validarId, aceptarPrestamo);

export default router;
