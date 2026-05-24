"use client";

import { env } from "../../chat/config/env";
import { useAuthStore } from "../../chat/store/auth.store";

function handleUnauthorized() {
  if (typeof window === "undefined") return;
  const hasLoggedInUser = Boolean(useAuthStore.getState().user?.token);
  if (!hasLoggedInUser) return;

  useAuthStore.getState().logout();

  const key = "__chat401_reload_guard__";
  const now = Date.now();
  const latest = Number(window.sessionStorage.getItem(key) ?? "0");
  if (now - latest < 1500) return;
  window.sessionStorage.setItem(key, String(now));
  window.location.reload();
}

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
    if (response.status === 401) {
      handleUnauthorized();
    }
    throw new Error(
      (data as { message?: string; pesan?: string }).message ??
        (data as { pesan?: string }).pesan ??
        "Request failed",
    );
  }

  return data as T;
}
