export type EstadoAmbienteDTO = 'operativo' | 'mantenimiento' | 'inactivo';

export interface CrearAmbienteDTO {
  nombre: string;
  capacidad: number;
  ubicacion: string;
}

export interface ActualizarAmbienteDTO {
  capacidad?: number;
  estado?: EstadoAmbienteDTO;
}
