import { Request, Response } from 'express';
import * as loanService from '../services/LoanService';
export const obtenerPrestamos = async (_req: Request, res: Response): Promise<void> => {
  try {
    const prestamos = await loanService.obtenerPrestamos();
    res.status(200).json({ status: 'success', data: prestamos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error al obtener los préstamos' });
  }
};
export const crearPrestamo = async (req: Request, res: Response): Promise<void> => {
  try {
    const nuevoPrestamo = await loanService.crearPrestamo(req.body);
    res.status(201).json({ status: 'success', message: 'Préstamo registrado correctamente', data: nuevoPrestamo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error al registrar el préstamo' });
  }
};
export const aceptarPrestamo = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ status: 'error', message: 'ID de préstamo inválido' });
      return;
    }
    const prestamo = await loanService.aceptarPrestamo(id);
    if (!prestamo) {
      res.status(404).json({ status: 'error', message: 'Préstamo no encontrado' });
      return;
    }
    res.status(200).json({ status: 'success', message: 'Préstamo aceptado correctamente', data: prestamo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error al aceptar el préstamo' });
  }
};
export const obtenerHistorial = async (req: Request, res: Response): Promise<void> => {
  try {
    const obtenerTexto = (valor: unknown): string | undefined => typeof valor === 'string' ? valor : undefined;
    const historial = await loanService.obtenerHistorial({
      room: obtenerTexto(req.query.room),
      startDate: obtenerTexto(req.query.startDate),
      endDate: obtenerTexto(req.query.endDate)
    });
    res.status(200).json({ status: 'success', data: historial });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error al obtener el historial' });
  }
};
