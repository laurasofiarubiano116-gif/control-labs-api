import { Request, Response, NextFunction } from 'express';

export function validarBody(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (
    req.body === null ||
    typeof req.body !== 'object' ||
    Array.isArray(req.body)
  ) {
    res.status(400).json({
      status: 'error',
      message: 'El cuerpo de la solicitud debe ser un objeto JSON válido'
    });
    return;
  }

  next();
}
