const { test } = require('node:test');
const assert = require('node:assert/strict');
const { LoanService } = require('../dist/services/loan.service');
const { InMemoryLoanRepository } = require('../dist/repositories/in-memory-loan.repository');
const { validateLoanPayload } = require('../dist/middlewares/validateLoan.middleware');
const { globalErrorHandler } = require('../dist/middlewares/errorHandler.middleware');
const { DomainError } = require('../dist/errors/domain.error');
const input = { roomId: 'AAAAAAAA-AAAA-4AAA-8AAA-AAAAAAAAAAAA',
  instructorId: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  guardaId: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', numeroPc: 3 };
function response() {
  return { headersSent: false, statusCode: 200, body: null,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; } };
}
test('creación, normalización, filtro y aislamiento de copias', async () => {
  const repo = new InMemoryLoanRepository();
  const service = new LoanService(repo);
  const loan = await service.createLoan(input);
  assert.equal(loan.estado, 'PENDIENTE_APROBACION');
  assert.equal(loan.acceptedAt, null);
  assert.equal(loan.roomId, input.roomId.toLowerCase());
  loan.numeroPc = 99;
  assert.equal((await service.getLoanDetail(loan.id)).numeroPc, 3);
  const list = await service.getLoans({ roomId: input.roomId });
  assert.equal(list.length, 1);
  list[0].numeroPc = 77;
  assert.equal((await service.getLoanDetail(loan.id)).numeroPc, 3);
  assert.deepEqual(await service.getLoans({ roomId: input.guardaId }), []);
});
test('cantidad positiva e identificadores válidos', async () => {
  const service = new LoanService(new InMemoryLoanRepository());
  for (const numeroPc of [0, -1, 1.5, NaN, Infinity])
    await assert.rejects(service.createLoan({ ...input, numeroPc }), { code: 'VALIDATION_ERROR' });
  await assert.rejects(service.getLoans({ roomId: 'incorrecto' }), { code: 'VALIDATION_ERROR' });
  await assert.rejects(service.getLoanDetail(-1), { code: 'VALIDATION_ERROR' });
  await assert.rejects(service.getLoanDetail(1), { code: 'NOT_FOUND' });
  await assert.rejects(service.acceptLoan(1), { code: 'NOT_FOUND' });
});
test('aceptación condicional evita dos aceptaciones simultáneas', async () => {
  const service = new LoanService(new InMemoryLoanRepository());
  const loan = await service.createLoan(input);
  const results = await Promise.allSettled([service.acceptLoan(loan.id), service.acceptLoan(loan.id)]);
  assert.equal(results.filter(r => r.status === 'fulfilled').length, 1);
  assert.equal(results.find(r => r.status === 'rejected').reason.code, 'CONFLICT');
  const accepted = await service.getLoanDetail(loan.id);
  assert.equal(accepted.estado, 'APROBADO_Y_FIRMADO');
  assert.ok(Number.isFinite(Date.parse(accepted.acceptedAt)));
});
test('middleware rechaza cuerpos inválidos y campos del servidor', () => {
  for (const body of [null, [], {}, { ...input, numeroPc: '3' }, { ...input, estado: 'APROBADO_Y_FIRMADO' }]) {
    const res = response();
    validateLoanPayload({ body }, res, () => assert.fail('No debe continuar'));
    assert.equal(res.statusCode, 400);
  }
  let continued = false;
  validateLoanPayload({ body: input }, response(), () => { continued = true; });
  assert.equal(continued, true);
});
test('errores de dominio y JSON se traducen a respuestas HTTP', () => {
  for (const [code, status] of [['VALIDATION_ERROR', 400], ['NOT_FOUND', 404], ['CONFLICT', 409]]) {
    const res = response();
    globalErrorHandler(new DomainError(code, 'Prueba'), {}, res, () => assert.fail());
    assert.equal(res.statusCode, status);
    assert.equal(res.body.code, code);
  }
  const res = response();
  globalErrorHandler({ type: 'entity.parse.failed' }, {}, res, () => assert.fail());
  assert.equal(res.statusCode, 400);
});
