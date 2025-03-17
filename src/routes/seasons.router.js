import { Router } from "express";
import { SeasonsController } from "../controllers/seasons.controller.js";

const ROUTER = Router();
const seasonsController = new SeasonsController();

ROUTER.get("/", seasonsController.getSeason);
ROUTER.post("/", seasonsController.setSeasons);

export default ROUTER;