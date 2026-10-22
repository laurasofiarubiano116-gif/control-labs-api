
import pool from '../config/database';

export interface DatosPrestamo {
  aula: string;
  numeroPC?: number;
  mouse?: number;
  teclados?: number;
  cargador?: number;
  numeroTVs?: number;
  controlTV?: number | boolean;
  instructorRecibe?: string;
  telefono?: string;
  nombreGuardaEntrega?: string;
}

export interface FiltrosHistorial {
  room?: string;
  startDate?: string;
  endDate?: string;
}

export const obtenerPrestamos = async () => {
  const resultado = await pool.query(
    'SELECT * FROM loans ORDER BY id ASC'
  );
  return resultado.rows;
};

export const crearPrestamo = async (datos: DatosPrestamo) => {
  const controlTV =
    typeof datos.controlTV === 'boolean'
      ? (datos.controlTV ? 1 : 0)
      : (datos.controlTV ?? 0);

  const resultado = await pool.query(
    `INSERT INTO loans (
      aula, "numeroPC", mouse, teclados, cargador,
      "fechaHoraRecibido", "numeroTVs", "controlTV",
      "instructorRecibe", telefono, "nombreGuardaEntrega"
    )
    VALUES (
      $1, $2, $3, $4, $5, CURRENT_TIMESTAMP,
      $6, $7, $8, $9, $10
    )
    RETURNING *`,
    [
      datos.aula,
      datos.numeroPC ?? 0,
      datos.mouse ?? 0,
      datos.teclados ?? 0,
      datos.cargador ?? 0,
      datos.numeroTVs ?? 0,
      controlTV,
      datos.instructorRecibe ?? '',
      datos.telefono ?? '',
      datos.nombreGuardaEntrega ?? ''
    ]
  );
  return resultado.rows[0];
};

export const aceptarPrestamo = async (id: number) => {
  const resultado = await pool.query(
    `UPDATE loans
     SET estado = 'APROBADO_Y_FIRMADO',
         "fechaAprobacion" = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING *`,
    [id]
  );
  return resultado.rows[0];
};

export const obtenerHistorial = async (filtros: FiltrosHistorial) => {
  let consulta = 'SELECT * FROM loans WHERE 1 = 1';
  const valores: (string | number)[] = [];

  if (filtros.room) {
    valores.push(filtros.room);
    consulta += ` AND aula = $${valores.length}`;
  }

  if (filtros.startDate) {
    valores.push(filtros.startDate);
    consulta += ` AND "fechaHoraRecibido" >= $${valores.length}`;
  }

  if (filtros.endDate) {
    valores.push(`${filtros.endDate}T23:59:59.999`);
    consulta += ` AND "fechaHoraRecibido" <= $${valores.length}`;
  }

  consulta += ' ORDER BY "fechaHoraRecibido" DESC';

  const resultado = await pool.query(consulta, valores);
  return resultado.rows;
};
