import {
  joinWaitlist,
  checkinDiner,
  leaveQueue,
} from "../../controllers/dinerController";
import { Request, Response } from "express";
import DinerModel from "../../models/Diner";
import { DinerService } from "../../services/DinerService";
import SocketClient from "../../configs/socket";
import { config, ERROR_CODE } from "../../configs/config";
import { SessionIdPayload } from "../../types/rest";

jest.mock("../../models/Diner");
jest.mock("../../services/DinerService");
jest.mock("../../configs/socket");

describe("Diner Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let json: jest.Mock;
  let sendStatus: jest.Mock;

  beforeEach(() => {
    json = jest.fn();
    sendStatus = jest.fn();

    req = {
      body: {},
      params: {},
    };

    res = {
      status: jest.fn().mockReturnThis(), // This allows chaining, like res.status().json()
      json,
      sendStatus,
    } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("joinWaitlist", () => {
    it("should return 400 if input is invalid", async () => {
      req.body = { sessionId: "", name: "", partySize: 0 };

      await joinWaitlist(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith({
        error: "Invalid input",
        errorCode: ERROR_CODE.UNAUTHORIZED,
      });
    });

    it("should add a diner if sessionId does not exist", async () => {
      req.body = {
        sessionId: "session123",
        name: "John Doe",
        partySize: 4,
      };

      (DinerModel.checkSessionIdExist as jest.Mock).mockResolvedValue(false); // Simulate sessionId not existing
      (DinerService.updateQueueList as jest.Mock).mockResolvedValue({
        availableSeats: 10,
        queueDiners: [],
      });

      await joinWaitlist(req as Request, res as Response);

      expect(DinerModel.addDiner).toHaveBeenCalledWith({
        session_id: "session123",
        name: "John Doe",
        party_size: 4,
        status: "queue",
        queue_time: expect.any(Date),
        service_time: 4 * config.SERVICE_TIME_PER_PERSON,
      });

      expect(res.sendStatus).toHaveBeenCalledWith(200);
    });

    it("should return 500 if an error occurs", async () => {
      req.body = {
        sessionId: "session123",
        name: "John Doe",
        partySize: 4,
      };

      (DinerModel.checkSessionIdExist as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await joinWaitlist(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(json).toHaveBeenCalledWith({
        error: "Error joining the waitlist",
        errorCode: ERROR_CODE.INTERNAL_SERVER_ERROR,
      });
    });
  });

  describe("checkinDiner", () => {
    it("should return 400 if sessionId is not provided", async () => {
      req.body = { sessionId: "" };

      await checkinDiner(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith({
        error: "Invalid Session Id",
        errorCode: ERROR_CODE.BAD_REQUEST,
      });
    });

    it("should check in a diner and send notifications if sessionId is provided", async () => {
      req.body = { sessionId: "session123" };

      const checkinResult = { service_time: 30 }; // Simulated check-in result
      const updateQueueListResult = {
        availableSeats: 10,
        queueDiners: [],
      };

      (DinerModel.checkInDiner as jest.Mock).mockResolvedValue(checkinResult); // Mock checkInDiner result
      (DinerService.updateQueueList as jest.Mock).mockResolvedValue(
        updateQueueListResult
      ); // Mock updateQueueList result

      await checkinDiner(req as Request, res as Response);

      // Verify that DinerModel.checkInDiner is called with sessionId
      expect(DinerModel.checkInDiner).toHaveBeenCalledWith("session123");

      // Verify that DinerService.updateQueueList is called
      expect(DinerService.updateQueueList).toHaveBeenCalledWith(true);

      // Verify that notifications are sent via SocketClient and DinerService
      expect(DinerService.sendNotifCheckinTurn).toHaveBeenCalledWith({
        availableSeats: 10,
        queueDiners: [],
      });

      expect(SocketClient.emitToSession).toHaveBeenCalledWith(
        "session123",
        "dinerCheckinSuccess"
      );

      // Verify that the timer service is started
      expect(DinerService.startTimerService).toHaveBeenCalledWith(
        "session123",
        30
      );

      // Verify that the response status is 200
      expect(res.sendStatus).toHaveBeenCalledWith(200);
    });

    it("should return 500 if an error occurs", async () => {
      req.body = { sessionId: "session123" };

      (DinerModel.checkInDiner as jest.Mock).mockRejectedValue(
        new Error("Database error")
      ); // Simulate error

      await checkinDiner(req as Request, res as Response);

      // Verify that the response status is 500
      expect(res.status).toHaveBeenCalledWith(500);
      expect(json).toHaveBeenCalledWith({
        error: "Error when checkin diner",
        errorCode: ERROR_CODE.INTERNAL_SERVER_ERROR,
      });
    });
  });

  describe("leaveQueue", () => {
    it("should return 400 if sessionId is not provided", async () => {
      req.params = { sessionId: "" };

      await leaveQueue(
        req as unknown as Request<SessionIdPayload>,
        res as Response
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith({
        error: "Invalid Session Id",
        errorCode: ERROR_CODE.BAD_REQUEST,
      });
    });

    it("should delete the diner and send notifications if sessionId is provided", async () => {
      req.params = { sessionId: "session123" };

      const updateQueueListResult = {
        availableSeats: 10,
        queueDiners: [],
      };

      (DinerModel.deleteDiner as jest.Mock).mockResolvedValue(true); // Mock deleteDiner result
      (DinerService.updateQueueList as jest.Mock).mockResolvedValue(
        updateQueueListResult
      ); // Mock updateQueueList result

      await leaveQueue(
        req as unknown as Request<SessionIdPayload>,
        res as Response
      );

      expect(DinerModel.deleteDiner).toHaveBeenCalledWith("session123");
      expect(DinerService.updateQueueList).toHaveBeenCalledWith(true);

      expect(DinerService.sendNotifCheckinTurn).toHaveBeenCalledWith({
        availableSeats: 10,
        queueDiners: [],
      });

      expect(SocketClient.emitToSession).toHaveBeenCalledWith(
        "session123",
        "dinerLeaveSuccess"
      );

      expect(res.sendStatus).toHaveBeenCalledWith(200);
    });

    it("should return 500 if an error occurs", async () => {
      req.params = { sessionId: "session123" };

      (DinerModel.deleteDiner as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await leaveQueue(
        req as unknown as Request<SessionIdPayload>,
        res as Response
      );

      expect(res.status).toHaveBeenCalledWith(500);
      expect(json).toHaveBeenCalledWith({
        error: "Error when leaving waitlist",
        errorCode: ERROR_CODE.INTERNAL_SERVER_ERROR,
      });
    });
  });
});
