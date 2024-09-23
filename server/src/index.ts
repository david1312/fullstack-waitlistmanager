import express from "express";
import { setupWebSocketServer } from "./websockets/wsServer";
import { createDinerRoutes } from "./routes/dinerRoutes";
import http from "http";
import requestLogger from "./middlewares/requestLogger";
import { config } from "./configs/config";
import Database from "./configs/db";
import cors from "cors";
import WSClient from "./configs/socket";
import { debug } from "console";

const app = express();
const server = http.createServer(app);
// Database initialization
Database.connect();
// Websocket initialization
WSClient.initialize(server);
// Websocket server side event handler
setupWebSocketServer();

// Middleware
app.use(cors({ origin: config.CORS_ORIGIN }));
app.use(express.json());
app.use(requestLogger);
// routes list
app.use(config.API_BASE_URL, createDinerRoutes());
// Start Server
server.listen(config.SERVER_PORT, async () => {
  console.log(`Server running on port ${config.SERVER_PORT}`);
});

// Graceful Shutdown
const shutdown = () => {
  console.log("Gracefully shutting down...");
  setTimeout(() => {
    server.close(async (err) => {
      if (err) {
        console.error("Error while shutting down server:", err);
        process.exit(1);
      }
      console.log(
        "Server closed, now closing WebSocket and database connections..."
      );

      await WSClient.shutdown();
      await Database.disconnect();
      process.exit(0);
    });
  }, 0);
};

// Listen for termination signals
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
