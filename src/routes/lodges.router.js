import { Router } from "express";
import LodgesController from "../controllers/lodges.controller.js";

const ROUTER = Router();
const lodgesController = new LodgesController();

ROUTER.get("/", lodgesController.getLodges);
ROUTER.post("/", lodgesController.createLodge);
ROUTER.delete("/", lodgesController.deleteAllLodge);
ROUTER.get("/:id", lodgesController.getLodgeById);
ROUTER.delete("/:id", lodgesController.deleteLodge);
ROUTER.put("/:id", lodgesController.updateLodge);

export default ROUTER;