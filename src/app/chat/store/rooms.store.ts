import { create } from "zustand";
import { RoomItem } from "../types";

type RoomsState = {
    rooms: RoomItem[];
    activeRoomId: string | null;
    setRooms: (rooms: RoomItem[]) => void;
    upsertRoom: (room: RoomItem) => void;
    setActiveRoomId: (roomId: string | null) => void;
    patchRoom: (roomId: string, patcher: (room: RoomItem) => RoomItem) => void;
};

export const useChatRoomsStore = create<RoomsState>((set, get) => ({
    rooms: [],
    activeRoomId: null,
    setRooms: (rooms) => set({ rooms }),
    upsertRoom: (room) => {
        const exists = get().rooms.some((item) => item._id === room._id);
        if (!exists) {
            set({ rooms: [room, ...get().rooms] });
            return;
        }
        set({
            rooms: get().rooms.map((item) => (item._id === room._id ? room : item)),
        });
    },
    setActiveRoomId: (roomId) => set({ activeRoomId: roomId }),
    patchRoom: (roomId, patcher) =>
        set({
            rooms: get().rooms.map((room) =>
                room._id === roomId ? patcher(room) : room,
            ),
        }),
}));
