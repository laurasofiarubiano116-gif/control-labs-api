import type { ICreateLoanDTO } from '../dtos/loan.dto';
import type { Loan, LoanFilters, LoanRepository, LoanStatus } from './loan.repository';
export class InMemoryLoanRepository implements LoanRepository {
  private loans = new Map<number, Loan>();
  private nextId = 1;
  async create(input: ICreateLoanDTO): Promise<Loan> {
    const loan: Loan = { ...input, id: this.nextId++, estado: 'PENDIENTE_APROBACION',
      createdAt: new Date().toISOString(), acceptedAt: null };
    this.loans.set(loan.id, loan);
    return { ...loan };
  }
  async findAll(filters: LoanFilters = {}): Promise<Loan[]> {
    return [...this.loans.values()].filter(l => filters.roomId === undefined || l.roomId === filters.roomId)
      .map(l => ({ ...l }));
  }
  async findById(id: number): Promise<Loan | null> {
    const loan = this.loans.get(id);
    return loan ? { ...loan } : null;
  }
  async updateStatus(id: number, expectedStatus: LoanStatus, status: LoanStatus): Promise<Loan | null> {
    const loan = this.loans.get(id);
    if (!loan || loan.estado !== expectedStatus) return null;
    const updated = { ...loan, estado: status,
      acceptedAt: status === 'APROBADO_Y_FIRMADO' ? new Date().toISOString() : null };
    this.loans.set(id, updated);
    return { ...updated };
  }
}
