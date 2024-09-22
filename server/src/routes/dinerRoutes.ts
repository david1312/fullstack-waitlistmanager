import { Router } from "express";
import { checkinDiner, joinWaitlist } from "../controllers/dinerController";

const router = Router();

export const createDinerRoutes = () => {
  router.post("/join-waitlist", (req, res) => joinWaitlist(req, res));
  router.put("/checkin", (req, res) => checkinDiner(req, res));
  return router;
};

export default createDinerRoutes;
