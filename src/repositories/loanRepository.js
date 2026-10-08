const Loan = require('../models/loanModel');

const loans = [];

class LoanRepository {
  create(data) {
    const loan = new Loan({
      id: loans.length + 1,
      ...data
    });

    loans.push(loan);

    return loan;
  }

  findAll() {
    return loans;
  }

  findById(id) {
    return loans.find(loan => loan.id === Number(id));
  }

  update(id, data) {
    const loan = this.findById(id);

    if (!loan) {
      return null;
    }

    Object.assign(loan, data);

    return loan;
  }
}

module.exports = new LoanRepository();