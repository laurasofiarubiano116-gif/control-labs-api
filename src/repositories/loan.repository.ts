import Loan, { LoanData } from '../models/loan.model';

const loans: Loan[] = [];

class LoanRepository {
  create(data: Omit<LoanData, 'id'>): Loan {
    const loan = new Loan({
      id: loans.length + 1,
      ...data
    });

    loans.push(loan);

    return loan;
  }

  findAll(): Loan[] {
    return loans;
  }

  findById(id: string | number): Loan | undefined {
    return loans.find((loan) => loan.id === Number(id));
  }

  update(
    id: string | number,
    data: Partial<Loan>
  ): Loan | null {
    const loan = this.findById(id);

    if (!loan) {
      return null;
    }

    Object.assign(loan, data);

    return loan;
  }
}

export default new LoanRepository();