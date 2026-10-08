class Loan {
  constructor({
    id,
    aula,
    numeroPC,
    mouse,
    teclados,
    cargador,
    fechaHoraRecibido,
    numeroTVs,
    controlTV,
    instructorRecibe,
    telefono,
    nombreGuardaEntrega
  }) {
    this.id = id;
    this.aula = aula;
    this.numeroPC = numeroPC;
    this.mouse = mouse;
    this.teclados = teclados;
    this.cargador = cargador;
    this.fechaHoraRecibido = fechaHoraRecibido;
    this.numeroTVs = numeroTVs;
    this.controlTV = controlTV;
    this.instructorRecibe = instructorRecibe;
    this.telefono = telefono;
    this.nombreGuardaEntrega = nombreGuardaEntrega;
    this.estado = 'PENDIENTE_APROBACION';
    this.createdAt = new Date().toISOString();
  }
}

module.exports = Loan;