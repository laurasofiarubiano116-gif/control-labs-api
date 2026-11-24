import type { ICreateLoanDTO } from '../dtos/loan.dto';
import { DomainError } from '../errors/domain.error';
import type { Loan, LoanFilters, LoanRepository } from '../repositories/loan.repository';
const isUuid = (v: unknown): v is string => typeof v === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
export class LoanService {
  constructor(private readonly loanRepository: LoanRepository) {}
  async createLoan(input: ICreateLoanDTO): Promise<Loan> {
    if (!Number.isSafeInteger(input.numeroPc) || input.numeroPc <= 0)
      throw new DomainError('VALIDATION_ERROR', 'El número de PCs debe ser un entero positivo.');
    if (![input.roomId, input.instructorId, input.guardaId].every(isUuid))
      throw new DomainError('VALIDATION_ERROR', 'Los identificadores deben ser UUID válidos.');
    return this.loanRepository.create({ roomId: input.roomId.toLowerCase(),
      instructorId: input.instructorId.toLowerCase(), guardaId: input.guardaId.toLowerCase(), numeroPc: input.numeroPc });
  }
  async getLoans(filters: LoanFilters = {}): Promise<Loan[]> {
    if (filters.roomId !== undefined && !isUuid(filters.roomId))
      throw new DomainError('VALIDATION_ERROR', 'El filtro roomId debe ser un UUID válido.');
    return this.loanRepository.findAll({ roomId: filters.roomId?.toLowerCase() });
  }
  async getLoanDetail(id: number): Promise<Loan> {
    this.validateId(id);
    const loan = await this.loanRepository.findById(id);
    if (!loan) throw new DomainError('NOT_FOUND', 'No existe el préstamo solicitado.');
    return loan;
  }
  async acceptLoan(id: number): Promise<Loan> {
    this.validateId(id);
    const loan = await this.loanRepository.updateStatus(id, 'PENDIENTE_APROBACION', 'APROBADO_Y_FIRMADO');
    if (loan) return loan;
    if (!await this.loanRepository.findById(id))
      throw new DomainError('NOT_FOUND', 'No existe el préstamo solicitado.');
    throw new DomainError('CONFLICT', 'El préstamo ya fue aceptado.');
  }
  private validateId(id: number): void {
    if (!Number.isSafeInteger(id) || id <= 0)
      throw new DomainError('VALIDATION_ERROR', 'El identificador debe ser un entero positivo.');
  }
}
