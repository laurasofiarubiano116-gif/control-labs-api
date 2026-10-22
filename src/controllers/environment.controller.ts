import { Request, Response, NextFunction } from 'express';
import pool from '../config/database';
import {
  CrearAmbienteDTO,
  ActualizarAmbienteDTO,
  EstadoAmbienteDTO
} from '../dtos/environment.dto';

const estados: EstadoAmbienteDTO[] = [
  'operativo',
  'mantenimiento',
  'inactivo'
];

export async function obtenerAmbientes(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await pool.query(
      'SELECT * FROM environments ORDER BY id'
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
}

export async function crearAmbiente(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { nombre, capacidad, ubicacion } = req.body as CrearAmbienteDTO;
    const capacidadNumero = Number(capacidad);

    if (
      typeof nombre !== 'string' ||
      !nombre.trim() ||
      !Number.isInteger(capacidadNumero) ||
      capacidadNumero < 1 ||
      typeof ubicacion !== 'string' ||
      !ubicacion.trim()
    ) {
      res.status(400).json({
        status: 'error',
        message: 'Nombre, capacidad positiva y ubicación son obligatorios'
      });
      return;
    }

    const result = await pool.query(
      'INSERT INTO environments (nombre, capacidad, ubicacion) VALUES ($1, $2, $3) RETURNING *',
      [nombre.trim(), capacidadNumero, ubicacion.trim()]
    );

    res.status(201).json({
      message: 'Ambiente creado correctamente',
      ambiente: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
}

export async function actualizarAmbiente(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = Number(req.params.id);
    const { capacidad, estado } = req.body as ActualizarAmbienteDTO;
    const campos: string[] = [];
    const valores: unknown[] = [];

    if (capacidad !== undefined) {
      const numero = Number(capacidad);

      if (!Number.isInteger(numero) || numero < 1) {
        res.status(400).json({
          status: 'error',
          message: 'La capacidad debe ser positiva'
        });
        return;
      }

      valores.push(numero);
      campos.push(`capacidad = $${valores.length}`);
    }

    if (estado !== undefined) {
      if (!estados.includes(estado)) {
        res.status(400).json({
          status: 'error',
          message: 'Estado inválido'
        });
        return;
      }

      valores.push(estado);
      campos.push(`estado = $${valores.length}`);
    }

    if (campos.length === 0) {
      res.status(400).json({
        status: 'error',
        message: 'Envíe capacidad o estado para actualizar'
      });
      return;
    }

    valores.push(id);

    const result = await pool.query(
      `UPDATE environments SET ${campos.join(', ')} WHERE id = $${valores.length} RETURNING *`,
      valores
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        status: 'error',
        message: 'Ambiente no encontrado'
      });
      return;
    }

    res.json({
      message: 'Ambiente actualizado correctamente',
      ambiente: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
}
