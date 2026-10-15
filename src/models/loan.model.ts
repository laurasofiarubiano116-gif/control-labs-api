export interface LoanData {
  id: number;
  aula: string;
  numeroPC: number;
  mouse: number;
  teclados: number;
  cargador: number;
  fechaHoraRecibido: string;
  numeroTVs: number;
  controlTV: number;
  instructorRecibe: string;
  telefono: string;
  nombreGuardaEntrega: string;
}

export type LoanStatus =
  | 'PENDIENTE_APROBACION'
  | 'APROBADO_Y_FIRMADO';

export default class Loan implements LoanData {
  id: number;
  aula: string;
  numeroPC: number;
  mouse: number;
  teclados: number;
  cargador: number;
  fechaHoraRecibido: string;
  numeroTVs: number;
  controlTV: number;
  instructorRecibe: string;
  telefono: string;
  nombreGuardaEntrega: string;
  estado: LoanStatus;
  createdAt: string;
  fechaAprobacion?: string;

  constructor(data: LoanData) {
    this.id = data.id;
    this.aula = data.aula;
    this.numeroPC = data.numeroPC;
    this.mouse = data.mouse;
    this.teclados = data.teclados;
    this.cargador = data.cargador;
    this.fechaHoraRecibido = data.fechaHoraRecibido;
    this.numeroTVs = data.numeroTVs;
    this.controlTV = data.controlTV;
    this.instructorRecibe = data.instructorRecibe;
    this.telefono = data.telefono;
    this.nombreGuardaEntrega = data.nombreGuardaEntrega;
    this.estado = 'PENDIENTE_APROBACION';
    this.createdAt = new Date().toISOString();
  }
}