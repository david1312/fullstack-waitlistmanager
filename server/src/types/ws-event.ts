interface QueueDiner {
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
