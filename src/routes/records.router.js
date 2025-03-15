import { Router } from "express";
import RecordsController from "../controllers/records.controller.js";

const ROUTER = Router();
const recordsController = new RecordsController();

ROUTER.get("/", recordsController.getRecords);
ROUTER.delete("/", recordsController.deleteAllRecords);
ROUTER.delete("/:id", recordsController.deleteRecordById);

export default ROUTER;