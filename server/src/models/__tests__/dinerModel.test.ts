import DinerModel from "../dinerModel";
import Database from "../../configs/db"; // This is your database configuration file
import {
  AddDinerPayload,
  UpdateDinerQueueTimePayload,
} from "../../types/schema";
import { QueueDinerResponse } from "../../types/rest";

jest.mock("../../configs/db"); // Mock the database

describe("DinerModel", () => {
  let dbMock: any;

  beforeEach(() => {
    // Get the mocked instance of the database
    dbMock = {
      query: jest.fn(),
    };

    // Mock the Database.getInstance() to return the dbMock object
    (Database.getInstance as jest.Mock).mockReturnValue(dbMock);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe("addDiner", () => {
    it("should add a diner successfully", async () => {
      const dinerPayload: AddDinerPayload = {
        session_id: "session123",
        name: "John Doe",
        party_size: 4,
        status: "queue",
        queue_time: new Date(),
        service_time: 30,
      };

      await DinerModel.addDiner(dinerPayload);

      expect(dbMock.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO diners"),
        [
          dinerPayload.session_id,
          dinerPayload.name,
          dinerPayload.party_size,
          dinerPayload.status,
          expect.any(Date), // Handle dynamic date with expect.any(Date)
          dinerPayload.service_time,
        ]
      );
    });

    it("should throw an error if the query fails", async () => {
      const dinerPayload: AddDinerPayload = {
        session_id: "session123",
        name: "John Doe",
        party_size: 4,
        status: "queue",
        queue_time: new Date(),
        service_time: 30,
      };

      // Simulate a database error
      dbMock.query.mockRejectedValueOnce(new Error("Database error"));

      // Check that an error is thrown when calling addDiner
      await expect(DinerModel.addDiner(dinerPayload)).rejects.toThrow(
        "Error addDiner: Error: Database error"
      );
    });
  });

  describe("checkSessionIdExist", () => {
    it("should return true if the session ID exists", async () => {
      // Mock the database response to indicate the session ID exists
      const mockResponse = { rows: [{ exists: true }] };
      dbMock.query.mockResolvedValueOnce(mockResponse);

      // Call the method
      const sessionId = "session123";
      const exists = await DinerModel.checkSessionIdExist(sessionId);

      // Check that the db query method was called with the correct query and parameter
      expect(dbMock.query).toHaveBeenCalledWith(
        `SELECT EXISTS (SELECT session_id FROM diners WHERE session_id = $1)`,
        [sessionId]
      );

      // Check that the method returns true
      expect(exists).toBe(true);
    });

    it("should return false if the session ID does not exist", async () => {
      // Mock the database response to indicate the session ID does not exist
      const mockResponse = { rows: [{ exists: false }] };
      dbMock.query.mockResolvedValueOnce(mockResponse);

      // Call the method
      const sessionId = "session123";
      const exists = await DinerModel.checkSessionIdExist(sessionId);

      // Check that the db query method was called with the correct query and parameter
      expect(dbMock.query).toHaveBeenCalledWith(
        `SELECT EXISTS (SELECT session_id FROM diners WHERE session_id = $1)`,
        [sessionId]
      );

      // Check that the method returns false
      expect(exists).toBe(false);
    });

    it("should throw an error if the query fails", async () => {
      // Simulate a database error
      dbMock.query.mockRejectedValueOnce(new Error("Database error"));

      // Call the method and expect an error to be thrown
      await expect(
        DinerModel.checkSessionIdExist("session123")
      ).rejects.toThrow("Error checkSessionIdExist: Error: Database error");
    });
  });

  describe("getAllQueueDiners", () => {
    it("should return all diners in the queue", async () => {
      // Mock the database response with a list of diners
      const mockResponse = {
        rows: [
          {
            session_id: "session1",
            name: "David",
            party_size: 4,
            queue_time: new Date(),
          },
          {
            session_id: "session2",
            name: "TaCheck",
            party_size: 2,
            queue_time: new Date(),
          },
        ],
      };
      dbMock.query.mockResolvedValueOnce(mockResponse);

      // Call the method
      const diners = await DinerModel.getAllQueueDiners();

      // Check that the db query method was called with the correct query
      expect(dbMock.query).toHaveBeenCalledWith(
        `SELECT session_id, name, party_size, queue_time FROM diners WHERE status = 'queue' order by queue_time, name ASC`
      );

      // Check that the method returns the correct list of diners
      expect(diners).toEqual(mockResponse.rows as QueueDinerResponse[]);
    });

    it("should return an empty array if no diners are in the queue", async () => {
      // Mock the database response with an empty list
      const mockResponse = { rows: [] };
      dbMock.query.mockResolvedValueOnce(mockResponse);

      // Call the method
      const diners = await DinerModel.getAllQueueDiners();

      // Check that the db query method was called
      expect(dbMock.query).toHaveBeenCalledWith(
        `SELECT session_id, name, party_size, queue_time FROM diners WHERE status = 'queue' order by queue_time, name ASC`
      );

      // Check that the method returns an empty array
      expect(diners).toEqual([]);
    });

    it("should throw an error if the query fails", async () => {
      // Simulate a database error
      dbMock.query.mockRejectedValueOnce(new Error("Database error"));

      // Call the method and expect an error to be thrown
      await expect(DinerModel.getAllQueueDiners()).rejects.toThrow(
        "Error getAllQueueDiners: Error: Database error"
      );
    });
  });

  describe("getTotalCheckedInPartySize", () => {
    it("should return the total checked-in party size", async () => {
      // Mock the database response
      const mockResponse = { rows: [{ total_party_size: "10" }] };
      dbMock.query.mockResolvedValueOnce(mockResponse);

      // Call the method
      const totalPartySize = await DinerModel.getTotalCheckedInPartySize();

      // Check that the db query method was called with the correct query
      expect(dbMock.query).toHaveBeenCalledWith(
        `SELECT SUM(party_size) AS total_party_size FROM diners WHERE status = 'diner'`
      );

      // Check that the result is correct
      expect(totalPartySize).toBe(10);
    });

    it("should return 0 if no diners are checked in", async () => {
      // Mock the database response with no checked-in diners
      const mockResponse = { rows: [{ total_party_size: null }] };
      dbMock.query.mockResolvedValueOnce(mockResponse);

      // Call the method
      const totalPartySize = await DinerModel.getTotalCheckedInPartySize();

      // Check that the db query method was called
      expect(dbMock.query).toHaveBeenCalledWith(
        `SELECT SUM(party_size) AS total_party_size FROM diners WHERE status = 'diner'`
      );

      // Check that the result is 0 when no party size is available
      expect(totalPartySize).toBe(0);
    });

    it("should throw an error if the query fails", async () => {
      // Simulate a database error
      dbMock.query.mockRejectedValueOnce(new Error("Database error"));

      // Check that an error is thrown when calling getTotalCheckedInPartySize
      await expect(DinerModel.getTotalCheckedInPartySize()).rejects.toThrow(
        "Error getTotalCheckedInPartySize: Error: Database error"
      );
    });
  });

  describe("updateQueueTime", () => {
    it("should update the queue time and counter successfully", async () => {
      const payload: UpdateDinerQueueTimePayload = {
        session_id: "session123",
        queue_time: new Date(),
        queue_counter: 5,
      };

      // Call the method
      await DinerModel.updateQueueTime(payload);

      // Check that the db query method was called with the correct query and values
      expect(dbMock.query).toHaveBeenCalledWith(
        `UPDATE diners set queue_time = $1, queue_counter = $2 where session_id = $3 and status ='queue'`,
        [payload.queue_time, payload.queue_counter, payload.session_id]
      );
    });

    it("should throw an error if the query fails", async () => {
      const payload: UpdateDinerQueueTimePayload = {
        session_id: "session123",
        queue_time: new Date(),
        queue_counter: 5,
      };

      // Simulate a database error
      dbMock.query.mockRejectedValueOnce(new Error("Database error"));

      // Check that an error is thrown when calling updateQueueTime
      await expect(DinerModel.updateQueueTime(payload)).rejects.toThrow(
        "Error updateQueueTime: Error: Database error"
      );
    });
  });

  describe("getQueueCounter", () => {
    it("should return the queue counter for a valid session_id", async () => {
      // Mock the database response with a valid queue_counter
      const mockResponse = { rows: [{ queue_counter: 5 }] };
      dbMock.query.mockResolvedValueOnce(mockResponse);

      // Call the method
      const sessionId = "session123";
      const queueCounter = await DinerModel.getQueueCounter(sessionId);

      // Check that the db query method was called with the correct query and session_id
      expect(dbMock.query).toHaveBeenCalledWith(
        `SELECT queue_counter FROM diners WHERE session_id = $1`,
        [sessionId]
      );

      // Check that the result is correct
      expect(queueCounter).toBe(5);
    });

    it("should return 0 if no diner is found with the session_id", async () => {
      // Mock the database response with no rows found
      const mockResponse = { rows: [] };
      dbMock.query.mockResolvedValueOnce(mockResponse);

      // Call the method
      const sessionId = "session123";
      const queueCounter = await DinerModel.getQueueCounter(sessionId);

      // Check that the db query method was called with the correct query and session_id
      expect(dbMock.query).toHaveBeenCalledWith(
        `SELECT queue_counter FROM diners WHERE session_id = $1`,
        [sessionId]
      );

      // Check that the result is 0 when no rows are found
      expect(queueCounter).toBe(0);
    });

    it("should throw an error if the query fails", async () => {
      // Simulate a database error
      dbMock.query.mockRejectedValueOnce(new Error("Database error"));

      // Call the method and expect an error to be thrown
      await expect(DinerModel.getQueueCounter("session123")).rejects.toThrow(
        "Error getQueueCounter: Error: Database error"
      );
    });
  });

  describe("deleteDiner", () => {
    it("should delete a diner successfully", async () => {
      // Call the method
      const sessionId = "session123";
      await DinerModel.deleteDiner(sessionId);

      // Check that the query method was called with the correct SQL and sessionId
      expect(dbMock.query).toHaveBeenCalledWith(
        `DELETE FROM diners WHERE session_id = $1`,
        [sessionId]
      );
    });

    it("should throw an error if the query fails", async () => {
      // Simulate a database error
      dbMock.query.mockRejectedValueOnce(new Error("Database error"));

      // Call the method and expect it to throw an error
      const sessionId = "session123";
      await expect(DinerModel.deleteDiner(sessionId)).rejects.toThrow(
        "Error deleteDiner: Error: Database error"
      );
    });
  });
});
