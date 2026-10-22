import pool from '../config/database';
import {
  CrearPrestamoDTO,
  FiltrosHistorialDTO
} from '../dtos/loan.dto';

export const obtenerPrestamos = async () => {
  const resultado = await pool.query(
    'SELECT * FROM loans ORDER BY id ASC'
  );

  return resultado.rows;
};

export const crearPrestamo = async (datos: CrearPrestamoDTO) => {
  const resultado = await pool.query(
    `INSERT INTO loans (
      aula, numero_pc, mouse, teclados, cargador,
      numero_tvs, control_tv, instructor_recibe,
      telefono, nombre_guarda_entrega
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *`,
    [
      datos.aula,
      datos.numeroPC ?? 0,
      datos.mouse ?? 0,
      datos.teclados ?? 0,
      datos.cargador ?? 0,
      datos.numeroTVs ?? 0,
      datos.controlTV ?? false,
      datos.instructorRecibe ?? null,
      datos.telefono ?? null,
      datos.nombreGuardaEntrega ?? null
    ]
  );

  return resultado.rows[0];
};

export const aceptarPrestamo = async (id: number) => {
  const resultado = await pool.query(
    "UPDATE loans SET estado = 'APROBADO_Y_FIRMADO' WHERE id = $1 RETURNING *",
    [id]
  );

  return resultado.rows[0];
};

export const obtenerHistorial = async (
  filtros: FiltrosHistorialDTO
) => {
  let consulta = 'SELECT * FROM loans WHERE 1 = 1';
  const valores: (string | number)[] = [];

  if (filtros.room) {
    valores.push(filtros.room);
    consulta += ` AND aula = $${valores.length}`;
  }

  if (filtros.startDate) {
    valores.push(filtros.startDate);
    consulta += ` AND fecha_hora_recibido >= $${valores.length}`;
  }

  if (filtros.endDate) {
    valores.push(`${filtros.endDate}T23:59:59.999`);
    consulta += ` AND fecha_hora_recibido <= $${valores.length}`;
  }

  consulta += ' ORDER BY fecha_hora_recibido DESC';

  const resultado = await pool.query(consulta, valores);

  return resultado.rows;
};
