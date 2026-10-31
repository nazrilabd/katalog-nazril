// app/api/_middleware.js
"use server";
import { NextResponse } from "next/server";

/**
 * Simple rate limiting middleware for API routes.
 * Allows max 60 requests per minute per IP address.
 * In production replace with a robust store (Redis, etc.).
 */
const RATE_LIMIT = 60; // requests per minute
const WINDOW_MS = 60 * 1000;

// In‑memory store (reset on server restart)
const ipCounters = new Map();

export async function middleware(req) {
  const ip = req.ip ?? "unknown";
  const now = Date.now();
  const record = ipCounters.get(ip) || { count: 0, start: now };
  if (now - record.start > WINDOW_MS) {
    // reset window
    record.count = 0;
    record.start = now;
  }
  record.count += 1;
  ipCounters.set(ip, record);

  if (record.count > RATE_LIMIT) {
    return new NextResponse(JSON.stringify({ error: "Rate limit exceeded" }), {
      status: 429,
      headers: { "Content-Type": "application/json" },
    });
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
