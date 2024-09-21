import { Request, Response } from "express";
import DinerModel from "../models/Diner";
import { Server } from "socket.io";
import { config, NOTIFICATION_MSG } from "../configs/config";
import { DinerJoinWaitlistPayload } from "../types/ws-event";
import { ErrorResponse, SuccessResponse } from "../types/response";
interface JoinWaitlistBody {
  sessionId: string;
  name: string;
  partySize: number;
}

const activeTimers = new Map<string, NodeJS.Timeout>();

export const joinWaitlist = async (
  req: Request<{}, {}, JoinWaitlistBody>, // Typed Request body
  res: Response<SuccessResponse | ErrorResponse>,
  io: Server
) => {
  const { sessionId, name, partySize } = req.body;

  // Validation
  if (
    !sessionId ||
    !name ||
    !partySize ||
    isNaN(Number(partySize)) ||
    partySize <= 0
  ) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    // check session id exist
    const sessionIdExist = await DinerModel.checkSessionIdExist(sessionId);
    if (!sessionIdExist) {
      console.log("session Id does not exists, inserting new diner...");
      await DinerModel.addDiner({
        session_id: sessionId,
        name: name,
        party_size: partySize,
        status: "queue",
        queue_time: new Date(),
        service_time: partySize * config.SERVICE_TIME_PER_PERSON, // Example: 30 minutes for dining
      });
    }

    // collect data for emit websocket event
    const queueDiners = await DinerModel.getAllQueueDiners();
    const checkedInPartySize = await DinerModel.getTotalCheckedInPartySize();
    const availableSeats = config.RESTAURANT_CAPACITY - checkedInPartySize;

    // Emit WebSocket event
    console.log(queueDiners);
    io.emit("dinerJoinWaitlist", {
      queueDiners,
      availableSeats,
      maxCapacity: config.RESTAURANT_CAPACITY,
    });

    console.log({
      a: queueDiners[0].session_id,
      b: sessionId,
      c: availableSeats,
      partySize,
    });
    if (
      queueDiners.length > 0 &&
      queueDiners[0].session_id === sessionId &&
      availableSeats >= partySize
    ) {
      io.to(sessionId).emit("dinerYourTurn");
      io.to(sessionId).emit("dinerNotification", {
        message: NOTIFICATION_MSG.YOUR_TURN,
      });

      console.log("this guy triggering ", name, partySize);
    } else {
      console.log("this guy should waiting", name, partySize);
    }

    io.emit("babi", { asukontol: sessionId });

    res.sendStatus(200);
  } catch (error) {
    console.error("error addWaitlist:", error);
    res.status(500).json({ error: "Error joining the waitlist" });
  }
};
