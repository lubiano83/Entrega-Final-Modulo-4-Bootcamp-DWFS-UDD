import { Router } from "express";
import ReservationsController from "../controllers/reservations.controller.js";

const ROUTER = Router();
const reservationsController = new ReservationsController();

ROUTER.get("/", reservationsController.getReservations);
ROUTER.post("/", reservationsController.createReservation);
ROUTER.delete("/", reservationsController.deleteAllReservations);
ROUTER.get("/:id", reservationsController.getReservationById);
ROUTER.delete("/:id", reservationsController.deleteReservationById);
ROUTER.patch("/:id", reservationsController.isAlreadyPaid);
ROUTER.put("/user/:id", reservationsController.updateReservationUserById);
ROUTER.put("/lodge/:id", reservationsController.updateReservationLodgeById);

export default ROUTER;