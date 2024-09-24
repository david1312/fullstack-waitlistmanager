import SocketClient from "../configs/socket";

export const setupWebSocketServer = () => {
  const io = SocketClient.getInstance();

  io.on("connection", (socket) => {
    const sessionId = socket.handshake.query.sessionId as string;
    if (!sessionId) {
      console.log("Session ID not provided. Disconnecting client...");
      socket.disconnect();
      return;
    }
    socket.join(sessionId);
    console.log(`New client connected with Session ID: ${sessionId}`);

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`Client with Session ID: ${sessionId} disconnected`);
    });
  });
};
