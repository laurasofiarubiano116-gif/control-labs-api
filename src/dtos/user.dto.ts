export type RolUsuarioDTO = 'estudiante' | 'docente' | 'admin';

export type EstadoUsuarioDTO = 'activo' | 'inactivo';

export interface CrearUsuarioDTO {
  nombre: string;
  correo: string;
  password: string;
  rol: RolUsuarioDTO;
}

export interface ActualizarUsuarioDTO {
  rol?: RolUsuarioDTO;
  estado?: EstadoUsuarioDTO;
  password?: string;
}
