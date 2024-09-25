import { Request, Response } from "express";
import DinerModel from "../models/Diner";
import { config, ERROR_CODE } from "../configs/config";
import {
  ErrorResponse,
  JoinWaitlistPayload,
  SessionIdPayload,
  SuccessResponse,
} from "../types/rest";
import SocketClient from "../configs/socket";
import { DinerService } from "../services/DinerService";

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
    // Updating queue list data across clients
    const result = await DinerService.updateQueueList(false);
    await DinerService.sendNotifCheckinTurn({
      availableSeats: result.availableSeats,
      queueDiners: result.queueDiners,
    });

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
  req: Request<{}, {}, SessionIdPayload>,
  res: Response<SuccessResponse | ErrorResponse>
) => {
  const { sessionId } = req.body;
  if (!sessionId) {
    return res
      .status(400)
      .json({ error: "Invalid Session Id", errorCode: ERROR_CODE.BAD_REQUEST });
  }

  try {
    const checkinResult = await DinerModel.checkInDiner(sessionId);
    const result = await DinerService.updateQueueList(true);
    // notify next party if their next turn
    await DinerService.sendNotifCheckinTurn({
      availableSeats: result.availableSeats,
      queueDiners: result.queueDiners,
    });

    // notif checkin success
    SocketClient.emitToSession(sessionId, "dinerCheckinSuccess");
    DinerService.startTimerService(sessionId, checkinResult.service_time);
    res.sendStatus(200);
  } catch (error) {
    console.error("error checkinDiner:", error);
    res.status(500).json({
      error: "Error when checkin diner",
      errorCode: ERROR_CODE.INTERNAL_SERVER_ERROR,
    });
  }
};

export const leaveQueue = async (
  req: Request<SessionIdPayload>,
  res: Response<SuccessResponse | ErrorResponse>
) => {
  const { sessionId } = req.params;
  if (!sessionId) {
    return res
      .status(400)
      .json({ error: "Invalid Session Id", errorCode: ERROR_CODE.BAD_REQUEST });
  }
  try {
    await DinerModel.deleteDiner(sessionId);
    // notify next party immediately if next
    const result = await DinerService.updateQueueList(true);
    // notify next party if their next turn
    await DinerService.sendNotifCheckinTurn({
      availableSeats: result.availableSeats,
      queueDiners: result.queueDiners,
    });

    // notif leave success
    SocketClient.emitToSession(sessionId, "dinerLeaveSuccess");
    res.sendStatus(200);
  } catch (error) {
    console.error("error leaveQueue:", error);
    res.status(500).json({
      error: "Error when leaving waitlist",
      errorCode: ERROR_CODE.INTERNAL_SERVER_ERROR,
    });
  }
};
