export interface ErrorResponse {
  error: string;
}

export interface SuccessResponse<T = any> {
  message?: string;
  data?: T; // Optional field for returning data
}
