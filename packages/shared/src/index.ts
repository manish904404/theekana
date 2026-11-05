export interface HealthResponse {
  status: 'ok';
}

export interface ApiError {
  code: string;
  message: string;
  request_id: string;
}

export interface ApiErrorResponse {
  error: ApiError;
}
