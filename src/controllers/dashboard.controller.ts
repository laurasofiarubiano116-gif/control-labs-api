import { Request, Response } from 'express';

export class DashboardController {
  public static getSummary = (req: Request, res: Response): void => {
    // TODO: llamar al servicio y responder con los contadores de usuarios, ambientes activos, equipos operativos y novedades críticas sin resolver.
    res.status(501).json({
      success: false,
      message: 'El resumen del dashboard todavía no está implementado.'
    });
  };
}
