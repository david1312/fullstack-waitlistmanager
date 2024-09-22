export interface QueueDiner {
  session_id: string;
  name: string;
  party_size: number;
  queue_time: Date;
}

export interface DinerUpdateQueueListPayload {
  queueDiners: QueueDiner[];
  availableSeats: number;
  isFirstRowRemoved?: boolean;
}

export interface DinerYourTurnPayload {
  notifFirstLate: number;
  notifRequeue: number;
  requeueChance: number;
}

export interface DinerNotificationPayload {
  message: string;
  isRemoved?: boolean;
}
