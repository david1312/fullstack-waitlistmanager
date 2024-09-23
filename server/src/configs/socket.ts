import { Server } from "socket.io";
import http from "http";
import { config } from "./config";
import { EventPayloadMap } from "../types/ws-event";

class SocketClient {
  private static instance: Server | null = null;

  static initialize(server: http.Server) {
    if (!SocketClient.instance) {
      SocketClient.instance = new Server(server, {
        cors: { origin: config.CORS_ORIGIN },
      });
      console.log("Socket.io initialized.");
    }
    return SocketClient.instance;
  }

  static async shutdown() {
    if (SocketClient.instance) {
      console.log("Closing WebSocket connections...");
      SocketClient.instance.close(() => {
        console.log("WebSocket server closed.");
      });
    }
  }

  // Get the instance
  static getInstance() {
    if (!SocketClient.instance) {
      throw new Error(
        "Socket.io instance is not initialized. Call initialize first."
      );
    }
    return SocketClient.instance;
  }

  // Allow emitting to specific session IDs
  static emitToSession<K extends keyof EventPayloadMap>(
    sessionId: string,
    event: K,
    data?: EventPayloadMap[K]
  ) {
    const io = SocketClient.getInstance();
    io.to(sessionId).emit(event, data);
  }

  // Emit to all clients with typed payload
  static emit<K extends keyof EventPayloadMap>(
    event: K,
    data?: EventPayloadMap[K]
  ) {
    const io = SocketClient.getInstance();
    io.emit(event, data);
  }
}

export default SocketClient;
