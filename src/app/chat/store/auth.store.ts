import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ChatUser } from "../types";

type ChatAuthState = {
    user: ChatUser | null;
    isOwner: boolean;
    setAuth: (user: ChatUser, isOwner: boolean) => void;
    clearAuth: () => void;
};

function normalizeUser(user: Partial<ChatUser> | null | undefined): ChatUser | null {
    if (!user) return null;
    const _id = String(user._id ?? "").trim();
    const email = String(user.email ?? "").trim();
    const nama = String(user.nama ?? "").trim();
    if (!_id || !email || !nama) return null;
    return { _id, email, nama };
}

export const useChatAuthStore = create<ChatAuthState>()(
    persist(
        (set) => ({
            user: null,
            isOwner: false,
            setAuth: (user, isOwner) =>
                set({ user: normalizeUser(user), isOwner: Boolean(isOwner) }),
            clearAuth: () => set({ user: null, isOwner: false }),
        }),
        {
            name: "portfolio-chat-auth",
            merge: (persistedState, currentState) => {
                const next = persistedState as Partial<ChatAuthState> | undefined;
                const user = normalizeUser(next?.user as Partial<ChatUser> | null);
                const isOwner = Boolean(next?.isOwner && user);
                return {
                    ...currentState,
                    ...next,
                    user,
                    isOwner,
                };
            },
        },
    ),
);
