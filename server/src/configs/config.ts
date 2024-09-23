import dotenv from "dotenv";
dotenv.config();

export const config: Readonly<{
  // .env level config
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_DB: string;
  POSTGRES_HOST: string;
  POSTGRES_PORT: number;
  POSTGRES_MAX_CONN: number;
  SERVER_PORT: number;
  CORS_ORIGIN: string;

  // application level config
  API_BASE_URL: string;
  SERVICE_TIME_PER_PERSON: number;
  RESTAURANT_CAPACITY: number;
  NOTIF_FIRST_LATE: number;
  NOTIF_REQUEUE: number;
  REQUEUE_CHANCE: number;
  MAX_LENGTH_NAME: number;
  MAX_PARTY_SIZE: number;
}> = {
  POSTGRES_USER: process.env.POSTGRES_USER || "",
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || "",
  POSTGRES_DB: process.env.POSTGRES_DB || "",
  POSTGRES_HOST: process.env.POSTGRES_HOST || "localhost",
  POSTGRES_PORT: parseInt(process.env.POSTGRES_PORT || "5432", 10),
  POSTGRES_MAX_CONN: 10,
  SERVER_PORT: parseInt(process.env.SERVER_PORT || "8080", 10),
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",

  API_BASE_URL: "/api",
  SERVICE_TIME_PER_PERSON: 3, //seconds
  RESTAURANT_CAPACITY: 10,
  NOTIF_FIRST_LATE: 10, // seconds
  NOTIF_REQUEUE: 20, // seconds
  REQUEUE_CHANCE: 1,
  MAX_LENGTH_NAME: 30,
  MAX_PARTY_SIZE: 10,
};

interface NotificationMsg {
  ONE_AHEAD: string;
  YOUR_TURN: string;
  FIRST_LATE: string;
  REQUEUE: string;
  KICKED: string;
}

export const NOTIFICATION_MSG: Readonly<NotificationMsg> = {
  ONE_AHEAD: "You’re almost up! Just one party ahead of you.",
  YOUR_TURN: "It’s your turn! Please check in now to secure your spot.",
  FIRST_LATE:
    'Reminder: You haven’t checked in yet. Click the "Check-in" button within 10 seconds to keep your spot.',
  REQUEUE: "Your check-in time expired. You’ve been re-added to the queue.",
  KICKED:
    "You missed your second chance to check in. You’ve been removed from the queue.",
};

// custom error code for fe handler TODO
interface ErrCode {
  UNAUTHORIZED: string;
  INTERNAL_SERVER_ERROR: string;
  BAD_REQUEST: string;
}

export const ERROR_CODE: Readonly<ErrCode> = {
  UNAUTHORIZED: "UNAUTHORIZED",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  BAD_REQUEST: "BAD_REQUEST",
};
