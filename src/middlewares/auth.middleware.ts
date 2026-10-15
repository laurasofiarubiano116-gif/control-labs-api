import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthUser {
  id: number;
  email: string;
  rol: 'ADMIN' | 'GUARDA' | 'INSTRUCTOR';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        status: 'error',
        message: 'Token de autenticación requerido'
      });
      return;
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      res.status(401).json({
        status: 'error',
        message: 'Formato de token inválido'
      });
      return;
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      res.status(500).json({
        status: 'error',
        message: 'La configuración JWT no está disponible'
      });
      return;
    }

    const decoded = jwt.verify(parts[1], secret);

    if (
      typeof decoded === 'string' ||
      typeof decoded.id !== 'number' ||
      typeof decoded.email !== 'string' ||
      !['ADMIN', 'GUARDA', 'INSTRUCTOR'].includes(String(decoded.rol))
    ) {
      res.status(401).json({
        status: 'error',
        message: 'Token inválido o expirado'
      });
      return;
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      rol: decoded.rol as AuthUser['rol']
    };

    next();
  } catch {
    res.status(401).json({
      status: 'error',
      message: 'Token inválido o expirado'
    });
  }
};

const authorizeRoles = (...allowedRoles: AuthUser['rol'][]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        message: 'Usuario no autenticado'
      });
      return;
    }

    if (!allowedRoles.includes(req.user.rol)) {
      res.status(403).json({
        status: 'error',
        message: 'No tienes permisos para realizar esta acción'
      });
      return;
    }

    next();
  };
};

export { authenticateToken, authorizeRoles };