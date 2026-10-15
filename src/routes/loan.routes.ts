
import { Router } from 'express';
import loanController from '../controllers/loan.controller';
import {
  authenticateToken,
  authorizeRoles
} from '../middlewares/auth.middleware';

const router = Router();

// Buscar préstamos por salón y rango de fechas.
// Debe declararse antes de /:id.
router.get(
  '/search',
  authenticateToken,
  authorizeRoles('ADMIN', 'GUARDA', 'INSTRUCTOR'),
  loanController.getLoansByFilter
);

// Registrar préstamo: solo GUARDA.
router.post(
  '/',
  authenticateToken,
  authorizeRoles('GUARDA'),
  loanController.createLoan
);

// Consultar todos los préstamos.
router.get(
  '/',
  authenticateToken,
  authorizeRoles('ADMIN', 'GUARDA', 'INSTRUCTOR'),
  loanController.getAllLoans
);

// Consultar préstamo por ID.
router.get(
  '/:id',
  authenticateToken,
  authorizeRoles('ADMIN', 'GUARDA', 'INSTRUCTOR'),
  loanController.getLoanById
);

// Aceptar préstamo: solo INSTRUCTOR.
router.put(
  '/:id/accept',
  authenticateToken,
  authorizeRoles('INSTRUCTOR'),
  loanController.acceptLoan
);

export default router;
