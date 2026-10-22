import { Request, Response } from 'express';

export class IncidentController {
  public static createIncident = (req: Request, res: Response): void => {
    // TODO: llamar al servicio con req.body (equipo o ambiente asociado) y responder 201 con la novedad creada.
    res.status(501).json({
      success: false,
      message: 'El registro de novedades todavía no está implementado.'
    });
  };

  public static getIncidents = (req: Request, res: Response): void => {
    // TODO: llamar al servicio y responder con el historial de novedades.
    res.status(501).json({
      success: false,
      message: 'El historial de novedades todavía no está implementado.'
    });
  };

  public static updateIncident = (req: Request, res: Response): void => {
    const { id } = req.params;
    // TODO: pasar id y el estado de req.body (pendiente, en proceso o resuelto) a la operación de actualización parcial.
    res.status(501).json({
      success: false,
      message: `La actualización de la novedad ${id} todavía no está implementada.`
    });
  };
}
