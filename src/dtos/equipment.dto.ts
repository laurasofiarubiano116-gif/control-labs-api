export type EstadoTecnicoDTO = 'operativo' | 'dañado' | 'mantenimiento';

export interface CrearEquipoDTO {
  nombre: string;
  tipo: string;
  environment_id: number;
  ubicacion?: string | null;
}

export interface ActualizarEquipoDTO {
  estado_tecnico?: EstadoTecnicoDTO;
  ubicacion?: string | null;
}
