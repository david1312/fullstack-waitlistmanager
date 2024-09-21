import { Request, Response } from "express";
import DinerModel from "../models/Diner";
import { config, NOTIFICATION_MSG } from "../configs/config";
import { ErrorResponse, SuccessResponse } from "../types/response";
import SocketSingleton from "../configs/socket";
interface JoinWaitlistBody {
  sessionId: string;
  name: string;
  partySize: number;
}

export const joinWaitlist = async (
  req: Request<{}, {}, JoinWaitlistBody>, // Typed Request body
  res: Response<SuccessResponse | ErrorResponse>
) => {
  const { sessionId, name, partySize } = req.body;

  // Validation
  if (
    !sessionId ||
    !name ||
    name.length > config.MAX_LENGTH_NAME ||
    !partySize ||
    isNaN(Number(partySize)) ||
    partySize <= 0 ||
    partySize > config.MAX_PARTY_SIZE
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
    SocketSingleton.emit("dinerJoinWaitlist", {
      queueDiners,
      availableSeats,
      maxCapacity: config.RESTAURANT_CAPACITY,
    });

    if (
      queueDiners.length > 0 &&
      queueDiners[0].session_id === sessionId &&
      availableSeats >= partySize
    ) {
      SocketSingleton.emitToSession(sessionId, "dinerYourTurn");
      SocketSingleton.emitToSession(sessionId, "dinerNotification", {
        message: NOTIFICATION_MSG.YOUR_TURN,
      });
    }
    res.sendStatus(200);
  } catch (error) {
    console.error("error addWaitlist:", error);
    res.status(500).json({ error: "Error joining the waitlist" });
  }
};
