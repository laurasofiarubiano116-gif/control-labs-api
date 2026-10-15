import { Request, Response, NextFunction } from 'express';

const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error:', err.message);

  const error = err as Error & { statusCode?: number };

  res.status(error.statusCode || 500).json({
    status: 'error',
    message: error.message || 'Error interno del servidor'
  });
};

export default errorHandler;