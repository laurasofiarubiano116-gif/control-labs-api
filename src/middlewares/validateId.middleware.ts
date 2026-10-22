import { Request, Response, NextFunction } from 'express';

export function validarId(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({
      status: 'error',
      message: 'ID inválido'
    });
    return;
  }

  next();
}
