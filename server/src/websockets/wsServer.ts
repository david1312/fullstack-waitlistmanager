import WSClient from "../configs/socket";

export const setupWebSocketServer = () => {
  const io = WSClient.getInstance();

  io.on("connection", (socket) => {
    const sessionId = socket.handshake.query.sessionId;

    if (!sessionId) {
      console.log("Session ID not provided. Disconnecting client...");
      socket.disconnect(); // Disconnect the client if userId is missing
      return; // Exit the connection handler
    }

    console.log(`New client connected with Session ID: ${sessionId}`);
    socket.join(sessionId);

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  return io;
};
