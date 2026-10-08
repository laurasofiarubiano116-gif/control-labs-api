const express = require('express');

const loanController = require('../controllers/loanController');
const {
  authenticateToken,
  authorizeRoles
} = require('../middlewares/authMiddleware');

const router = express.Router();

// Registrar préstamo → solo GUARDA
router.post(
  '/',
  authenticateToken,
  authorizeRoles('GUARDA'),
  loanController.createLoan
);

// Consultar todos los préstamos → ADMIN, GUARDA e INSTRUCTOR
router.get(
  '/',
  authenticateToken,
  authorizeRoles('ADMIN', 'GUARDA', 'INSTRUCTOR'),
  loanController.getAllLoans
);

// Consultar un préstamo → ADMIN, GUARDA e INSTRUCTOR
router.get(
  '/:id',
  authenticateToken,
  authorizeRoles('ADMIN', 'GUARDA', 'INSTRUCTOR'),
  loanController.getLoanById
);

// Aceptar préstamo → solo INSTRUCTOR
router.put(
  '/:id/accept',
  authenticateToken,
  authorizeRoles('INSTRUCTOR'),
  loanController.acceptLoan
);

module.exports = router;