import loanRepository from '../repositories/loan.repository';
import { LoanData } from '../models/loan.model';

type LoanInput = Omit<LoanData, 'id'>;

class LoanService {
  createLoan(data: LoanInput) {
    const requiredFields: (keyof LoanInput)[] = [
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
      (field) =>
        data[field] === undefined ||
        data[field] === null ||
        data[field] === ''
    );

    if (missingFields.length > 0) {
      throw Object.assign(
        new Error(
          `Faltan campos obligatorios: ${missingFields.join(', ')}`
        ),
        { statusCode: 400 }
      );
    }

    const numericFields: (
  | 'numeroPC'
  | 'mouse'
  | 'teclados'
  | 'cargador'
  | 'numeroTVs'
  | 'controlTV'
)[] = [
  'numeroPC',
  'mouse',
  'teclados',
  'cargador',
  'numeroTVs',
  'controlTV'
];
    for (const field of numericFields) {
      const value = Number(data[field]);

      if (!Number.isInteger(value)) {
        throw Object.assign(
          new Error(`El campo ${field} debe ser un número entero`),
          { statusCode: 400 }
        );
      }

      if (value < 0) {
        throw Object.assign(
          new Error(`El campo ${field} no puede ser negativo`),
          { statusCode: 400 }
        );
      }

      data[field] = value;
    }

    const telefono = String(data.telefono).trim();

    if (!/^\d{7,10}$/.test(telefono)) {
      throw Object.assign(
        new Error('El teléfono debe contener entre 7 y 10 dígitos'),
        { statusCode: 400 }
      );
    }

    data.telefono = telefono;

    return loanRepository.create(data);
  }

  getAllLoans() {
    return loanRepository.findAll();
  }

  getLoanById(id: string) {
    return loanRepository.findById(id);
  }

  acceptLoan(id: string) {
    const loan = loanRepository.findById(id);

    if (!loan) {
      throw Object.assign(
        new Error('Préstamo no encontrado'),
        { statusCode: 404 }
      );
    }

    if (loan.estado !== 'PENDIENTE_APROBACION') {
      throw Object.assign(
        new Error('El préstamo no se encuentra pendiente de aprobación'),
        { statusCode: 400 }
      );
    }

    return loanRepository.update(id, {
      estado: 'APROBADO_Y_FIRMADO',
      fechaAprobacion: new Date().toISOString()
    });
  }
}

export default new LoanService();