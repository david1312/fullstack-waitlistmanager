import { Router } from "express";

import { Server } from "socket.io";
import { joinWaitlist } from "../controllers/dinerController";

const router = Router();

export const createDinerRoutes = (io: Server) => {
  router.post("/join-waitlist", (req, res) => joinWaitlist(req, res, io));
  return router;
};

export default createDinerRoutes;
