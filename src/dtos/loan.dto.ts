export interface CrearPrestamoDTO {
  aula: string;
  numeroPC?: number;
  mouse?: number;
  teclados?: number;
  cargador?: number;
  numeroTVs?: number;
  controlTV?: boolean;
  instructorRecibe?: string;
  telefono?: string;
  nombreGuardaEntrega?: string;
}

export interface FiltrosHistorialDTO {
  room?: string;
  startDate?: string;
  endDate?: string;
}
