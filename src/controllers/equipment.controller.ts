import { Request, Response } from 'express';
import pool from '../config/database';
const estados = ['operativo', 'dañado', 'mantenimiento'];
export async function obtenerEquipos(req: Request, res: Response): Promise<void> {
  try {
    const environmentId = req.query.environmentId;
    if (environmentId !== undefined) {
      const id = Number(environmentId);
      if (!Number.isInteger(id) || id < 1) {
        res.status(400).json({ message: 'environmentId inválido' });
        return;
      }
      const result = await pool.query(`SELECT e.*, a.nombre AS ambiente FROM equipment e JOIN environments a ON a.id = e.environment_id WHERE e.environment_id = $1 ORDER BY e.id`, [id]);
      res.json(result.rows);
      return;
    }
    const result = await pool.query(`SELECT e.*, a.nombre AS ambiente FROM equipment e JOIN environments a ON a.id = e.environment_id ORDER BY e.id`);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al consultar equipos' });
  }
}
export async function crearEquipo(req: Request, res: Response): Promise<void> {
  try {
    const { nombre, tipo, environment_id, ubicacion } = req.body;
    const ambienteId = Number(environment_id);
    if (typeof nombre !== 'string' || !nombre.trim() || typeof tipo !== 'string' || !tipo.trim() || !Number.isInteger(ambienteId) || ambienteId < 1) {
      res.status(400).json({ message: 'Nombre, tipo y environment_id válido son obligatorios' });
      return;
    }
    const result = await pool.query(`INSERT INTO equipment (nombre, tipo, environment_id, ubicacion) VALUES ($1, $2, $3, $4) RETURNING *`, [nombre.trim(), tipo.trim(), ambienteId, ubicacion ?? null]);
    res.status(201).json({ message: 'Equipo creado correctamente', equipo: result.rows[0] });
  } catch (error) {
    if ((error as { code?: string }).code === '23503') {
      res.status(400).json({ message: 'El ambiente indicado no existe' });
      return;
    }
    console.error(error);
    res.status(500).json({ message: 'Error al crear equipo' });
  }
}
export async function actualizarEquipo(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      res.status(400).json({ message: 'ID inválido' });
      return;
    }
    const { estado_tecnico, ubicacion } = req.body;
    const campos: string[] = [];
    const valores: unknown[] = [];
    if (estado_tecnico !== undefined) {
      if (!estados.includes(estado_tecnico)) {
        res.status(400).json({ message: 'Estado técnico inválido' });
        return;
      }
      valores.push(estado_tecnico);
      campos.push(`estado_tecnico = $${valores.length}`);
    }
    if (ubicacion !== undefined) {
      if (ubicacion !== null && typeof ubicacion !== 'string') {
        res.status(400).json({ message: 'Ubicación inválida' });
        return;
      }
      valores.push(ubicacion);
      campos.push(`ubicacion = $${valores.length}`);
    }
    if (campos.length === 0) {
      res.status(400).json({ message: 'Envíe estado_tecnico o ubicacion para actualizar' });
      return;
    }
    valores.push(id);
    const result = await pool.query(`UPDATE equipment SET ${campos.join(', ')} WHERE id = $${valores.length} RETURNING *`, valores);
    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Equipo no encontrado' });
      return;
    }
    res.json({ message: 'Equipo actualizado correctamente', equipo: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar equipo' });
  }
}
