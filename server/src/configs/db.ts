import { Pool } from "pg";
import { config } from "./config";

class Database {
  private static instance: Pool;

  private constructor() {}

  static getInstance(): Pool {
    if (!Database.instance) {
      Database.instance = new Pool({
        user: config.POSTGRES_USER,
        host: config.POSTGRES_HOST,
        database: config.POSTGRES_DB,
        password: config.POSTGRES_PASSWORD,
        port: config.POSTGRES_PORT,
        max: config.POSTGRES_MAX_CONN,
      });
    }
    return Database.instance;
  }

  static async connect(): Promise<void> {
    const db = Database.getInstance();
    try {
      await db.connect();
      console.log("PostgreSQL connected");
    } catch (error) {
      console.error("PostgreSQL connection error", error);
    }
  }

  static async disconnect() {
    if (Database.instance) {
      try {
        console.log("Closing database connection pool...");
        await Database.instance.end(); // Wait until the pool closes
      } catch (error) {
        console.error("Error closing the database connection pool:", error);
      }
    } else {
      console.log("No active database connection pool to close.");
    }
  }
}

export default Database;
