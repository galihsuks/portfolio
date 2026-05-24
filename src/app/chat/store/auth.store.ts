"use client";
import { create } from "zustand";
import { UserAuth } from "../types/domain";

type AuthState = {
  user: UserAuth | null;
  hydrated: boolean;
  hydrateFromStorage: () => void;
  setUser: (user: UserAuth | null) => void;
  logout: () => void;
  isOpenChat: boolean;
  setIsOpenChat: (value: boolean) => void;
  loginProcess: boolean;
  setLoginProcess: (value: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  hydrated: false,
  hydrateFromStorage: () => {
    if (typeof window === "undefined") {
      set({ hydrated: true });
      return;
    }
    const persisted = window.localStorage.getItem("omong:user");
    set({
      user: persisted ? (JSON.parse(persisted) as UserAuth) : null,
      hydrated: true,
    });
  },
  setUser: (user) => {
    if (typeof window !== "undefined") {
      if (user) window.localStorage.setItem("omong:user", JSON.stringify(user));
      else window.localStorage.removeItem("omong:user");
    }
    set({ user });
  },
  logout: () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("omong:user");
    }
    set({ user: null });
  },
  isOpenChat:
    typeof window !== "undefined"
      ? Boolean(window.localStorage.getItem("portfolio:open-chat"))
      : false,
  setIsOpenChat: (value) => {
    if (typeof window !== "undefined") {
      if (value) window.localStorage.setItem("portfolio:open-chat", "1");
      else window.localStorage.removeItem("portfolio:open-chat");
    }
    set({ isOpenChat: value });
  },
  loginProcess: false,
  setLoginProcess: (value) => {
    set({ loginProcess: value });
  },
}));
