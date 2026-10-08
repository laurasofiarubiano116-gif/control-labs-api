const authService = require('../services/authService');

class AuthController {
  login(req, res) {
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
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        status: 'error',
        message: error.message
      });
    }
  }
}

module.exports = new AuthController();