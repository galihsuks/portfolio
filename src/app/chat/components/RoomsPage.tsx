"use client";
import {
  Check,
  CheckCheck,
  ChevronUpIcon,
  LoaderCircle,
  MessageCircle,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatTimeByTimeZone } from "../utils/dateTime";
import { useAuthStore } from "../store/auth.store";
import { useMyProfileQuery } from "../hooks/useUser";
import { useRoomsMainStore } from "../store/roomsMain.store";
import { useOnlineMembersStore } from "../store/onlineMembers.store";
import { useRoomPageQuery } from "../hooks/useRooms";
import { OWNER_EMAIL, ROOM_LIST_LIMIT } from "../config/constants";
import ChatRoomPanel from "./ChatRoomPanel";

export function RoomsPage() {
  /* eslint-disable react-hooks/exhaustive-deps */
  const { user, isOpenChat, setIsOpenChat } = useAuthStore();
  const [open, setOpen] = useState(isOpenChat);
  const { data: profileData } = useMyProfileQuery();
  const {
    totalRooms,
    rooms,
    page,
    nextPage,
    activeRoomId,
    fetchNextRooms,
    setActiveRoomId,
    firstTimestampRenderRooms,
  } = useRoomsMainStore();
  const { isOnlineById, members: membersOnline } = useOnlineMembersStore();
  const listSentinelRef = useRef<HTMLDivElement | null>(null);

  const { data: roomsData, isPending: isRoomsPending } = useRoomPageQuery(
    page,
    ROOM_LIST_LIMIT,
    firstTimestampRenderRooms,
  );

  const [isOnlineById_Trigger, setIsOnlineById_Trigger] = useState(false);
  const [needReload, setNeedReload] = useState(false);

  useEffect(() => {
    setIsOpenChat(false);
  }, []);

  useEffect(() => {
    if (roomsData) {
      if (roomsData.totalRooms === 0) {
        setNeedReload(true);
      }
      fetchNextRooms(roomsData);
    }
  }, [roomsData]);

  useEffect(() => {
    const node = listSentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void nextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rooms]);

  const activeRoom = useMemo(
    () => (activeRoomId ? (rooms.find((room) => room._id === activeRoomId) ?? null) : null),
    [activeRoomId, rooms],
  );

  useEffect(() => {
    setIsOnlineById_Trigger((prev) => !prev);
    console.log(`Trigger online ${isOnlineById_Trigger}`);
  }, [membersOnline]);

  const isOwner = user?.isOwner ?? false;
  useEffect(() => {
    if (user && !user.isOwner && rooms.length > 0) {
      const privateWithOwner = rooms.find(
        (room) =>
          room.tipe === "private" &&
          room.anggota.some((anggota) => anggota.email?.toLowerCase() === OWNER_EMAIL),
      );
      if (privateWithOwner?._id) setActiveRoomId(privateWithOwner._id);
    }
  }, [user, rooms]);

  useEffect(() => {
    if (needReload) {
      console.log("need reload");
      setIsOpenChat(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }, [needReload]);

  if (isRoomsPending && page === 1) {
    return (
      <>
        <div
          onClick={() => setOpen((p) => !p)}
          className={`cursor-pointer transition-all duration-400 fixed z-50 flex bottom-3 md:bottom-6 right-3 md:right-6 ${open ? "h-10 w-10 rotate-180" : "h-14 w-14"} glass items-center justify-center rounded-full backdrop-blur-xs`}
        >
          {open ? <ChevronUpIcon className="h-4 w-4" /> : <MessageCircle className="h-6 w-6" />}
        </div>
        <div
          data-lenis-prevent
          className={`transition-all duration-400 overflow-hidden fixed z-50 flex justify-center items-center flex-col gap-2 rounded-xl bg-black/70 border-white/10 backdrop-blur-lg md:bottom-20 md:right-6 bottom-16 right-3 ${open ? `h-[520px] w-[95%] border ${isOwner ? "md:w-[900px]" : "md:w-[350px]"}` : "h-[0px] w-[0px]"}`}
        >
          <LoaderCircle className="size-10 animate-spin" />
          <p className="text-[11px] text-center">Loading rooms..</p>
        </div>
      </>
    );
  }

  if (needReload) {
    return (
      <>
        <div
          onClick={() => setOpen((p) => !p)}
          className={`cursor-pointer transition-all duration-400 fixed z-50 flex bottom-3 md:bottom-6 right-3 md:right-6 ${open ? "h-10 w-10 rotate-180" : "h-14 w-14"} glass items-center justify-center rounded-full backdrop-blur-xs`}
        >
          {open ? <ChevronUpIcon className="h-4 w-4" /> : <MessageCircle className="h-6 w-6" />}
        </div>
        <div
          data-lenis-prevent
          className={`transition-all duration-400 overflow-hidden fixed z-50 flex justify-center items-center flex-col gap-2 rounded-xl bg-black/70 border-white/10 backdrop-blur-lg md:bottom-20 md:right-6 bottom-16 right-3 ${open ? `h-[520px] w-[95%] border ${isOwner ? "md:w-[900px]" : "md:w-[350px]"}` : "h-[0px] w-[0px]"}`}
        >
          <TriangleAlert className="size-10" />
          <p className="text-[11px] text-center">
            I will try to get the rooms again after 1 second..
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <div
        onClick={() => setOpen((p) => !p)}
        className={`cursor-pointer transition-all duration-400 fixed z-50 flex bottom-3 md:bottom-6 right-3 md:right-6 ${open ? "h-10 w-10 rotate-180" : "h-14 w-14"} glass items-center justify-center rounded-full backdrop-blur-xs`}
      >
        {open ? <ChevronUpIcon className="h-4 w-4" /> : <MessageCircle className="h-6 w-6" />}
      </div>
      <div
        data-lenis-prevent
        className={`transition-all duration-400 overflow-hidden fixed z-50 flex rounded-xl bg-black/70 border-white/10 backdrop-blur-lg md:bottom-20 md:right-6 bottom-16 right-3 ${open ? `h-[520px] w-[95%] border ${isOwner ? "md:w-[900px]" : "md:w-[350px]"}` : "h-[0px] w-[0px]"}`}
      >
        <aside
          className={`${activeRoom ? `hidden ${isOwner ? "md:flex" : ""}` : "flex"} w-full md:w-[320px] min-h-0 flex-col border-r border-white/10`}
        >
          <div className="px-4 py-3 border-b border-white/10">
            <p className="font-semibold">Chat Rooms</p>
            <p className="text-[10px] opacity-70">v2.1</p>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {isRoomsPending && page === 1 && (
              <p className="text-sm text-slate-300">Loading rooms...</p>
            )}

            <div className="space-y-2">
              {rooms.map((room) => {
                const privateFriend =
                  room.tipe === "private"
                    ? room.anggota.find((anggota) => anggota._id !== user?.id)
                    : null;
                const isOnline = privateFriend ? isOnlineById(privateFriend._id) : false;
                const typingNames = (room.typing ?? []).filter((name) => name !== user?.nama);
                const typingLabel =
                  typingNames.length > 1
                    ? `${typingNames.length} people are typing...`
                    : typingNames[0]
                      ? `${typingNames[0].trim().split(/\s+/)[0]} is typing...`
                      : null;
                const senderFirstName =
                  room.tipe === "group"
                    ? (room.lastchat?.namaPengirim?.trim().split(/\s+/)[0] ?? "")
                    : "";
                const isMineLastChat =
                  Boolean(user?.nama) && (room.lastchat?.namaPengirim ?? "") === user?.nama;
                const senderLabel = isMineLastChat ? "You" : senderFirstName;
                const lastChatPreview =
                  room.tipe === "group" && senderLabel && room.lastchat?.pesan
                    ? `${senderLabel}: ${room.lastchat.pesan}`
                    : (room.lastchat?.pesan ?? "No messages yet");
                const lastChatTotalReadersTarget = Math.max(
                  Number(room.lastchat?.totalReadersTarget ?? 0),
                  0,
                );
                const lastChatSeenUsers = Math.max(Number(room.lastchat?.seenUsers ?? 0), 0);
                const lastChatOtherSeenUsers = Math.max(lastChatSeenUsers - 1, 0);
                const hasAnyReader = lastChatOtherSeenUsers > 0;
                const hasAllReaders =
                  lastChatTotalReadersTarget > 0 &&
                  lastChatOtherSeenUsers >= lastChatTotalReadersTarget;
                const lastChatTime = room.updatedAt
                  ? formatTimeByTimeZone(room.updatedAt, profileData?.timezone)
                  : "";

                return (
                  <button
                    key={room._id}
                    className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                      activeRoomId === room._id
                        ? "border-cyan-300/70 bg-cyan-400/10"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                    onClick={() => setActiveRoomId(room._id)}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold">{room.nama}</p>
                        {room.tipe === "private" && isOnline && (
                          <span className="h-2 w-2 rounded-full bg-green-400" />
                        )}
                      </div>
                      {typingLabel ? (
                        <p className="truncate text-xs text-cyan-300">{typingLabel}</p>
                      ) : (
                        <div className="flex items-center gap-1">
                          {isMineLastChat && room.lastchat && (
                            <span className={hasAllReaders ? "text-cyan-300" : "text-white"}>
                              {!hasAnyReader ? <Check size={12} /> : <CheckCheck size={12} />}
                            </span>
                          )}
                          <p className="truncate text-xs text-slate-300">{lastChatPreview}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex min-w-[34px] flex-col items-end gap-1">
                      {lastChatTime && (
                        <span className="text-[10px] text-slate-300">{lastChatTime}</span>
                      )}
                      {room.unread > 0 && (
                        <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-pink-400 px-1.5 text-[10px] font-semibold text-slate-900">
                          {room.unread}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {rooms.length > 0 && rooms.length < totalRooms && (
              <div ref={listSentinelRef} className="py-2">
                {isRoomsPending && page > 1 && (
                  <p className="text-xs text-slate-300">Loading more rooms...</p>
                )}
              </div>
            )}
          </div>
        </aside>
        <section className="flex-1 min-h-0 flex flex-col">
          {activeRoom ? (
            <ChatRoomPanel onExitRoom={() => setActiveRoomId(null)} roomDetailData={activeRoom} />
          ) : (
            <div className="h-full flex justify-center items-center p-5">
              <p className="text-sm text-slate-300">Select a room to open chat.</p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
