import express from "express";
import { setupWebSocketServer } from "./websockets/wsServer";
import { createDinerRoutes } from "./routes/dinerRoutes";
import http from "http";
import requestLogger from "./middlewares/requestLogger";
import { config } from "./configs/config";
import Database from "./configs/db";
import cors from "cors";
import WSClient from "./configs/socket";

const app = express();
const server = http.createServer(app);

// Database Connection
Database.connect();

// Websocket initialization
WSClient.initialize(server);

// Websocket server side event handler
setupWebSocketServer();

// Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(requestLogger);

// Use the queue routes
app.use(config.API_BASE_URL, createDinerRoutes());

// Start Server
server.listen(config.SERVER_PORT, () =>
  console.log(`Server running on port ${config.SERVER_PORT}`)
);
