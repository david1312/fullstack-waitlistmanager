import { config, NOTIFICATION_MSG } from "../configs/config";
import SocketClient from "../configs/socket";
import DinerModel from "../models/Diner";
import { startTimer } from "../utils/timer";

interface DinerStartService {
  serviceTime: number;
}

export const setupWebSocketServer = () => {
  const io = SocketClient.getInstance();

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

    socket.on("dinnerCheckinAvailable", async () => {
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
          const checkedInPartySize =
            await DinerModel.getTotalCheckedInPartySize();
          const availableSeats =
            config.RESTAURANT_CAPACITY - checkedInPartySize;

          SocketClient.emit("dinerUpdateQueueList", {
            queueDiners,
            availableSeats,
            isFirstRowRemoved: true,
          });
          console.log({ queueDiners });
          // notify next turn party queue
          if (
            queueDiners.length > 0 &&
            availableSeats >= queueDiners[0].party_size
          ) {
            SocketClient.emitToSession(
              queueDiners[0].session_id,
              "dinerYourTurn"
            );
            SocketClient.emitToSession(
              queueDiners[0].session_id,
              "dinerNotification",
              {
                message: NOTIFICATION_MSG.YOUR_TURN,
              }
            );
          }
          // only send this if first dinner queue get rotated
          if (
            (queueDiners.length > 0 &&
              queueDiners[0].session_id !== sessionId) ||
            queueDiners.length === 0
          ) {
            SocketClient.emitToSession(sessionId, "dinerCheckinExpired");
            SocketClient.emitToSession(sessionId, "dinerNotification", {
              message: message,
              isRemoved: isRemoved,
            });
            // }
          }
          // if()
        },
        false,
        (timeLeft) => {
          console.log(timeLeft);
          SocketClient.emitToSession(sessionId, "dinerTimer", timeLeft);
          if (timeLeft === config.NOTIF_FIRST_LATE)
            SocketClient.emitToSession(sessionId, "dinerNotification", {
              message: NOTIFICATION_MSG.FIRST_LATE,
            });
        }
      );
    });

    socket.on("dinerStartService", async (data: DinerStartService) => {
      console.log("dinerStartService", data);
      startTimer(
        sessionId,
        data.serviceTime,
        async () => {
          console.log("complete");
        },
        true,
        (timeLeft) => {
          console.log(timeLeft);
        }
      );
      console.log("babais");
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`Client with Session ID: ${sessionId} disconnected`);
    });
  });
};
