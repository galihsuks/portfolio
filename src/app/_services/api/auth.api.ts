"use client";

import { apiClient } from "./client";

export function logoutApi() {
  return apiClient<{ message: string; data: null }>("/auth/logout", {
    method: "POST",
  }).then((res) => res.data);
}
