import { Request, Response, NextFunction } from 'express';
import { ICreateEquipmentDTO } from '../dtos/equipment.dto';

const isCreateEquipmentDTO = (value: unknown): value is ICreateEquipmentDTO => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const equipment = value as Record<string, unknown>;
  return (
    typeof equipment.serial === 'string' &&
    equipment.serial.trim() !== '' &&
    typeof equipment.tipo === 'string' &&
    equipment.tipo.trim() !== '' &&
    typeof equipment.ambienteId === 'number' &&
    Number.isInteger(equipment.ambienteId)
  );
};

export const validateEquipmentPayload = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const body: unknown = req.body;

  if (!isCreateEquipmentDTO(body)) {
    res.status(400).json({
      success: false,
      error: 'Datos del equipo inválidos.'
    });
    return;
  }

  next();
