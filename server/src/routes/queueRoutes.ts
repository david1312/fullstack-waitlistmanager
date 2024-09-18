import { Router } from "express";
import { getQueue, addToQueue } from "../controllers/queueController";

const router = Router();

router.get("/queue", getQueue);
router.post("/queue", addToQueue);

export default router;
