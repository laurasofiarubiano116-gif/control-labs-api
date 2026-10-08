const loanService = require('../services/loanService');

class LoanController {
  createLoan(req, res) {
    try {
      const loan = loanService.createLoan(req.body);

      return res.status(201).json({
        status: 'success',
        message: 'Préstamo registrado correctamente',
        data: loan
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  getAllLoans(req, res) {
    try {
      const loans = loanService.getAllLoans();

      return res.status(200).json({
        status: 'success',
        data: loans
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  getLoanById(req, res) {
    try {
      const loan = loanService.getLoanById(req.params.id);

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
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  acceptLoan(req, res) {
    try {
      const loan = loanService.acceptLoan(req.params.id);

      return res.status(200).json({
        status: 'success',
        message: 'Inventario aceptado correctamente',
        data: loan
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        status: 'error',
        message: error.message
      });
    }
  }
}

module.exports = new LoanController();