import { Router } from "express";
import ReservasController from "../controllers/reservas.controller.js";

const ROUTER = Router();
const reservasController = new ReservasController();

ROUTER.get("/", reservasController.readFile);
ROUTER.post("/", reservasController.createFile);
ROUTER.delete("/", reservasController.deleteAllFile);
ROUTER.put("/:id", reservasController.updateFile);
ROUTER.delete("/:id", reservasController.deleteFile);

export default ROUTER;