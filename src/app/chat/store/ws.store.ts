import { create } from "zustand";
import { envVar } from "../../_services/utils";
import { useOnlineMembersStore } from "./onlineMembers.store";

type Handler = (payload: unknown) => void;
type WsRoomPayload = {
    jenis?: string;
    chatAdd?: unknown;
    chats_room?: unknown[];
    userName?: string;
    status?: boolean;
    chatId?: string;
};

type WsState = {
    ws: WebSocket | null;
    handlers: Record<string, Handler[]>;
    subscribedRooms: Record<string, number>;
    pendingOnlinePrimaryKey: string | null;
    shouldReconnect: boolean;
    connect: () => void;
    disconnect: () => void;
    shutdown: () => void;
    subscribe: (roomId: string, handler: Handler) => void;
    unsubscribe: (roomId: string, handler: Handler) => void;
    sendOnline: (primary_key: string) => void;
    sendSeen: (
        room_id: string,
        chatIds: string[],
        seenUser: { _id: string; nama: string; email: string },
    ) => void;
    sendChatAdd: (room_id: string, chatAdd: unknown) => void;
    sendChatDelete: (room_id: string, chatId: string) => void;
    sendTyping: (room_id: string, userName: string, status: boolean) => void;
};

const WS_APP_ID = "omong";

