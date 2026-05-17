"use client";

import { RoomItem } from "../types";
import { useOnlineMembersStore } from "../store/onlineMembers.store";

type Props = {
    rooms: RoomItem[];
    activeRoomId: string | null;
    setActiveRoomId: (roomId: string) => void;
    currentUserId?: string;
};

export default function RoomListPanel({
    rooms,
    activeRoomId,
    setActiveRoomId,
    currentUserId,
}: Props) {
    const onlineIds = useOnlineMembersStore((s) => s.onlineIds);
    return (
        <aside
            className={`${activeRoomId ? "hidden md:flex" : "flex"} w-full md:w-[320px] flex-col border-r border-white/10`}
        >
            <div className="px-4 py-3 border-b border-white/10">
                <p className="font-semibold">Chat Rooms</p>
                <p className="text-[10px] opacity-70">v2.1</p>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
                {rooms.map((room) => {
                    const peer =
                        room.tipe === "private"
                            ? room.anggota.find((a) => a._id !== currentUserId)
                            : null;
                    const isOnline = peer
                        ? onlineIds.includes(peer._id)
                        : false;
                    return (
                        <button
                            key={room._id}
                            onClick={() => setActiveRoomId(room._id)}
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10"
                        >
                            <div className="flex items-center gap-2">
                                <p className="font-semibold">{room.nama}</p>
                                {isOnline && (
                                    <span className="inline-flex h-2 w-2 rounded-full bg-pink-400" />
                                )}
                            </div>
                            <p className="text-xs opacity-70 line-clamp-1">
                                {room.lastchat?.pesan ?? "No messages"}
                            </p>
                        </button>
                    );
                })}
            </div>
        </aside>
    );
}
