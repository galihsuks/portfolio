"use client";

import { Chat } from "../types/domain";
import { FormEvent, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useAuthStore } from "../store/auth.store";
import { useRoomsMainStore } from "../store/roomsMain.store";
import { useWsStore } from "../store/ws.store";
import { useOnlineMembersStore } from "../store/onlineMembers.store";
import {
  useAddChatMutation,
  useChatPageQuery,
  useDeleteChatMutation,
  useSeenRoomMutation,
} from "../hooks/useChatMutations";
import { ROOM_CHAT_LIMIT } from "../config/constants";
import { useMyProfileQuery } from "../hooks/useUser";
import { formatShortDateTimeByTimeZone } from "../utils/dateTime";
import { ArrowLeft, LogOut, MessagesSquare, Send } from "lucide-react";
import BubbleChat, { ChatBubblePending } from "../../components/ChatAppBubble";
import { useLogoutMutation } from "../hooks/useAuthMutation";

type RoomChatItem = {
  totalReadersTarget: number;
  _id: string;
  pesan: string;
  pengirim: { _id: string; email: string; nama: string };
  reply: null | { _id: string; pesan: string; namaPengirim: string };
  isPending: boolean;
  seenUsers: Array<{ timestamp: string; namaUser: string }>;
  createdAt: string;
};

type RoomMainItem = {
  _id: string;
  nama: string;
  tipe: "private" | "group";
  anggota: Array<{ _id: string; email: string; nama: string }>;
  lastchat: null | {
    totalReadersTarget: number;
    _id: string;
    pesan: string;
    namaPengirim: string;
    seenUsers: number;
  };
  updatedAt: string;
  unread: number;
  typing: string[];
  page: number;
  newestTime: string;
  totalChats?: number;
  chats?: RoomChatItem[];
};

type Props = {
  embedded?: boolean;
  onExitRoom?: () => void;
  roomDetailData: RoomMainItem;
};

