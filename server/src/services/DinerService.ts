import DinerModel from "../models/Diner";
import { config, NOTIFICATION_MSG } from "../configs/config";
import SocketClient from "../configs/socket";
import { QueueDinerResponse } from "../types/rest";
import { startTimer } from "../utils/timer";

interface sendNotifCheckinPayload {
  queueDiners: QueueDinerResponse[];
  availableSeats: number;
}

interface updateQueueListResponse {
  queueDiners: QueueDinerResponse[];
  availableSeats: number;
}

export class DinerService {
  // Update Queue List Across Client
  static async updateQueueList(
    isFirstRowRemoved: boolean
  ): Promise<updateQueueListResponse> {
    // Check if the session ID already exists
    const queueDiners = await DinerModel.getAllQueueDiners();
    const checkedInPartySize = await DinerModel.getTotalCheckedInPartySize();
    const availableSeats = config.RESTAURANT_CAPACITY - checkedInPartySize;

    SocketClient.emit("dinerUpdateQueueList", {
      queueDiners,
      availableSeats,
      isFirstRowRemoved: isFirstRowRemoved,
    });

    return { queueDiners, availableSeats };
  }

  static async sendNotifCheckinTurn(data: sendNotifCheckinPayload) {
    if (
      data.queueDiners.length > 0 &&
      data.availableSeats >= data.queueDiners[0].party_size
    ) {
      SocketClient.emitToSession(
        data.queueDiners[0].session_id,
        "dinerYourTurn"
      );
      SocketClient.emitToSession(
        data.queueDiners[0].session_id,
        "dinerNotification",
        {
          message: NOTIFICATION_MSG.YOUR_TURN,
          isWarning: false,
        }
      );
      DinerService.startTimerCheckin(data.queueDiners[0].session_id);
    }
    // Notif one party ahead
    if (data.queueDiners.length >= 2) {
      SocketClient.emitToSession(
        data.queueDiners[1].session_id,
        "dinerNotification",
        {
          message: NOTIFICATION_MSG.ONE_AHEAD,
          isWarning: false,
        }
      );
    }
  }

  static async startTimerCheckin(sessionId: string) {
    startTimer(
      sessionId,
      config.NOTIF_REQUEUE,
      async () => {
        try {
          const queueCounter = await DinerModel.getQueueCounter(sessionId);
          let isRemoved = queueCounter >= config.REQUEUE_CHANCE;
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
  }

  static async startTimerService(sessionId: string, serviceTime: number) {
    console.log(
      `start counting service timer for party: ${sessionId} with (${serviceTime}) seconds`
    );
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
  }
}
