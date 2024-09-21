export interface JoinWaitlistPayload {
  sessionId: string;
  name: string;
  partySize: number;
}

export interface APIResponse<T = undefined> {
  isSuccess: boolean;
  message?: string;
  error?: string;
  data?: T; // Optional field for returning data
}
