import { Router } from "express";
import {
  checkinDiner,
  joinWaitlist,
  leaveQueue,
} from "../controllers/dinerController";

const router = Router();

export const createDinerRoutes = () => {
  router.post("/join-waitlist", (req, res) => joinWaitlist(req, res));
  router.put("/checkin", (req, res) => checkinDiner(req, res));
  router.delete("/leave/:sessionId", (req, res) => leaveQueue(req, res));

  return router;
};

export default createDinerRoutes;
