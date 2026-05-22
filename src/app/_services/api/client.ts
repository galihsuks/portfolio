"use client";

import { env } from "../../chat/config/env";
import { useAuthStore } from "../../chat/store/auth.store";

export async function apiClient<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = useAuthStore.getState().user?.token;

  const response = await fetch(`${env.VITE_API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers ?? {}),
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      (data as { message?: string; pesan?: string }).message ??
        (data as { pesan?: string }).pesan ??
        "Request failed",
    );
  }

  return data as T;
}
