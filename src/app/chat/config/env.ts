"use client";
export const env = {
  VITE_API_URL: process.env.NEXT_PUBLIC_BACKEND_URL ?? "",
  VITE_WS_URL: process.env.NEXT_PUBLIC_WS ?? "",
  VITE_WS_APP_ID: "omong",
} as const;
