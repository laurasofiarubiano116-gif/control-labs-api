const jwt = require('jsonwebtoken');

const users = [
  {
    id: 1,
    nombre: 'Administrador',
    email: 'admin@controllabs.com',
    password: '123456',
    rol: 'ADMIN'
  },
  {
    id: 2,
    nombre: 'Guarda',
    email: 'guarda@controllabs.com',
    password: '123456',
    rol: 'GUARDA'
  },
  {
    id: 3,
    nombre: 'Instructor SENA',
    email: 'instructor@controllabs.com',
    password: '123456',
    rol: 'INSTRUCTOR'
  }
];

class AuthService {
  login(email, password) {
    const user = users.find(
      user => user.email === email && user.password === password
    );

    if (!user) {
      const error = new Error('Correo o contraseña incorrectos');
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        rol: user.rol
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '2h'
      }
    );

    return {
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      },
      token
    };
  }
}

module.exports = new AuthService();