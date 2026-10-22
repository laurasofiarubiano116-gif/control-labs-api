import { Request, Response, NextFunction } from 'express';
import { ICreateUserDTO } from '../dtos/user.dto';

const isCreateUserDTO = (value: unknown): value is ICreateUserDTO => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const user = value as Record<string, unknown>;
  return (
    typeof user.nombre === 'string' &&
    user.nombre.trim() !== '' &&
    typeof user.correo === 'string' &&
    user.correo.trim() !== '' &&
    typeof user.rol === 'string' &&
    user.rol.trim() !== '' &&
    typeof user.contrasena === 'string' &&
    user.contrasena.trim() !== ''
  );
};

export const validateUserPayload = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const body: unknown = req.body;

  if (!isCreateUserDTO(body)) {
    res.status(400).json({
      success: false,
      error: 'Datos del usuario inválidos.'
    });
    return;
  }

  next();
};
