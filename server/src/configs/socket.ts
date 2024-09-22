import { Server } from "socket.io";
import http from "http";
import { config } from "./config";

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
  static emitToSession(sessionId: string, event: string, data?: any) {
    const io = SocketClient.getInstance();
    io.to(sessionId).emit(event, data);
  }

  // Use for general broadcasts
  static emit(event: string, data: any) {
    const io = SocketClient.getInstance();
    io.emit(event, data);
  }
}

export default SocketClient;
