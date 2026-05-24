"use client";
import { useMutation } from "@tanstack/react-query";
import { logoutApi } from "../../_services/api/auth.api";

export function useLogoutMutation() {
  return useMutation({
    mutationFn: logoutApi,
  });
}
