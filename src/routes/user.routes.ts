import { Router } from 'express';
import {
  obtenerUsuarios,
  obtenerUsuario,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
} from '../controllers/user.controller';
import { validarId } from '../middlewares/validateId.middleware';

const router = Router();

router.get('/', obtenerUsuarios);
router.post('/', crearUsuario);
router.get('/:id', validarId, obtenerUsuario);
router.patch('/:id', validarId, actualizarUsuario);
router.delete('/:id', validarId, eliminarUsuario);

export default router;
