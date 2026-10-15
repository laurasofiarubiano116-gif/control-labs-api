import { Request, Response } from 'express';
import authService from '../services/auth.service';

class AuthController {
  login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          status: 'error',
          message: 'El correo y la contraseña son obligatorios'
        });
      }

      const result = authService.login(email, password);

      return res.status(200).json({
        status: 'success',
        message: 'Inicio de sesión exitoso',
        data: result
      });
    } catch (error: unknown) {
      const err = error as Error & { statusCode?: number };

      return res.status(err.statusCode || 500).json({
        status: 'error',
        message: err.message || 'Error interno del servidor'
      });
    }
  }
}

export default new AuthController();