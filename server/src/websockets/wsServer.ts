import { config, NOTIFICATION_MSG } from "../configs/config";
import SocketClient from "../configs/socket";
import DinerModel from "../models/Diner";
import { DinerService } from "../services/DinerService";
import { startTimer, stopTimer } from "../utils/timer";

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

    // handler dinner turn for checkin
    socket.on("dinnerCheckinAvailable", async () => {
      startTimer(
        sessionId,
        config.NOTIF_REQUEUE,
        async () => {
          try {
            const queueCounter = await DinerModel.getQueueCounter(sessionId);
            let isRemoved =
              (queueCounter && queueCounter >= config.REQUEUE_CHANCE) || false;
            let message = isRemoved
              ? NOTIFICATION_MSG.KICKED
              : NOTIFICATION_MSG.REQUEUE;

            if (isRemoved) {
              await DinerModel.deleteDinerOnQueue(sessionId);
              console.log(
                `Requeue chance max reached, session ID: ${sessionId} removed`
              );
            } else {
              await DinerModel.updateQueueTime({
                queue_counter: queueCounter ? queueCounter + 1 : 1,
                queue_time: new Date(),
                session_id: sessionId,
              });
            }

            const result = await DinerService.updateQueueList(true);
            // notify next party if their next turn
            await DinerService.sendNotifCheckinTurn({
              availableSeats: result.availableSeats,
              queueDiners: result.queueDiners,
            });

            // Send notif to rotated / kicked queue
            if (
              (result.queueDiners.length > 0 &&
                result.queueDiners[0].session_id !== sessionId) ||
              result.queueDiners.length === 0
            ) {
              SocketClient.emitToSession(sessionId, "dinerCheckinExpired");
              SocketClient.emitToSession(sessionId, "dinerNotification", {
                message: message,
                isRemoved: isRemoved,
                isWarning: isRemoved,
              });
            }
          } catch (error) {
            console.error("Error when trigger checkin timer:", error);
            // Optional: You could send an error back to the client, or handle it in another way
            SocketClient.emitToSession(sessionId, "dinerNotification", {
              message: "Error when trigger checkin timer",
              isWarning: true,
            });
          }
        },
        false,
        (timeLeft) => {
          SocketClient.emitToSession(sessionId, "dinerTimer", timeLeft);
          if (timeLeft === config.NOTIF_FIRST_LATE)
            SocketClient.emitToSession(sessionId, "dinerNotification", {
              message: NOTIFICATION_MSG.FIRST_LATE,
            });
        }
      );
    });

    socket.on("dinerStartService", async (serviceTime: number) => {
      startTimer(
        sessionId,
        serviceTime,
        async () => {
          try {
            await DinerModel.deleteDiner(sessionId);
            console.log(
              `Party ${sessionId} completed the service,deleted successfully.`
            );

            const result = await DinerService.updateQueueList(false);
            await DinerService.sendNotifCheckinTurn({
              availableSeats: result.availableSeats,
              queueDiners: result.queueDiners,
            });
          } catch (error) {
            console.error("Error deleting diner:", error);
            // Optional: You could send an error back to the client, or handle it in another way
            SocketClient.emitToSession(sessionId, "dinerNotification", {
              message: "Error when delete diner",
              isWarning: true,
            });
          }
        },
        true
      );
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`Client with Session ID: ${sessionId} disconnected`);
    });
  });
};
