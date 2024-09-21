import { Router } from "express";

import { Server } from "socket.io";
import { joinWaitlist } from "../controllers/dinerController";

const router = Router();

export const createDinerRoutes = () => {
  router.post("/join-waitlist", (req, res) => joinWaitlist(req, res));
  return router;
};

export default createDinerRoutes;
