export interface QueueDiner {
  session_id: string;
  name: string;
  party_size: number;
  queue_time: Date;
}

export interface DinerJoinWaitlistPayload {
  queueDiners: QueueDiner[];
  availableSeats: number;
  maxCapacity: number;
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
