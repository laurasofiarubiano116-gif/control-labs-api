import { Router } from 'express';
import { obtenerPrestamos, crearPrestamo, aceptarPrestamo, obtenerHistorial } from '../controllers/loan.controller';
const router = Router();
router.get('/history', obtenerHistorial);
router.get('/search', obtenerHistorial);
router.get('/', obtenerPrestamos);
router.post('/', crearPrestamo);
router.put('/:id/accept', aceptarPrestamo);
export default router;
