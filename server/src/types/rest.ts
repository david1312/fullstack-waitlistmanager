export interface ErrorResponse {
  errorCode: string;
  error: string;
}

export interface SuccessResponse<T = any> {
  message?: string;
  data?: T; // Optional field for returning data
}

export interface QueueDinerResponse {
  session_id: string;
  name: string;
  party_size: number;
  queue_time: Date;
}

export interface SessionIdPayload {
  sessionId: string;
}

export interface JoinWaitlistPayload {
  sessionId: string;
  name: string;
  partySize: number;
}
