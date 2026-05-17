import { useEffect, useRef, useState } from "react";
import { useSeenMutation } from "./useChatData";
import { ChatItem, ChatUser, RoomItem } from "../types";
import { useChatWsStore } from "../store/ws.store";

type Params = {
    user: ChatUser | null;
    activeRoomId: string | null;
    activeRoom: RoomItem | null;
    patchRoom: (roomId: string, patcher: (room: RoomItem) => RoomItem) => void;
};

export function useRoomRealtime({
    user,
    activeRoomId,
    activeRoom,
    patchRoom,
}: Params) {
    const wsSubscribe = useChatWsStore((s) => s.subscribe);
    const wsUnsubscribe = useChatWsStore((s) => s.unsubscribe);
    const wsSendSeen = useChatWsStore((s) => s.sendSeen);
    const [typingUsers, setTypingUsers] = useState<string[]>([]);
    const seenMutation = useSeenMutation(activeRoomId ?? "");
    const lastSeenKeyRef = useRef("");

    useEffect(() => {
        if (!activeRoomId) return;
        const handler = (payload: unknown) => {
            const safe = payload as {
                jenis?: string;
                chatAdd?: ChatItem;
                chatId?: string;
                chats_room?: ChatItem[];
                userName?: string;
                status?: boolean;
                event?: string;
                action?: string;
                chat?: {
                    _id: string;
                    pesan: string;
                    pengirim?: { _id: string; email: string; nama: string };
                    idPengirim?: { _id: string; email: string; nama: string };
                    reply?: { pesan?: string; namaPengirim?: string } | null;
                    idChatReply?: { pesan?: string; idPengirim?: { nama?: string } } | null;
                    seenUsers?: Array<{
                        _id?: string;
                        timestamp?: string;
                        namaUser?: string;
                        user?: { _id: string; email: string; nama: string };
                    }>;
                    createdAt?: string;
                    updatedAt?: string;
                };
                chatIds?: string[];
                seenUser?: {
                    user?: { _id: string; email: string; nama: string };
                    timestamp?: number;
                };
            };
            if (safe?.event === "typing" && safe.userName && safe.userName !== user?.nama) {
                setTypingUsers((prev) =>
                    safe.status
                        ? Array.from(new Set([...prev, safe.userName!]))
                        : prev.filter((name) => name !== safe.userName),
                );
                return;
            }
            if (safe?.event === "chat" && safe.action === "delete" && safe.chatId) {
                patchRoom(activeRoomId, (room) => ({
                    ...room,
                    chats: room.chats.filter((chat) => chat._id !== safe.chatId),
                }));
                return;
            }
            if (safe?.event === "chat" && safe.action === "seen" && safe.chatIds && safe.seenUser?.user) {
                const seenAt = new Date(safe.seenUser.timestamp ?? Date.now()).toISOString();
                const seenUser = safe.seenUser.user;
                patchRoom(activeRoomId, (room) => ({
                    ...room,
                    chats: room.chats.map((chat) => {
                        if (!safe.chatIds?.includes(chat._id)) return chat;
                        const already = chat.seenUsers.some(
                            (u) => u.user._id === seenUser._id,
                        );
                        if (already) return chat;
                        return {
                            ...chat,
                            seenUsers: [
                                ...chat.seenUsers,
                                {
                                    _id: "",
                                    timestamp: seenAt,
                                    user: {
                                        _id: seenUser._id,
                                        nama: seenUser.nama,
                                        email: seenUser.email,
                                    },
                                },
                            ],
                        };
                    }),
                }));
                return;
            }
            if (safe?.event === "chat" && safe.action === "add" && safe.chat) {
                const incoming = safe.chat;
                const mappedChat: ChatItem = {
                    _id: String(incoming._id ?? ""),
                    pesan: String(incoming.pesan ?? ""),
                    idPengirim: incoming.pengirim
                        ? {
                              _id: String(incoming.pengirim._id ?? ""),
                              email: String(incoming.pengirim.email ?? ""),
                              nama: String(incoming.pengirim.nama ?? ""),
                          }
                        : {
                              _id: String(incoming.idPengirim?._id ?? ""),
                              email: String(incoming.idPengirim?.email ?? ""),
                              nama: String(incoming.idPengirim?.nama ?? ""),
                          },
                    idChatReply: incoming.reply
                        ? {
                              pesan: String(incoming.reply.pesan ?? ""),
                              idPengirim: {
                                  nama: String(incoming.reply.namaPengirim ?? ""),
                              },
                          }
                        : incoming.idChatReply
                          ? {
                                pesan: String(incoming.idChatReply.pesan ?? ""),
                                idPengirim: {
                                    nama: String(incoming.idChatReply.idPengirim?.nama ?? ""),
                                },
                            }
                          : null,
                    seenUsers: Array.isArray(incoming.seenUsers)
                        ? incoming.seenUsers.map((s) => ({
                              _id: String(s._id ?? ""),
                              timestamp: String(s.timestamp ?? new Date().toISOString()),
                              user: s.user
                                  ? {
                                        _id: String(s.user._id ?? ""),
                                        email: String(s.user.email ?? ""),
                                        nama: String(s.user.nama ?? ""),
                                    }
                                  : {
                                        _id: "",
                                        email: "",
                                        nama: String(s.namaUser ?? ""),
                                    },
                          }))
                        : [],
                    createdAt: String(incoming.createdAt ?? new Date().toISOString()),
                    updatedAt: String(
                        incoming.updatedAt ?? incoming.createdAt ?? new Date().toISOString(),
                    ),
                };
                patchRoom(activeRoomId, (room) => {
                    if (room.chats.some((chat) => chat._id === mappedChat._id)) return room;
                    return { ...room, chats: [...room.chats, mappedChat] };
                });
                return;
            }
            if (safe?.jenis === "typing" && safe.userName && safe.userName !== user?.nama) {
                setTypingUsers((prev) =>
                    safe.status
                        ? Array.from(new Set([...prev, safe.userName!]))
                        : prev.filter((name) => name !== safe.userName),
                );
                return;
            }
            if (safe?.jenis === "seen" && safe.chats_room) {
                patchRoom(activeRoomId, (room) => ({ ...room, chats: safe.chats_room! }));
                return;
            }
            if (safe?.jenis === "chat-delete" && safe.chatId) {
                patchRoom(activeRoomId, (room) => ({
                    ...room,
                    chats: room.chats.filter((chat) => chat._id !== safe.chatId),
                }));
                return;
            }
            if (safe?.jenis !== "chat-add" || !safe.chatAdd) return;
            const chat = safe.chatAdd;
            patchRoom(activeRoomId, (room) => {
                return { ...room, chats: [...room.chats, chat] };
            });
        };
        wsSubscribe(activeRoomId, handler);
        return () => wsUnsubscribe(activeRoomId, handler);
    }, [activeRoomId, patchRoom, user?.nama, wsSubscribe, wsUnsubscribe]);

    useEffect(() => {
        if (!user || !activeRoom || !activeRoomId) return;
        if (activeRoom.chats.length === 0) return;
        const lastChat = activeRoom.chats[activeRoom.chats.length - 1];
        if (!lastChat || lastChat.idPengirim._id === user._id) return;
        const key = `${activeRoomId}:${lastChat._id}`;
        if (lastSeenKeyRef.current === key) return;
        lastSeenKeyRef.current = key;
        seenMutation.mutate(undefined, {
            onSuccess: (res) => {
                const nextChats = activeRoom.chats.map((item) => {
                    if (!res.data.chats.includes(item._id)) return item;
                    const already = item.seenUsers.some((u) => u.user._id === user._id);
                    if (already) return item;
                    return {
                        ...item,
                        seenUsers: [...item.seenUsers, { _id: "", timestamp: new Date().toISOString(), user }],
                    };
                });
                patchRoom(activeRoomId, (room) => ({ ...room, chats: nextChats }));
                wsSendSeen(activeRoomId, res.data.chats, user);
            },
            onError: () => {
                lastSeenKeyRef.current = "";
            },
        });
    }, [activeRoom, activeRoomId, patchRoom, seenMutation, user, wsSendSeen]);

    return { typingUsers, setTypingUsers };
}
