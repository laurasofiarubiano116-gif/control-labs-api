import jwt from 'jsonwebtoken';

type UserRole = 'ADMIN' | 'GUARDA' | 'INSTRUCTOR';

interface User {
  id: number;
  nombre: string;
  email: string;
  password: string;
  rol: UserRole;
}

const users: User[] = [
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
  login(email: string, password: string) {
    const user = users.find(
      (item) => item.email === email && item.password === password
    );

    if (!user) {
      throw Object.assign(
        new Error('Correo o contraseña incorrectos'),
        { statusCode: 401 }
      );
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw Object.assign(
        new Error('La configuración JWT no está disponible'),
        { statusCode: 500 }
      );
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        rol: user.rol
      },
      secret,
      { expiresIn: '2h' }
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

export default new AuthService();