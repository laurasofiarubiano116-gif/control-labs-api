import { Router } from "express";
import { obtenerUsuarios, obtenerUsuario, crearUsuario, actualizarUsuario, eliminarUsuario } from "../controllers/user.controller";
const router = Router();
router.get("/", obtenerUsuarios);
router.post("/", crearUsuario);
router.get("/:id", obtenerUsuario);
router.patch("/:id", actualizarUsuario);
router.delete("/:id", eliminarUsuario);
export default router;
