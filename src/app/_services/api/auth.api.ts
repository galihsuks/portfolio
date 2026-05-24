"use client";

import { apiClient } from "./client";

export function logoutApi(payload: null) {
  return apiClient<{ message: string; data: null }>("/auth/logout", {
    method: "POST",
  }).then((res) => res.data);
}
