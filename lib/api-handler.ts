import { NextResponse } from "next/server";
import type { ApiResponse, ApiError } from "@/types/api";

/**
 * Wraps an API route handler with consistent error enveloping.
 * Any thrown error is caught and returned as an ApiError JSON response.
 *
 * Note: Next.js 15 route handlers use native function signatures.
 * This wrapper is used ONLY for no-param routes. Dynamic routes handle
 * their own params inline.
 */
export function withApiHandler(
  handler: (req: Request) => Promise<NextResponse>
): (req: Request) => Promise<NextResponse> {
  return async (req) => {
    try {
      return await handler(req);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Internal server error";
      const body: ApiError = {
        status: "error",
        code: "INTERNAL_ERROR",
        message,
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(body, { status: 500 });
    }
  };
}

/** Helper to return a typed stub response */
export function stubResponse(message: string): NextResponse<ApiResponse<null>> {
  return NextResponse.json<ApiResponse<null>>({
    status: "stub",
    data: null,
    message,
    timestamp: new Date().toISOString(),
  });
}

/** Wrap a dynamic route handler that receives awaited params */
export function withDynamicHandler<T extends Record<string, string>>(
  handler: (req: Request, params: T) => Promise<NextResponse>
): (req: Request, ctx: { params: Promise<T> }) => Promise<NextResponse> {
  return async (req, ctx) => {
    try {
      const params = await ctx.params;
      return await handler(req, params);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Internal server error";
      const body: ApiError = {
        status: "error",
        code: "INTERNAL_ERROR",
        message,
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(body, { status: 500 });
    }
  };
}
