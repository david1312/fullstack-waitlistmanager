import { config, NOTIFICATION_MSG } from "../configs/config";
import SocketSingleton from "../configs/socket";
import DinerModel from "../models/Diner";
import { startTimer } from "../utils/timer";

export const setupWebSocketServer = () => {
  const io = SocketSingleton.getInstance();

  io.on("connection", (socket) => {
    const sessionId = socket.handshake.query.sessionId as string;

    if (!sessionId) {
      console.log("Session ID not provided. Disconnecting client...");
      socket.disconnect();
      return;
    }

    console.log(`New client connected with Session ID: ${sessionId}`);
    socket.join(sessionId);

    // handle your turn checkin

    socket.on("dinerYourTurn", async () => {
      const queueCounter = await DinerModel.getQueueCounter(sessionId);
      startTimer(
        sessionId,
        config.NOTIF_REQUEUE,
        async () => {
          let message = NOTIFICATION_MSG.REQUEUE;
          let isRemoved = false;
          console.log("complete timer");
          if (queueCounter && queueCounter >= config.REQUEUE_CHANCE) {
            message = NOTIFICATION_MSG.KICKED;
            isRemoved = true;
            await DinerModel.deleteDiner(sessionId);
            console.log(
              `requeue chance maximum reached, session ID: ${sessionId} removed from queue`
            );
          } else {
            await DinerModel.updateQueueTime({
              queue_counter: 1,
              queue_time: new Date(),
              session_id: sessionId,
            });
          }
          const queueDiners = await DinerModel.getAllQueueDiners();
          SocketSingleton.emit("dinerUpdateQueueList", queueDiners);
          SocketSingleton.emitToSession(sessionId, "dinerCheckinExpired");

          SocketSingleton.emitToSession(sessionId, "dinerNotification", {
            message: message,
            isRemoved: isRemoved,
          });
        },
        (timeLeft) => {
          console.log(timeLeft);
          if (timeLeft === config.NOTIF_FIRST_LATE)
            SocketSingleton.emitToSession(sessionId, "dinerNotification", {
              message: NOTIFICATION_MSG.FIRST_LATE,
            });
        }
      );
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`Client with Session ID: ${sessionId} disconnected`);
    });
  });
};
