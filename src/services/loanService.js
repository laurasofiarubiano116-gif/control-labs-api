const loanRepository = require('../repositories/loanRepository');

class LoanService {
  createLoan(data) {
    const requiredFields = [
      'aula',
      'numeroPC',
      'mouse',
      'teclados',
      'cargador',
      'fechaHoraRecibido',
      'numeroTVs',
      'controlTV',
      'instructorRecibe',
      'telefono',
      'nombreGuardaEntrega'
    ];

    const missingFields = requiredFields.filter(
      field =>
        data[field] === undefined ||
        data[field] === null ||
        data[field] === ''
    );

    if (missingFields.length > 0) {
      const error = new Error(
        `Faltan campos obligatorios: ${missingFields.join(', ')}`
      );

      error.statusCode = 400;

      throw error;
    }

    return loanRepository.create(data);
  }

  getAllLoans() {
    return loanRepository.findAll();
  }

  getLoanById(id) {
    return loanRepository.findById(id);
  }

  acceptLoan(id) {
    const loan = loanRepository.findById(id);

    if (!loan) {
      const error = new Error('Préstamo no encontrado');
      error.statusCode = 404;
      throw error;
    }

    if (loan.estado !== 'PENDIENTE_APROBACION') {
      const error = new Error(
        'El préstamo no se encuentra pendiente de aprobación'
      );

      error.statusCode = 400;

      throw error;
    }

    return loanRepository.update(id, {
      estado: 'APROBADO_Y_FIRMADO',
      fechaAprobacion: new Date().toISOString()
    });
  }
}

module.exports = new LoanService();