import express from "express";
import dotenv from "dotenv";

import { setupWebSocketServer } from "./websockets/wsServer";
import { createDinerRoutes } from "./routes/dinerRoutes";
import http from "http";
import requestLogger from "./middlewares/requestLogger";
import { config } from "./configs/config";
import { Server } from "socket.io";
import Database from "./configs/db";
import cors from "cors";
import WSClient from "./configs/socket";
dotenv.config();

const app = express();
const server = http.createServer(app);

// Database Connection
Database.connect();

// Websocket initialization
WSClient.initialize(server);

const io: Server = setupWebSocketServer(); // WebSocket instance
// Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(requestLogger);

// Use the queue routes
app.use("/api", createDinerRoutes(io));

// Start Server
server.listen(config.SERVER_PORT, () =>
  console.log(`Server running on port ${config.SERVER_PORT}`)
);
