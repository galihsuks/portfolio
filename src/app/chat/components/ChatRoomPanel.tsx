"use client";

import { FormEvent, RefObject, useEffect } from "react";
import { ArrowLeft, LogOut, Send } from "lucide-react";
import BubbleChat from "../../components/ChatAppBubble";
import { ChatItem, ChatUser, RoomItem } from "../types";
import { useOnlineMembersStore } from "../store/onlineMembers.store";
import { convertToTanggalIndonesia } from "../../_services/utils";

type BotLine = { _id: string; text: string; mine: boolean };

type Props = {
    user: ChatUser | null;
    activeRoom: RoomItem | null;
    botLines: BotLine[];
    pendingIds: string[];
    typingUsers: string[];
    loading: string;
    input: string;
    onInput: (value: string) => void;
    onSubmit: (e: FormEvent) => void;
    replyTarget: ChatItem | null;
    onClearReply: () => void;
    onReply: (chat: ChatItem) => void;
    onDelete: (chatId: string) => void;
    isOwner: boolean;
    onBackToRooms: () => void;
    onAddMember: () => void;
    onLogout: () => void;
    listRef: RefObject<HTMLDivElement | null>;
};

const BOT_USER = {
    _id: "BOT",
    email: "galih8.4.2001@gmail.com",
    nama: "Galih Sukmamukti",
};

export default function ChatRoomPanel({
    user,
    activeRoom,
    botLines,
    pendingIds,
    typingUsers,
    loading,
    input,
    onInput,
    onSubmit,
    replyTarget,
    onClearReply,
    onReply,
    onDelete,
    isOwner,
    onBackToRooms,
    onAddMember,
    onLogout,
    listRef,
}: Props) {
    const onlineIds = useOnlineMembersStore((s) => s.onlineIds);
    const lastSeenMap = useOnlineMembersStore((s) => s.lastSeen);
    const privateFriend =
        user && activeRoom?.tipe === "private"
            ? activeRoom.anggota.find((a) => a._id !== user._id)
            : null;
    const isPrivateFriendOnline = privateFriend
        ? onlineIds.includes(privateFriend._id)
        : false;
    const lastSeenText =
        privateFriend && !isPrivateFriendOnline
            ? (lastSeenMap[privateFriend._id] ?? null)
            : null;

    useEffect(() => {
        console.log(activeRoom);
    }, [activeRoom]);

    return (
        <section className="flex-1 flex flex-col">
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between gap-2">
                <div>
                    <p className="font-semibold">
                        {user
                            ? (activeRoom?.nama ?? "Private Room")
                            : "Galih Sukmamukti"}
                    </p>
                    {privateFriend && (
                        <p className="text-[10px] opacity-70">
                            {isPrivateFriendOnline
                                ? "Online"
                                : lastSeenText
                                  ? `Last seen ${convertToTanggalIndonesia(lastSeenText).full_text_time}`
                                  : "Offline"}
                        </p>
                    )}
                </div>
                {isOwner && activeRoom && (
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onBackToRooms}
                            className="md:hidden p-1 rounded border border-white/20"
                            aria-label="Back to rooms"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                        </button>
                        {activeRoom.tipe !== "private" && (
                            <button
                                type="button"
                                onClick={onAddMember}
                                className="text-[10px] px-2 py-1 rounded border border-white/20"
                            >
                                add
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={onLogout}
                            className="p-1 rounded border border-white/20"
                            aria-label="Logout chat"
                            title="Logout chat"
                        >
                            <LogOut className="h-3.5 w-3.5" />
                        </button>
                    </div>
                )}
                {!isOwner && user && (
                    <button
                        type="button"
                        onClick={onLogout}
                        className="p-1 rounded border border-white/20"
                        aria-label="Logout chat"
                        title="Logout chat"
                    >
                        <LogOut className="h-3.5 w-3.5" />
                    </button>
                )}
            </div>
            <div ref={listRef} className="flex-1 overflow-y-auto px-3 py-3">
                {!user ? (
                    botLines.map((line) => (
                        <div key={line._id} className="mb-2">
                            <BubbleChat
                                _id={line._id}
                                pesan={line.text}
                                reply={null}
                                time={new Date().toISOString()}
                                mine={line.mine}
                                pendingChat={[]}
                                anggotaGroup={[
                                    {
                                        _id: BOT_USER._id,
                                        email: BOT_USER.email,
                                        nama: BOT_USER.nama,
                                        online: { status: true, last: "" },
                                    },
                                ]}
                            />
                        </div>
                    ))
                ) : activeRoom ? (
                    activeRoom.chats.map((chat) => {
                        const isMine =
                            String(chat.idPengirim._id ?? "") ===
                                String(user._id ?? "") ||
                            String(
                                chat.idPengirim.email ?? "",
                            ).toLowerCase() ===
                                String(user.email ?? "").toLowerCase();
                        return (
                            <div key={chat._id} className="mb-3">
                                <BubbleChat
                                    _id={chat._id}
                                    pesan={chat.pesan}
                                    reply={chat.idChatReply}
                                    time={chat.createdAt}
                                    mine={isMine}
                                    pendingChat={pendingIds}
                                    seen={chat.seenUsers}
                                    anggotaGroup={activeRoom.anggota}
                                    senderName={chat.idPengirim.nama}
                                    onReply={() => onReply(chat)}
                                    canDelete={isMine}
                                    onDelete={() => onDelete(chat._id)}
                                />
                            </div>
                        );
                    })
                ) : (
                    <p className="opacity-70 text-xs">
                        Pilih room untuk memulai chat
                    </p>
                )}
            </div>
            {typingUsers.length > 0 && user && (
                <p className="px-3 pb-1 text-xs text-cyan-300">
                    {typingUsers[0]} typing...
                </p>
            )}
            {loading && (
                <p className="px-3 py-1 text-xs text-pink-300">{loading}</p>
            )}
            <form onSubmit={onSubmit} className="border-t border-white/10 p-2">
                {replyTarget && (
                    <button
                        type="button"
                        onClick={onClearReply}
                        className="mb-2 w-full rounded-lg border border-white/10 px-2 py-1 text-left"
                    >
                        <p className="text-[10px] text-pink-300">
                            Reply to {replyTarget.idPengirim.nama}
                        </p>
                        <p className="text-xs line-clamp-1">
                            {replyTarget.pesan}
                        </p>
                    </button>
                )}
                <div className="flex items-center gap-2">
                    <input
                        value={input}
                        onChange={(e) => onInput(e.target.value)}
                        placeholder={
                            user ? "Type a message..." : "Ketik nama kamu..."
                        }
                        className="flex-1 rounded-lg border border-white/10 px-3 py-2 text-sm focus:outline-none"
                    />
                    <button type="submit" className="rounded-lg p-2 btn glass">
                        <Send className="h-4 w-4" />
                    </button>
                </div>
            </form>
        </section>
    );
}
