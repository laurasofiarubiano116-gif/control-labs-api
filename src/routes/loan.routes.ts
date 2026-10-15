import { Router } from 'express';
import loanController from '../controllers/loan.controller';
import {
  authenticateToken,
  authorizeRoles
} from '../middlewares/auth.middleware';

const router = Router();

// Registrar préstamo: solo GUARDA
router.post(
  '/',
  authenticateToken,
  authorizeRoles('GUARDA'),
  loanController.createLoan
);

// Consultar todos los préstamos
router.get(
  '/',
  authenticateToken,
  authorizeRoles('ADMIN', 'GUARDA', 'INSTRUCTOR'),
  loanController.getAllLoans
);

// Consultar un préstamo por ID
router.get(
  '/:id',
  authenticateToken,
  authorizeRoles('ADMIN', 'GUARDA', 'INSTRUCTOR'),
  loanController.getLoanById
);

// Aceptar préstamo: solo INSTRUCTOR
router.put(
  '/:id/accept',
  authenticateToken,
  authorizeRoles('INSTRUCTOR'),
  loanController.acceptLoan
);

export default router;