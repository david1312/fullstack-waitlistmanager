import { Request, Response } from "express";
import DinerModel from "../models/Diner";
import { config, ERROR_CODE, NOTIFICATION_MSG } from "../configs/config";
import { ErrorResponse, SuccessResponse } from "../types/response";
import SocketClient from "../configs/socket";
interface JoinWaitlistPayload {
  sessionId: string;
  name: string;
  partySize: number;
}

interface CheckinPayload {
  sessionId: string;
}

export const joinWaitlist = async (
  req: Request<{}, {}, JoinWaitlistPayload>,
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
    return res
      .status(400)
      .json({ error: "Invalid input", errorCode: ERROR_CODE.UNAUTHORIZED });
  }

  try {
    // Check session id exist to handle refresh on client side
    const sessionIdExist = await DinerModel.checkSessionIdExist(sessionId);
    if (!sessionIdExist) {
      console.log("session Id does not exists, inserting new diner...");
      await DinerModel.addDiner({
        session_id: sessionId,
        name: name,
        party_size: partySize,
        status: "queue",
        queue_time: new Date(),
        service_time: partySize * config.SERVICE_TIME_PER_PERSON,
      });
    }

    // collect data before emit event to client
    const queueDiners = await DinerModel.getAllQueueDiners();
    const checkedInPartySize = await DinerModel.getTotalCheckedInPartySize();
    const availableSeats = config.RESTAURANT_CAPACITY - checkedInPartySize;

    SocketClient.emit("dinerUpdateQueueList", {
      queueDiners,
      availableSeats,
      isFirstRowRemoved: false,
    });
    if (
      queueDiners.length > 0 &&
      availableSeats >= partySize &&
      sessionId === queueDiners[0].session_id
    ) {
      SocketClient.emitToSession(queueDiners[0].session_id, "dinerYourTurn");
      SocketClient.emitToSession(
        queueDiners[0].session_id,
        "dinerNotification",
        {
          message: NOTIFICATION_MSG.YOUR_TURN,
        }
      );
    }
    res.sendStatus(200);
  } catch (error) {
    console.error("error addWaitlist:", error);
    res.status(500).json({
      error: "Error joining the waitlist",
      errorCode: ERROR_CODE.INTERNAL_SERVER_ERROR,
    });
  }
};

export const checkinDiner = async (
  req: Request<{}, {}, CheckinPayload>,
  res: Response<SuccessResponse | ErrorResponse>
) => {
  const { sessionId } = req.body;
  if (!sessionId) {
    return res
      .status(400)
      .json({ error: "Invalid input", errorCode: ERROR_CODE.BAD_REQUEST });
  }

  try {
    // Check session id exist to handle refresh on client side
    const checkinResult = await DinerModel.checkInDiner(sessionId);
    // collect data before emit event to client
    const queueDiners = await DinerModel.getAllQueueDiners();
    SocketClient.emit("dinerUpdateQueueList", {
      queueDiners,
      availableSeats: checkinResult.available_seat,
      isFirstRowRemoved: false,
    });

    // info checkin success here
    SocketClient.emitToSession(sessionId, "dinerCheckinSuccess", {
      serviceTime: checkinResult.service_time,
    });

    res.sendStatus(200);
  } catch (error) {
    console.error("error checkinDiner:", error);
    res.status(500).json({
      error: "Error checkin diner",
      errorCode: ERROR_CODE.INTERNAL_SERVER_ERROR,
    });
  }
};
