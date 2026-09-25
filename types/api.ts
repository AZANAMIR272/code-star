// Generic API response envelope used by all route handlers

export type ApiStatus = "success" | "error" | "stub";

export interface ApiResponse<T = null> {
  status: ApiStatus;
  data: T;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  status: "error";
  code: string;
  message: string;
  timestamp: string;
}

export function makeResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    status: "success",
    data,
    message,
    timestamp: new Date().toISOString(),
  };
}

export function makeStub(message: string): ApiResponse<null> {
  return {
    status: "stub",
    data: null,
    message,
    timestamp: new Date().toISOString(),
  };
}

export function makeError(code: string, message: string): ApiError {
  return {
    status: "error",
    code,
    message,
    timestamp: new Date().toISOString(),
  };
}
