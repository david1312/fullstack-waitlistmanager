import { Server } from "socket.io";
import http from "http";

class SocketSingleton {
  private static instance: Server | null = null;

  // Initialize the singleton instance
  static initialize(server: http.Server) {
    if (!SocketSingleton.instance) {
      SocketSingleton.instance = new Server(server, { cors: { origin: "*" } });
      console.log("Socket.io initialized.");
    }
    return SocketSingleton.instance;
  }

  // Get the instance
  static getInstance() {
    if (!SocketSingleton.instance) {
      throw new Error(
        "Socket.io instance is not initialized. Call initialize first."
      );
    }
    return SocketSingleton.instance;
  }

  // Allow emitting to specific session IDs
  static emitToSession(sessionId: string, event: string, data: any) {
    const io = SocketSingleton.getInstance();
    io.to(sessionId).emit(event, data);
  }

  // Use for general broadcasts
  static emit(event: string, data: any) {
    const io = SocketSingleton.getInstance();
    io.emit(event, data);
  }
}

export default SocketSingleton;
