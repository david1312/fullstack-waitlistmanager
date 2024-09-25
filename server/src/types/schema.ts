type DinerStatus = "queue" | "diner";
export interface Diner {
  session_id: string;
  name: string;
  party_size: number;
  status: "queue" | "diner";
  check_in_time?: Date;
  queue_time?: Date;
  service_time?: number;
  queue_counter: number;
}

export interface AddDinerPayload {
  session_id: string;
  name: string;
  party_size: number;
  status: DinerStatus;
  queue_time: Date;
  service_time: number;
}

export interface UpdateDinerQueueTimePayload {
  session_id: string;
  queue_time: Date;
  queue_counter: number;
}

export interface DinerCheckInResponse {
  service_time: number;
}
