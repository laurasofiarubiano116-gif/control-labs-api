import { Request, Response, NextFunction } from 'express';
import * as loanService from '../services/LoanService';
import {
  CrearPrestamoDTO,
  FiltrosHistorialDTO
} from '../dtos/loan.dto';

export const obtenerPrestamos = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const prestamos = await loanService.obtenerPrestamos();

    res.status(200).json({
      status: 'success',
      data: prestamos
    });
  } catch (error) {
    next(error);
  }
};

export const crearPrestamo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const datos = req.body as CrearPrestamoDTO;
    const nuevoPrestamo = await loanService.crearPrestamo(datos);

    res.status(201).json({
      status: 'success',
      message: 'Préstamo registrado correctamente',
      data: nuevoPrestamo
    });
  } catch (error) {
    next(error);
  }
};

export const aceptarPrestamo = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const prestamo = await loanService.aceptarPrestamo(id);

    if (!prestamo) {
      res.status(404).json({
        status: 'error',
        message: 'Préstamo no encontrado'
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      message: 'Préstamo aceptado correctamente',
      data: prestamo
    });
  } catch (error) {
    next(error);
  }
};

export const obtenerHistorial = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const obtenerTexto = (valor: unknown): string | undefined =>
      typeof valor === 'string' ? valor : undefined;

    const filtros: FiltrosHistorialDTO = {
      room: obtenerTexto(req.query.room),
      startDate: obtenerTexto(req.query.startDate),
      endDate: obtenerTexto(req.query.endDate)
    };

    const historial = await loanService.obtenerHistorial(filtros);

    res.status(200).json({
      status: 'success',
      data: historial
    });
  } catch (error) {
    next(error);
  }
};
