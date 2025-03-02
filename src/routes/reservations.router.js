import { Router } from "express";
import ReservationsController from "../controllers/reservations.controller.js";

const ROUTER = Router();
const reservationsController = new ReservationsController();

ROUTER.get("/", reservationsController.getReservations);
ROUTER.post("/", reservationsController.createReservation);
ROUTER.delete("/", reservationsController.deleteAllReservations);
ROUTER.get("/:id", reservationsController.getReservationById);
ROUTER.put("/:id", reservationsController.updateReservation);
ROUTER.delete("/:id", reservationsController.deleteReservation);

export default ROUTER;