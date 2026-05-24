"use client";
/* eslint-disable react-hooks/exhaustive-deps */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RoomsPage } from "../chat/components/RoomsPage";
import { useAuthStore } from "../chat/store/auth.store";
import { useRoomsMainStore } from "../chat/store/roomsMain.store";
import { useWsStore } from "../chat/store/ws.store";
import { useEffect, useMemo } from "react";
import { WsPayload } from "../chat/types/domain";
import { getRoomsPageApi } from "../_services/api/room.api";
import { ROOM_LIST_LIMIT } from "../chat/config/constants";
import ChatAppNoLogin from "./ChatAppNoLogin";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, staleTime: 10000 },
  },
});

export function ChatAppCore() {
  const { user, hydrated, hydrateFromStorage, loginProcess } = useAuthStore();
  const { handleRealtimePayload, rooms, hydrateRoomsPage } = useRoomsMainStore();
  const { connect, disconnect, sendOnline, subscribe, unsubscribe } = useWsStore();

  const roomIdsKey = rooms.map((room) => room._id).join("|");
  const roomIds = useMemo(() => rooms.map((room) => room._id), [roomIdsKey]);

  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  useEffect(() => {
    if (!user?.id) {
      disconnect();
      return;
    }
    connect();
    sendOnline(user.id);
  }, [connect, disconnect, sendOnline, user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    if (!roomIds.length) return;

    const unsubs: Array<() => void> = [];
    roomIds.forEach((roomId) => {
      const handler = (payload: unknown) => {
        const data = payload as WsPayload;
        handleRealtimePayload(roomId, data, user?.nama);
      };
      subscribe(roomId, handler);
      unsubs.push(() => unsubscribe(roomId, handler));
    });

    return () => {
      unsubs.forEach((fn) => fn());
    };
  }, [handleRealtimePayload, roomIdsKey, roomIds, subscribe, unsubscribe, user?.id, user?.nama]);

  useEffect(() => {
    if (!user?.id) return;
    const userChannel = `__user__:${user.id}`;
    const handler = (payload: unknown) => {
      const data = payload as WsPayload;
      if (data.event !== "room") return;
      if (data.action !== "add" && data.action !== "update" && data.action !== "delete") return;
      void getRoomsPageApi(1, ROOM_LIST_LIMIT, new Date().toISOString()).then((result) => {
        hydrateRoomsPage(result);
      });
    };

    subscribe(userChannel, handler);
    return () => unsubscribe(userChannel, handler);
  }, [hydrateRoomsPage, subscribe, unsubscribe, user?.id]);

  if (!hydrated || !user || loginProcess) return <ChatAppNoLogin />;
  return <RoomsPage />;
}

export default function ChatApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChatAppCore />
    </QueryClientProvider>
  );
}
