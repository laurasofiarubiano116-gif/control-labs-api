import { Request, Response, NextFunction } from 'express';
import { randomBytes, scrypt } from 'node:crypto';
import pool from '../config/database';
import {
  CrearUsuarioDTO,
  ActualizarUsuarioDTO,
  RolUsuarioDTO,
  EstadoUsuarioDTO
} from '../dtos/user.dto';

const roles: RolUsuarioDTO[] = ['estudiante', 'docente', 'admin'];
const estados: EstadoUsuarioDTO[] = ['activo', 'inactivo'];

function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');

  return new Promise((resolve, reject) => {
    scrypt(password, salt, 64, (error, key) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(`${salt}:${key.toString('hex')}`);
    });
  });
}

export async function obtenerUsuarios(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await pool.query(
      'SELECT id, nombre, correo, rol, estado, creado_en FROM users WHERE eliminado = FALSE ORDER BY id'
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
}

export async function obtenerUsuario(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = Number(req.params.id);

    const result = await pool.query(
      'SELECT id, nombre, correo, rol, estado, creado_en FROM users WHERE id = $1 AND eliminado = FALSE',
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        status: 'error',
        message: 'Usuario no encontrado'
      });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
}

export async function crearUsuario(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { nombre, correo, password, rol } = req.body as CrearUsuarioDTO;

    if (
      typeof nombre !== 'string' ||
      !nombre.trim() ||
      typeof correo !== 'string' ||
      !correo.trim() ||
      typeof password !== 'string' ||
      password.length < 8 ||
      !roles.includes(rol)
    ) {
      res.status(400).json({
        status: 'error',
        message: 'Ingrese nombre, correo, contraseña de mínimo 8 caracteres y un rol válido'
      });
      return;
    }

    const passwordHash = await hashPassword(password);

    const result = await pool.query(
      'INSERT INTO users (nombre, correo, password_hash, rol) VALUES ($1, $2, $3, $4) RETURNING id, nombre, correo, rol, estado, creado_en',
      [nombre.trim(), correo.trim().toLowerCase(), passwordHash, rol]
    );

    res.status(201).json({
      status: 'success',
      message: 'Usuario registrado correctamente',
      usuario: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
}

export async function actualizarUsuario(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = Number(req.params.id);
    const { rol, estado, password } = req.body as ActualizarUsuarioDTO;
    const campos: string[] = [];
    const valores: unknown[] = [];

    if (rol !== undefined) {
      if (!roles.includes(rol)) {
        res.status(400).json({
          status: 'error',
          message: 'Rol inválido'
        });
        return;
      }

      valores.push(rol);
      campos.push(`rol = $${valores.length}`);
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

    if (password !== undefined) {
      if (typeof password !== 'string' || password.length < 8) {
        res.status(400).json({
          status: 'error',
          message: 'La contraseña debe tener mínimo 8 caracteres'
        });
        return;
      }

      valores.push(await hashPassword(password));
      campos.push(`password_hash = $${valores.length}`);
    }

    if (campos.length === 0) {
      res.status(400).json({
        status: 'error',
        message: 'Envíe rol, estado o password para actualizar'
      });
      return;
    }

    valores.push(id);

    const result = await pool.query(
      `UPDATE users SET ${campos.join(', ')} WHERE id = $${valores.length} AND eliminado = FALSE RETURNING id, nombre, correo, rol, estado`,
      valores
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        status: 'error',
        message: 'Usuario no encontrado'
      });
      return;
    }

    res.json({
      status: 'success',
      message: 'Usuario actualizado correctamente',
      usuario: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
}

export async function eliminarUsuario(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = Number(req.params.id);

    const result = await pool.query(
      "UPDATE users SET eliminado = TRUE, estado = 'inactivo' WHERE id = $1 AND eliminado = FALSE RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        status: 'error',
        message: 'Usuario no encontrado'
      });
      return;
    }

    res.json({
      status: 'success',
      message: 'Usuario eliminado lógicamente'
    });
  } catch (error) {
    next(error);
  }
}
