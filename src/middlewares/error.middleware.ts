import { Request, Response, NextFunction } from 'express';

export function manejarErrores(
  error: Error & { status?: number; statusCode?: number; code?: string },
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error(error);

  if (error.code === '23505') {
    res.status(409).json({
      status: 'error',
      message: 'El registro ya existe'
    });
    return;
  }

  if (error.code === '23503') {
    res.status(400).json({
      status: 'error',
      message: 'El registro relacionado no existe o está en uso'
    });
    return;
  }

  const status = error.statusCode || error.status || 500;

  res.status(status >= 400 && status < 600 ? status : 500).json({
    status: 'error',
    message: status >= 500
      ? 'Error interno del servidor'
      : error.message
  });
}
