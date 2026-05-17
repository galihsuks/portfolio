import { create } from "zustand";

type OnlineMemberState = {
    onlineIds: string[];
    lastSeen: Record<string, string>;
    hydrateFromApi: (
        members: Array<{ _id: string; isOnline: boolean; lastSeen: string | null }>,
    ) => void;
    syncFromOnlineIds: (ids: string[]) => void;
    isOnlineById: (id: string) => boolean;
    getLastSeenById: (id: string) => string | null;
};

export const useOnlineMembersStore = create<OnlineMemberState>((set, get) => ({
    onlineIds: [],
    lastSeen: {},
    hydrateFromApi: (members) => {
        const onlineIds = members
            .filter((m) => m.isOnline)
            .map((m) => m._id)
            .filter(Boolean);
        const lastSeen: Record<string, string> = { ...get().lastSeen };
        members.forEach((m) => {
            if (m.lastSeen) lastSeen[m._id] = m.lastSeen;
        });
        set({ onlineIds: Array.from(new Set(onlineIds)), lastSeen });
    },
    syncFromOnlineIds: (ids) => {
        const unique = Array.from(new Set(ids.filter(Boolean)));
        const nowIso = new Date().toISOString();
        const prev = get().onlineIds;
        const nextLastSeen = { ...get().lastSeen };
        prev.forEach((id) => {
            if (!unique.includes(id) && !nextLastSeen[id]) {
                nextLastSeen[id] = nowIso;
            }
        });
        set({ onlineIds: unique, lastSeen: nextLastSeen });
    },
    isOnlineById: (id) => get().onlineIds.includes(id),
    getLastSeenById: (id) => get().lastSeen[id] ?? null,
}));
