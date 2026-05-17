"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChevronUpIcon, MessageCircle } from "lucide-react";
import { useMessages } from "next-intl";
import { newMessageWithPending } from "../_services/utils";
import { getOnlineUsers, logout as logoutApi } from "../_services/api";
import {
    chatAuthApi,
    useAddMembersRoomMutation,
    useDeleteChatMutation,
    useRoomDetailQuery,
    useRoomsQuery,
    useSendChatMutation,
} from "../chat/hooks/useChatData";
import { useChatAuthStore } from "../chat/store/auth.store";
import { useChatRoomsStore } from "../chat/store/rooms.store";
import { useChatWsStore } from "../chat/store/ws.store";
import { useOnlineMembersStore } from "../chat/store/onlineMembers.store";
import { ChatItem } from "../chat/types";
import RoomListPanel from "../chat/components/RoomListPanel";
import ChatRoomPanel from "../chat/components/ChatRoomPanel";
import { usePreAuthFlow } from "../chat/hooks/usePreAuthFlow";
import { useRoomRealtime } from "../chat/hooks/useRoomRealtime";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { refetchOnWindowFocus: false, staleTime: 10000 },
    },
});

function ChatAppCore() {
    const OWNER_EMAIL = "galih8.4.2001@gmail.com";
    const messages = useMessages();
    const chatbotLocale = messages.chatbot as {
        opening: string;
        already_visit: string;
    };
    const lang = (messages.lang as { code?: string } | undefined)?.code ?? "id";
    const isEn = lang === "en";
    const wsConnect = useChatWsStore((s) => s.connect);
    const wsDisconnect = useChatWsStore((s) => s.disconnect);
    const wsShutdown = useChatWsStore((s) => s.shutdown);
    const wsSendOnline = useChatWsStore((s) => s.sendOnline);
    const wsSendChatAdd = useChatWsStore((s) => s.sendChatAdd);
    const wsSendTyping = useChatWsStore((s) => s.sendTyping);
    const wsSendChatDelete = useChatWsStore((s) => s.sendChatDelete);
    const hydrateOnlineMembers = useOnlineMembersStore((s) => s.hydrateFromApi);
    const { user, isOwner, setAuth, clearAuth } = useChatAuthStore();
    const {
        rooms,
        setRooms,
        activeRoomId,
        setActiveRoomId,
        patchRoom,
        upsertRoom,
    } = useChatRoomsStore();
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const [actionError, setActionError] = useState("");
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [memberEmailDraft, setMemberEmailDraft] = useState("");
    const [replyTarget, setReplyTarget] = useState<ChatItem | null>(null);
    const [pendingIds, setPendingIds] = useState<string[]>([]);
    const activeRoom = useMemo(
        () => rooms.find((r) => r._id === activeRoomId) ?? null,
        [rooms, activeRoomId],
    );
    const roomsQuery = useRoomsQuery(Boolean(user && isOwner));
    const roomDetailQuery = useRoomDetailQuery(
        activeRoomId ?? "",
        Boolean(user && activeRoomId),
    );
    const sendMutation = useSendChatMutation(activeRoomId ?? "");
    const deleteMutation = useDeleteChatMutation();
    const addMembersMutation = useAddMembersRoomMutation(activeRoomId ?? "");
    const listRef = useRef<HTMLDivElement | null>(null);
    const typingTimeout = useRef<number | null>(null);
    const { loading, botLines, onPreAuthMessage } = usePreAuthFlow({
        setAuth,
        setActiveRoomId,
        localeText: {
            opening: chatbotLocale.opening,
            already_visit: chatbotLocale.already_visit,
            loading_owner: isEn ? "Logging in as owner..." : "Login owner...",
            loading_search_user: isEn
                ? "Looking for user..."
                : "Mencari user...",
            invalid_owner_code: isEn
                ? "Invalid owner code"
                : "Kode unik tidak valid",
        },
    });
    const { typingUsers } = useRoomRealtime({
        user,
        activeRoomId,
        activeRoom,
        patchRoom,
    });

    useEffect(() => {
        wsConnect();
        return () => wsDisconnect();
    }, [wsConnect, wsDisconnect]);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            if (user) return;
            const me = await chatAuthApi.getMe();
            if (cancelled || me.status !== 200) return;
            const nextUser = {
                _id: String(me.data._id ?? ""),
                email: String(me.data.email ?? ""),
                nama: String(me.data.nama ?? ""),
            };
            const ownerRole = nextUser.email === OWNER_EMAIL;
            setAuth(nextUser, ownerRole);
            if (!ownerRole) {
                const roomId = await chatAuthApi.getRoomIdGalih();
                if (roomId) setActiveRoomId(roomId);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [setActiveRoomId, setAuth, user]);

    useEffect(() => {
        if (!user?._id) return;
        wsSendOnline(user._id);
    }, [user?._id, wsSendOnline]);

    useEffect(() => {
        if (
            roomsQuery.data?.status === 200 &&
            Array.isArray(roomsQuery.data.data)
        ) {
            setRooms(roomsQuery.data.data.map((r) => ({ ...r, chats: [] })));
            if (isOwner && !activeRoomId && roomsQuery.data.data.length > 0) {
                setActiveRoomId(roomsQuery.data.data[0]._id);
            }
        }
    }, [activeRoomId, isOwner, roomsQuery.data, setActiveRoomId, setRooms]);

    useEffect(() => {
        (async () => {
            if (!user || rooms.length === 0) return;
            const memberIds = Array.from(
                new Set(
                    rooms
                        .flatMap((room) => room.anggota.map((a) => a._id))
                        .filter((id) => id && id !== user._id),
                ),
            );
            if (memberIds.length === 0) return;
            const res = await getOnlineUsers(memberIds);
            if (res.status === 200 && Array.isArray(res.data)) {
                hydrateOnlineMembers(res.data);
            }
        })();
    }, [hydrateOnlineMembers, rooms, user]);

    useEffect(() => {
        if (roomDetailQuery.data?.status === 200) {
            const room = roomDetailQuery.data.data.room;
            upsertRoom({ ...room, chats: room.chats });
        }
    }, [roomDetailQuery.data, upsertRoom]);

    useEffect(() => {
        listRef.current?.scrollTo({
            top: listRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [activeRoom?.chats, botLines]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const text = input.trim();
        if (!text) return;
        setInput("");
        if (!user) {
            await onPreAuthMessage(text);
            return;
        }
        if (!activeRoomId || !activeRoom) return;
        const pending = newMessageWithPending(text, replyTarget, user);
        setPendingIds((p) => [...p, pending._id]);
        patchRoom(activeRoomId, (room) => {
            return {
                ...room,
                chats: [...room.chats, pending],
            };
        });
        const sent = await sendMutation.mutateAsync({
            pesan: text,
            idChatReply: replyTarget?._id ?? null,
        });
        setPendingIds((p) => p.filter((id) => id !== pending._id));
        setReplyTarget(null);
        if (sent.status === 200) {
            wsSendChatAdd(activeRoomId, sent.data);
        }
    };

    const onTyping = (value: string) => {
        setInput(value);
        if (!user || !activeRoomId) return;
        wsSendTyping(activeRoomId, user.nama, true);
        if (typingTimeout.current) window.clearTimeout(typingTimeout.current);
        typingTimeout.current = window.setTimeout(() => {
            wsSendTyping(activeRoomId, user.nama, false);
        }, 1200);
    };

    const onDeleteChat = async (chatId: string) => {
        if (!activeRoomId || !activeRoom) return;
        const snapshot = activeRoom.chats;
        patchRoom(activeRoomId, (room) => ({
            ...room,
            chats: room.chats.filter((chat) => chat._id !== chatId),
        }));
        let res;
        try {
            res = await deleteMutation.mutateAsync(chatId);
        } catch {
            patchRoom(activeRoomId, (room) => ({ ...room, chats: snapshot }));
            return;
        }
        if (res.status === 200) {
            wsSendChatDelete(activeRoomId, chatId);
        } else {
            patchRoom(activeRoomId, (room) => ({ ...room, chats: snapshot }));
        }
    };

    const onAddMember = async () => {
        if (!activeRoomId) return;
        setActionError("");
        const email = memberEmailDraft.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setActionError("Format email tidak valid.");
            return;
        }
        const res = await addMembersMutation.mutateAsync([email]);
        if (res.status === 200) {
            const keepChats = activeRoom?.chats ?? [];
            upsertRoom({ ...res.data, chats: keepChats });
            setAddModalOpen(false);
            setMemberEmailDraft("");
        }
    };

    const onLogoutChat = async () => {
        try {
            await logoutApi();
        } finally {
            wsShutdown();
            clearAuth();
            setRooms([]);
            setActiveRoomId(null);
            setReplyTarget(null);
            setPendingIds([]);
            setAddModalOpen(false);
            setInput("");
            window.location.reload();
        }
    };

    const roomItems = isOwner ? rooms : activeRoom ? [activeRoom] : [];

    return (
        <>
            <button
                onClick={() => setOpen((p) => !p)}
                className={`cursor-pointer fixed z-50 flex bottom-3 md:bottom-6 right-3 md:right-6 ${open ? "h-10 w-10 rotate-180" : "h-14 w-14"} glass items-center justify-center rounded-full`}
            >
                {open ? (
                    <ChevronUpIcon className="h-4 w-4" />
                ) : (
                    <MessageCircle className="h-6 w-6" />
                )}
            </button>
            <div
                className={`transition-all duration-400 overflow-hidden fixed z-50 flex rounded-xl bg-black/70 border-white/10 backdrop-blur-lg md:bottom-20 md:right-6 bottom-16 right-3 ${open ? "h-[520px] md:w-[900px] w-[95%] border" : "h-[0px] w-[0px]"}`}
            >
                {isOwner && (
                    <RoomListPanel
                        rooms={roomItems}
                        activeRoomId={activeRoomId}
                        setActiveRoomId={(roomId) => setActiveRoomId(roomId)}
                        currentUserId={user?._id}
                    />
                )}
                <ChatRoomPanel
                    user={user}
                    activeRoom={activeRoom}
                    botLines={botLines}
                    pendingIds={pendingIds}
                    typingUsers={typingUsers}
                    loading={loading}
                    input={input}
                    onInput={onTyping}
                    onSubmit={handleSubmit}
                    replyTarget={replyTarget}
                    onClearReply={() => setReplyTarget(null)}
                    onReply={(chat) => setReplyTarget(chat)}
                    onDelete={onDeleteChat}
                    isOwner={isOwner}
                    onBackToRooms={() => setActiveRoomId(null)}
                    onAddMember={() => {
                        setActionError("");
                        setMemberEmailDraft("");
                        setAddModalOpen(true);
                    }}
                    onLogout={onLogoutChat}
                    listRef={listRef}
                />
            </div>
            {addModalOpen && (
                <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
                    <div className="glass rounded-xl w-full max-w-sm p-4">
                        <p className="font-semibold mb-2">
                            Add Member by Email
                        </p>
                        <input
                            value={memberEmailDraft}
                            onChange={(e) =>
                                setMemberEmailDraft(e.target.value)
                            }
                            className="w-full rounded-lg border border-white/20 bg-transparent px-3 py-2"
                            placeholder="email@domain.com"
                        />
                        {actionError && (
                            <p className="text-xs text-pink-300 mt-2">
                                {actionError}
                            </p>
                        )}
                        <div className="flex justify-end gap-2 mt-3">
                            <button
                                type="button"
                                onClick={() => setAddModalOpen(false)}
                                className="text-xs px-3 py-1 rounded border border-white/20"
                            >
                                cancel
                            </button>
                            <button
                                type="button"
                                onClick={onAddMember}
                                disabled={addMembersMutation.isPending}
                                className="text-xs px-3 py-1 rounded border border-white/20 disabled:opacity-50"
                            >
                                {addMembersMutation.isPending
                                    ? "adding..."
                                    : "add"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default function ChatApp() {
    return (
        <QueryClientProvider client={queryClient}>
            <ChatAppCore />
        </QueryClientProvider>
    );
}
