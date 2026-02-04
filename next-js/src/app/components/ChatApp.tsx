"use client";

import { useEffect, useState } from "react";
import { MessageCircle, X, ArrowLeft, Send } from "lucide-react";
import BubbleChat from "./ChatAppBubble";

type ChatRoom = {
    id: string;
    name: string;
};

const ROOMS: ChatRoom[] = [
    { id: "general", name: "General Chat" },
    { id: "tech", name: "Tech Talk" },
    { id: "random", name: "Random" },
];

export default function ChatApp() {
    const [open, setOpen] = useState(false);
    const [activeRoom, setActiveRoom] = useState<ChatRoom | null>(null);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className={`cursor-pointer fixed z-50 flex ${open ? "h-[0px] w-[0px] bottom-8 right-8" : "glass bottom-6 right-6 h-14 w-14"} items-center justify-center rounded-full shadow-lg hover:bg-white hover:text-zinc-600 transition-all duration-200`}
            >
                <MessageCircle className="h-6 w-6" />
            </button>

            <div
                data-lenis-prevent
                className={`transition-all duration-400 overflow-hidden fixed z-50 flex flex-col rounded-xl bg-black/70 border-white/10 backdrop-blur-lg shadow-2xl ${open ? "h-[500px] w-[350px] border bottom-6 right-6" : "h-[0px] w-[0px] bottom-8 right-8"}`}
            >
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                    <div>
                        <p className="text-base font-semibold">
                            Galih Sukmamukti
                        </p>
                        <p className="text-sm text-zinc-500">
                            Last seen 29 Jan 2026 18:00
                        </p>
                    </div>

                    <button onClick={() => setOpen(false)}>
                        <X className="h-5 w-5 text-gray-500 hover:text-gray-50" />
                    </button>
                </div>

                <div className="flex flex-1 flex-col overflow-hidden">
                    {!activeRoom ? (
                        <RoomList onSelect={setActiveRoom} />
                    ) : (
                        <ChatRoomView room={activeRoom} />
                    )}
                </div>
                {/* <div className="flex items-center justify-between border-b px-4 py-3">
                    {activeRoom ? (
                        <button
                            onClick={() => setActiveRoom(null)}
                            className="flex items-center gap-2 text-sm text-gray-600"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Rooms
                        </button>
                    ) : (
                        <span className="font-semibold">Chat Rooms</span>
                    )}

                    <button onClick={() => setOpen(false)}>
                        <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                    </button>
                </div>
                <div className="flex flex-1 flex-col overflow-hidden">
                    {!activeRoom ? (
                        <RoomList onSelect={setActiveRoom} />
                    ) : (
                        <ChatRoomView room={activeRoom} />
                    )}
                </div> */}
            </div>
        </>
    );
}

/* ===================== */
/* Room List */
/* ===================== */
function RoomList({ onSelect }: { onSelect: (room: ChatRoom) => void }) {
    return (
        <div className="flex flex-col divide-y">
            {ROOMS.map((room) => (
                <button
                    key={room.id}
                    onClick={() => onSelect(room)}
                    className="px-4 py-3 text-left hover:bg-gray-100"
                >
                    <p className="font-medium">{room.name}</p>
                    <p className="text-xs text-gray-500">Tap to join</p>
                </button>
            ))}
        </div>
    );
}

/* ===================== */
/* Chat Room */
/* ===================== */
function ChatRoomView({ room }: { room: ChatRoom }) {
    return (
        <>
            {/* Messages */}
            <div className="flex-1 space-y-2 overflow-y-auto px-4 py-3 text-sm">
                <span className="flex justify-center items-center gap-5">
                    <div
                        style={{ height: "1px", width: "100%" }}
                        className="bg-white opacity-30"
                    ></div>
                    <p className="opacity-50 text-xs text-nowrap">
                        24 Jan 2026
                    </p>
                    <div
                        style={{ height: "1px", width: "100%" }}
                        className="bg-white opacity-30"
                    ></div>
                </span>
                <BubbleChat
                    pesan="Cekcek qwdqw dqwd qwd qwd qwd qwd qw dqw dqw dqw dqwdqwdqwd qwdqwd qwd qwd qwd qw "
                    time="18:00"
                    mine={true}
                />
                <BubbleChat pesan="Cekcek" time="18:00" mine={true} />
                <BubbleChat
                    pesan="Cekcek qwdq dqw dqw dskjdf skjf sdf ksjdf sdkjshdf sdfkheq dvnqowiq w"
                    time="18:00"
                    mine={false}
                />
                <BubbleChat pesan="Cekcek" time="18:00" mine={false} />
                <BubbleChat pesan="Cekcek" time="18:00" mine={true} />
                <BubbleChat pesan="Cekcek" time="18:00" mine={false} />
                <BubbleChat
                    pesan="Cekcek qwdqw dqwd qwd qwd qwd qwd qw dqw dqw dqw dqwdqwdqwd qwdqwd qwd qwd qwd qw "
                    time="18:00"
                    mine={true}
                />
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 border-t border-white/10 px-3 py-2">
                <input
                    type="text"
                    placeholder="Type a message..."
                    spellCheck={false}
                    className="flex-1 rounded-lg border border-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-50 transition-all duration-200"
                />
                <button className="rounded-lg p-2 btn glass">
                    <Send className="h-4 w-4" />
                </button>
            </div>
        </>
    );
}