export default function ChatRoomPanel({ onExitRoom, roomDetailData }: Props) {
  /* eslint-disable react-hooks/exhaustive-deps */
  const roomId = roomDetailData._id;
  const { user, setUser } = useAuthStore();
  const { fetchRoomChatsPage, nextPage, handleRealtimePayload } = useRoomsMainStore();
  const { send } = useWsStore();
  const { isOnlineById, getLastSeenById, members } = useOnlineMembersStore();

  const [message, setMessage] = useState("");
  const [replyTarget, setReplyTarget] = useState<Chat | null>(null);

  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const messageInputRef = useRef<HTMLInputElement | null>(null);
  const listSentinelRef = useRef<HTMLDivElement | null>(null);
  const shouldAutoScrollRef = useRef(true);
  const mySelfTyping = useRef(false);
  const lastSeenRequestKeyRef = useRef("");
  const typingIdleTimeoutRef = useRef<number | null>(null);

  const { data: chatsData, isPending: isChatsPending } = useChatPageQuery(
    roomId,
    roomDetailData.page,
    ROOM_CHAT_LIMIT,
    roomDetailData.newestTime,
  );
  const { mutate: addChat, isPending: isAddChatPending } = useAddChatMutation(roomId);
  const { mutate: deleteChat } = useDeleteChatMutation();
  const { mutate: markRoomSeen } = useSeenRoomMutation(roomId);
  const { mutate: logoutMutation, isPending: isLogoutPending } = useLogoutMutation();
  const { data: profileData } = useMyProfileQuery();

  useEffect(() => {
    if (chatsData) fetchRoomChatsPage(roomId, chatsData);
  }, [chatsData]);

  useEffect(() => {
    if (!roomId || !user?.nama) return;
    if (message.trim()) {
      if (!mySelfTyping.current) {
        mySelfTyping.current = true;
        send(roomId, { event: "typing", roomId, userName: user.nama, status: true });
      }
      if (typingIdleTimeoutRef.current) {
        window.clearTimeout(typingIdleTimeoutRef.current);
      }
      typingIdleTimeoutRef.current = window.setTimeout(() => {
        mySelfTyping.current = false;
        send(roomId, { event: "typing", roomId, userName: user.nama, status: false });
      }, 2500);
    } else {
      if (typingIdleTimeoutRef.current) {
        window.clearTimeout(typingIdleTimeoutRef.current);
        typingIdleTimeoutRef.current = null;
      }
      mySelfTyping.current = false;
      send(roomId, { event: "typing", roomId, userName: user.nama, status: false });
    }
  }, [message, roomId, send, user?.nama]);

  const chats = useMemo(() => roomDetailData?.chats ?? [], [roomDetailData?.chats]);
  const totalChats = useMemo(() => roomDetailData?.totalChats ?? 0, [roomDetailData?.totalChats]);
  const latestChat = chats.length ? chats[chats.length - 1] : null;

  useEffect(() => {
    return () => {
      if (typingIdleTimeoutRef.current) {
        window.clearTimeout(typingIdleTimeoutRef.current);
        typingIdleTimeoutRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!roomId || !user?.id || !latestChat) return;
    if (latestChat.pengirim._id === user.id) return;

    const seenKey = `${roomId}:${latestChat._id}`;
    if (lastSeenRequestKeyRef.current === seenKey) return;
    lastSeenRequestKeyRef.current = seenKey;

    markRoomSeen(undefined, {
      onSuccess: (result) => {
        handleRealtimePayload(
          roomId,
          {
            event: "chat",
            action: "seen",
            roomId,
            chatIds: result.chats,
            seenUser: result.addToSeenUsers,
          },
          user?.nama,
        );
        send(roomId, {
          event: "chat",
          action: "seen",
          roomId,
          chatIds: result.chats,
          seenUser: result.addToSeenUsers,
        });
      },
      onError: () => {
        lastSeenRequestKeyRef.current = "";
      },
    });
  }, [handleRealtimePayload, latestChat, markRoomSeen, roomId, send, user?.id, user?.nama]);

  const roomDisplayName = useMemo(() => {
    if (!roomDetailData) return "Room";
    if (roomDetailData.tipe !== "private") return roomDetailData.nama ?? "Room";

    const friend = roomDetailData.anggota.find((anggota) => anggota._id !== user?.id);
    return friend?.nama ?? roomDetailData.nama ?? "Private Room";
  }, [roomDetailData, user?.id]);

  const roomSubtitle = useMemo(() => {
    if (!roomDetailData) return "";

    if (roomDetailData.tipe !== "private") {
      return `${roomDetailData.anggota.length} members`;
    }

    const friend = roomDetailData.anggota.find((anggota) => anggota._id !== user?.id);
    if (!friend) return "Private chat";

    if (isOnlineById(friend._id)) return "Online";

    const friendLastSeen = getLastSeenById(friend._id);
    if (friendLastSeen) {
      const last = new Date(friendLastSeen);
      const formatted = Number.isNaN(last.getTime())
        ? "recently"
        : formatShortDateTimeByTimeZone(friendLastSeen, profileData?.timezone);
      return `Last seen ${formatted}`;
    }

    return "Offline";
  }, [getLastSeenById, isOnlineById, profileData?.timezone, roomDetailData, user?.id, members]);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const threshold = 24;
    const updateAutoScrollFlag = () => {
      const distanceFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;
      shouldAutoScrollRef.current = distanceFromBottom <= threshold;
    };

    updateAutoScrollFlag();
    container.addEventListener("scroll", updateAutoScrollFlag);
    return () => container.removeEventListener("scroll", updateAutoScrollFlag);
  }, [roomId]);

  useLayoutEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;
    if (!shouldAutoScrollRef.current) return;
    container.scrollTop = container.scrollHeight;
  }, [roomId, chats.length, isAddChatPending]);

  useEffect(() => {
    const node = listSentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void nextPage(roomId);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [roomDetailData.chats]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const text = message.trim();
    if (!text) return;

    addChat(
      { pesan: text, idChatReply: replyTarget?._id ?? null },
      {
        onSuccess: (chat) => {
          handleRealtimePayload(roomId, { event: "chat", action: "add", roomId, chat }, user?.nama);

          if (typingIdleTimeoutRef.current) {
            window.clearTimeout(typingIdleTimeoutRef.current);
            typingIdleTimeoutRef.current = null;
          }
          mySelfTyping.current = false;
          send(roomId, { event: "typing", roomId, userName: user?.nama, status: false });
          send(roomId, { event: "chat", action: "add", roomId, chat });

          setMessage("");
          setReplyTarget(null);
        },
      },
    );
  };

  const handleDelete = (chatId: string) => {
    deleteChat(chatId, {
      onSuccess: () => {
        handleRealtimePayload(roomId, { event: "chat", action: "delete", roomId, chatId });
        send(roomId, { event: "chat", action: "delete", roomId, chatId });
      },
    });
  };

  const handleReply = (nextReplyTarget: Chat) => {
    setReplyTarget({
      ...nextReplyTarget,
      pengirim: {
        ...nextReplyTarget.pengirim,
        nama: nextReplyTarget.pengirim.nama === user?.nama ? "You" : nextReplyTarget.pengirim.nama,
      },
    });
    window.setTimeout(() => {
      messageInputRef.current?.focus();
    }, 0);
  };

  const handleLogout = async () => {
    logoutMutation(undefined, {
      onSuccess: () => {
        setUser(null);
        setTimeout(() => {
          window.location.reload();
        }, 10);
      },
    });
  };

  const typingNames = roomDetailData.typing.filter((name) => name !== user?.nama);
  const typingLabel =
    typingNames.length > 1
      ? `${typingNames.length} people typing`
      : typingNames[0]
        ? `${typingNames[0].trim().split(/\s+/)[0]} typing`
        : "";

  return (
    <>
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between gap-2">
        <div>
          {!user?.isOwner && (
            <p className="text-[10px] opacity-50">
              {"You're "}
              {user?.nama}
            </p>
          )}
          <p className="font-semibold">{roomDisplayName}</p>
          <p
            className={`text-[10px] ${roomSubtitle === "Online" ? "font-semibold text-cyan-300" : "opacity-70"}`}
          >
            {roomSubtitle}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {user?.isOwner && (
            <button
              type="button"
              onClick={() => {
                if (onExitRoom) {
                  onExitRoom();
                  return;
                }
              }}
              className="md:hidden p-1 rounded border border-white/20"
              aria-label="Back to rooms"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </button>
          )}
          <div
            className="py-1 px-2 rounded border border-white/20"
            aria-label="Logout chat"
            title="Logout chat"
            onClick={handleLogout}
          >
            {isLogoutPending ? (
              <p className="text-[9px] opacity-70">Logging out..</p>
            ) : (
              <LogOut className="h-3.5 w-3.5" />
            )}
          </div>
        </div>
      </div>
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {chats.length > 0 ? (
          <>
            {chats.length < totalChats && (
              <div ref={listSentinelRef} className="py-2">
                {isChatsPending && roomDetailData.page > 1 && (
                  <p className="text-xs text-slate-300">Loading more chats...</p>
                )}
              </div>
            )}
            {chats.map((chat) => (
              <BubbleChat
                key={chat._id}
                chat={chat}
                isMine={chat.pengirim._id === user?.id}
                currentUserName={user?.nama}
                timeZone={profileData?.timezone}
                onReply={handleReply}
                onDelete={handleDelete}
              />
            ))}
            {isAddChatPending && (
              <ChatBubblePending
                timeZone={profileData?.timezone}
                currentUserName={user?.nama}
                pesan={message}
                reply={
                  replyTarget
                    ? { pesan: replyTarget.pesan, namaPengirim: replyTarget.pengirim.nama }
                    : null
                }
              />
            )}
          </>
        ) : (
          <div className="h-full flex items-center justify-center flex-col gap-3 opacity-70 p-10">
            <MessagesSquare className="size-15" />
            <p className="text-[11px] text-center">
              {"Let's have a fun conversation with "}
              {roomDisplayName}!
            </p>
          </div>
        )}
      </div>
      <div
        className={`px-4 text-[11px] text-slate-200 transition-all ${typingLabel ? "max-h-6 py-1" : "max-h-0 py-0"}`}
      >
        {typingLabel}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-white/10 p-2">
        {replyTarget && (
          <div
            onClick={() => setReplyTarget(null)}
            className="mb-2 w-full rounded-lg border border-white/10 px-3 py-2 text-left"
          >
            <p className="text-[10px] text-pink-300 mb-1">Reply to {replyTarget.pengirim.nama}</p>
            <p className="text-xs line-clamp-1">{replyTarget.pesan}</p>
            <p className="mt-1 text-[10px] text-slate-400">Tap to remove</p>
          </div>
        )}
        <div className="flex items-center gap-2">
          <input
            spellCheck={false}
            value={message}
            ref={messageInputRef}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isAddChatPending}
            placeholder="Write a message"
            className="flex-1 rounded-lg border border-white/10 px-3 py-2 text-sm focus:outline-none"
          />
          <button type="submit" className="rounded-lg p-2 btn glass" disabled={isAddChatPending}>
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </>
  );
}
