import { Request, Response } from 'express';
import loanService from '../services/loan.service';

class LoanController {
  createLoan(req: Request, res: Response) {
    try {
      const loan = loanService.createLoan(req.body);

      return res.status(201).json({
        status: 'success',
        message: 'Préstamo registrado correctamente',
        data: loan
      });
    } catch (error: unknown) {
      const err = error as Error & { statusCode?: number };

      return res.status(err.statusCode || 500).json({
        status: 'error',
        message: err.message || 'Error interno del servidor'
      });
    }
  }

  getAllLoans(_req: Request, res: Response) {
    try {
      const loans = loanService.getAllLoans();

      return res.status(200).json({
        status: 'success',
        data: loans
      });
    } catch (error: unknown) {
      const err = error as Error;

      return res.status(500).json({
        status: 'error',
        message: err.message || 'Error interno del servidor'
      });
    }
  }

  getLoanById(req: Request, res: Response) {
    try {
      const loan = loanService.getLoanById(String(req.params.id));

      if (!loan) {
        return res.status(404).json({
          status: 'error',
          message: 'Préstamo no encontrado'
        });
      }

      return res.status(200).json({
        status: 'success',
        data: loan
      });
    } catch (error: unknown) {
      const err = error as Error;

      return res.status(500).json({
        status: 'error',
        message: err.message || 'Error interno del servidor'
      });
    }
  }

  acceptLoan(req: Request, res: Response) {
    try {
      const loan = loanService.acceptLoan(String(req.params.id));

      return res.status(200).json({
        status: 'success',
        message: 'Inventario aceptado correctamente',
        data: loan
      });
    } catch (error: unknown) {
      const err = error as Error & { statusCode?: number };

      return res.status(err.statusCode || 500).json({
        status: 'error',
        message: err.message || 'Error interno del servidor'
      });
    }
  }
}

export default new LoanController();