export const useChatWsStore = create<WsState>((set, get) => ({
    ws: null,
    handlers: {},
    subscribedRooms: {},
    pendingOnlinePrimaryKey: null,
    shouldReconnect: true,
    connect: () => {
        if (!get().shouldReconnect) return;
        const existingWs = get().ws;
        if (
            existingWs &&
            (existingWs.readyState === WebSocket.OPEN ||
                existingWs.readyState === WebSocket.CONNECTING)
        ) {
            return;
        }
        const ws = new WebSocket(envVar.websocketURL);
        ws.onopen = () => {
            const pendingOnlinePrimaryKey = get().pendingOnlinePrimaryKey;
            if (pendingOnlinePrimaryKey) {
                ws.send(
                    JSON.stringify({
                        tipe: "online",
                        data: {
                            app_id: WS_APP_ID,
                            primary_key: pendingOnlinePrimaryKey,
                        },
                    }),
                );
                set({ pendingOnlinePrimaryKey: null });
            }
            Object.entries(get().subscribedRooms).forEach(([roomId, count]) => {
                if (count <= 0) return;
                ws.send(
                    JSON.stringify({
                        tipe: "subscribe",
                        data: { app_id: WS_APP_ID, room_id: roomId },
                    }),
                );
            });
        };
        ws.onmessage = (event) => {
            const parsed = JSON.parse(event.data);
            if (parsed?.data?.app_id && parsed.data.app_id !== WS_APP_ID) return;
            if (parsed.tipe === "online") {
                const clients = Array.isArray(parsed?.data?.clients)
                    ? (parsed.data.clients as string[])
                    : [];
                useOnlineMembersStore.getState().syncFromOnlineIds(clients);
                return;
            }
            if (parsed.tipe !== "send") return;
            const roomId = parsed.data?.room_id as string;
            const payload = (parsed.data?.payload ?? {}) as WsRoomPayload;
            (get().handlers[roomId] ?? []).forEach((handler) => handler(payload));
        };
        ws.onclose = () => {
            set({ ws: null });
            if (!get().shouldReconnect) return;
            window.setTimeout(() => {
                get().connect();
            }, 1000);
        };
        set({ ws });
    },
    disconnect: () => {
        const ws = get().ws;
        if (ws) ws.close();
        set({ ws: null, handlers: {}, subscribedRooms: {}, shouldReconnect: true });
    },
    shutdown: () => {
        set({ shouldReconnect: false });
        const ws = get().ws;
        if (ws) ws.close();
        set({ ws: null, handlers: {}, subscribedRooms: {} });
    },
    subscribe: (roomId, handler) => {
        const ws = get().ws;
        const next = [...(get().handlers[roomId] ?? []), handler];
        const currentCount = get().subscribedRooms[roomId] ?? 0;
        const nextCount = currentCount + 1;
        set({
            handlers: { ...get().handlers, [roomId]: next },
            subscribedRooms: { ...get().subscribedRooms, [roomId]: nextCount },
        });
        if (currentCount > 0) return;
        if (ws?.readyState === WebSocket.OPEN) {
            ws.send(
                JSON.stringify({
                    tipe: "subscribe",
                    data: { app_id: WS_APP_ID, room_id: roomId },
                }),
            );
        } else {
            ws?.addEventListener(
                "open",
                () => {
                    ws.send(
                        JSON.stringify({
                            tipe: "subscribe",
                            data: { app_id: WS_APP_ID, room_id: roomId },
                        }),
                    );
                },
                { once: true },
            );
        }
    },
    unsubscribe: (roomId, handler) => {
        const ws = get().ws;
        const remain = (get().handlers[roomId] ?? []).filter((h) => h !== handler);
        const handlers = { ...get().handlers, [roomId]: remain };
        if (remain.length === 0) delete handlers[roomId];
        const currentCount = get().subscribedRooms[roomId] ?? 0;
        const nextCount = Math.max(currentCount - 1, 0);
        const subscribedRooms = { ...get().subscribedRooms, [roomId]: nextCount };
        if (nextCount === 0) delete subscribedRooms[roomId];
        set({ handlers, subscribedRooms });
        if (nextCount === 0 && ws?.readyState === WebSocket.OPEN) {
            ws.send(
                JSON.stringify({
                    tipe: "unsubscribe",
                    data: { app_id: WS_APP_ID, room_id: roomId },
                }),
            );
        }
    },
    sendOnline: (primary_key) => {
        const ws = get().ws;
        const packet = JSON.stringify({
            tipe: "online",
            data: { app_id: WS_APP_ID, primary_key },
        });
        if (ws?.readyState === WebSocket.OPEN) {
            ws.send(packet);
            set({ pendingOnlinePrimaryKey: null });
        } else if (ws) {
            ws.addEventListener("open", () => ws.send(packet), { once: true });
            set({ pendingOnlinePrimaryKey: primary_key });
        } else {
            set({ pendingOnlinePrimaryKey: primary_key });
            get().connect();
        }
    },
    sendSeen: (room_id, chatIds, seenUser) => {
        const ws = get().ws;
        if (ws?.readyState !== WebSocket.OPEN) return;
        ws.send(
            JSON.stringify({
                tipe: "send",
                data: {
                    app_id: WS_APP_ID,
                    room_id,
                    payload: {
                        event: "chat",
                        action: "seen",
                        roomId: room_id,
                        chatIds,
                        seenUser: {
                            user: {
                                _id: seenUser._id,
                                nama: seenUser.nama,
                                email: seenUser.email,
                            },
                            timestamp: Date.now(),
                        },
                    },
                },
            }),
        );
    },
    sendChatAdd: (room_id, chatAdd) => {
        const ws = get().ws;
        if (ws?.readyState !== WebSocket.OPEN) return;
        ws.send(
            JSON.stringify({
                tipe: "send",
                data: {
                    app_id: WS_APP_ID,
                    room_id,
                    payload: {
                        event: "chat",
                        action: "add",
                        roomId: room_id,
                        chat: {
                            ...(chatAdd as Record<string, unknown>),
                            pengirim: (chatAdd as { idPengirim?: unknown })?.idPengirim,
                            reply: (chatAdd as { idChatReply?: unknown })?.idChatReply
                                ? {
                                      _id: "",
                                      pesan: (
                                          (chatAdd as {
                                              idChatReply?: { pesan?: string };
                                          })?.idChatReply?.pesan ?? ""
                                      ) as string,
                                      namaPengirim: (
                                          (chatAdd as {
                                              idChatReply?: {
                                                  idPengirim?: { nama?: string };
                                              };
                                          })?.idChatReply?.idPengirim?.nama ?? ""
                                      ) as string,
                                  }
                                : null,
                        },
                    },
                },
            }),
        );
    },
    sendChatDelete: (room_id, chatId) => {
        const ws = get().ws;
        if (ws?.readyState !== WebSocket.OPEN) return;
        ws.send(
            JSON.stringify({
                tipe: "send",
                data: {
                    app_id: WS_APP_ID,
                    room_id,
                    payload: {
                        event: "chat",
                        action: "delete",
                        roomId: room_id,
                        chatId,
                    },
                },
            }),
        );
    },
    sendTyping: (room_id, userName, status) => {
        const ws = get().ws;
        if (ws?.readyState !== WebSocket.OPEN) return;
        ws.send(
            JSON.stringify({
                tipe: "send",
                data: {
                    app_id: WS_APP_ID,
                    room_id,
                    payload: {
                        event: "typing",
                        roomId: room_id,
                        userName,
                        status,
                    },
                },
            }),
        );
    },
}));
