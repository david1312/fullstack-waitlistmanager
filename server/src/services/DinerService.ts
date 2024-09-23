import DinerModel from "../models/Diner";
import { config, NOTIFICATION_MSG } from "../configs/config";
import SocketClient from "../configs/socket";
import { QueueDinerResponse } from "../types/response";

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
    }
  }
}
