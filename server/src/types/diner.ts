export interface DinerAttributes {
  session_id: string;
  name: string;
  party_size: number;
  status: "queue" | "diner";
  check_in_time?: Date;
  queue_time?: Date;
  service_time?: number;
}
