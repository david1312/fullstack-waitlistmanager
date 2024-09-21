import Database from "../configs/db";
import { PoolClient } from "pg";
import { ErrorResponse } from "../types/response";

interface CheckInResponse {
  session_id: string;
  name: string;
  party_size: number;
  status: string;
}

interface QueueDinerResponse {
  session_id: string;
  name: string;
  party_size: number;
  queue_time: Date;
}

interface Diner {
  session_id: string;
  name: string;
  party_size: number;
  status: "queue" | "diner";
  check_in_time?: Date;
  queue_time: Date;
  service_time: number;
}

class DinerModel {
  static async addDiner(diner: Diner) {
    const db = Database.getInstance();
    const query = `
          INSERT INTO diners (session_id, name, party_size, status, queue_time, service_time)
          VALUES ($1, $2, $3, $4, $5, $6);
        `;
    const values = [
      diner.session_id,
      diner.name,
      diner.party_size,
      diner.status,
      diner.queue_time,
      diner.service_time,
    ];

    try {
      await db.query(query, values);
    } catch (error) {
      throw new Error(`Error addDiner: ${error}`);
    }
  }

  static async checkSessionIdExist(session_id: string): Promise<boolean> {
    const db = Database.getInstance();
    const query = `
      SELECT EXISTS (
        SELECT session_id 
        FROM diners 
        WHERE session_id = $1
      );
    `;

    try {
      const result = await db.query(query, [session_id]);
      return result.rows[0].exists; // `exists` will be true if a row was found, false otherwise
    } catch (error) {
      throw new Error(`Error checkSessionIdExist: ${error}`);
    }
  }

  // Define the return type as QueueDiner[]
  static async getAllQueueDiners(): Promise<QueueDinerResponse[]> {
    const db = Database.getInstance();
    const query = `SELECT session_id, name, party_size, queue_time FROM diners WHERE status = 'queue' order by queue_time, name ASC`;

    try {
      const result = await db.query(query);
      return result.rows as QueueDinerResponse[];
    } catch (error) {
      throw new Error(`Error getAllQueueDiners: ${error}`);
    }
  }

  static async getTotalCheckedInPartySize(): Promise<number> {
    const db = Database.getInstance();
    const query = `
      SELECT SUM(party_size) AS total_party_size 
      FROM diners 
      WHERE status = 'diner';
    `;

    try {
      const result = await db.query(query);
      return parseInt(result.rows[0].total_party_size || "0", 10);
    } catch (error) {
      throw new Error(`Error getTotalCheckedInPartySize: ${error}`);
    }
  }

  // Check-in a diner by updating their status with a transaction
  static async checkInDiner(
    session_id: string
  ): Promise<CheckInResponse | null> {
    const db = Database.getInstance();
    const client: PoolClient = await db.connect(); // Get a client for transactions
    const totalSeats = 10; // Maximum available seats

    try {
      await client.query("BEGIN"); // Start transaction

      // Get the total current party size of all diners with status 'diner'
      const availableSeatsQuery = `
        SELECT SUM(party_size) AS total_party_size 
        FROM diners 
        WHERE status = 'diner';
      `;
      const availableSeatsResult = await client.query(availableSeatsQuery);
      const currentPartySize = parseInt(
        availableSeatsResult.rows[0].total_party_size || "0",
        10
      );

      // Check if adding the new party size exceeds available seats
      const dinerQuery = `SELECT * FROM diners WHERE session_id = $1 FOR UPDATE`;
      const dinerResult = await client.query(dinerQuery, [session_id]);

      if (dinerResult.rows.length === 0) {
        throw new Error("Diner not found or already checked in.");
      }

      const diner = dinerResult.rows[0];
      const newTotalPartySize = currentPartySize + diner.party_size;

      if (newTotalPartySize > totalSeats) {
        await client.query("ROLLBACK"); // Rollback transaction if seats are exceeded
        throw new Error("Not enough available seats for this party size.");
      }

      // Update diner status to "diner"
      const updateDinerQuery = `
        UPDATE diners
        SET status = 'diner', check_in_time = NOW()
        WHERE session_id = $1 
        RETURNING session_id, name, party_size, status;
      `;
      const updateResult = await client.query(updateDinerQuery, [session_id]);

      await client.query("COMMIT"); // Commit transaction
      return updateResult.rows[0]; // Return the updated diner
    } catch (error) {
      await client.query("ROLLBACK"); // Rollback transaction on error
      throw new Error(`Error checkInDiner: ${error}`);
    } finally {
      client.release(); // Release the client back to the pool
    }
  }
}

export default DinerModel;
