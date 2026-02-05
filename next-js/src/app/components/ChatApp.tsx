"use client";

import { SyntheticEvent, useEffect, useRef, useState } from "react";
import {
    MessageCircle,
    X,
    ArrowLeft,
    Send,
    CheckCheckIcon,
    DoorOpenIcon,
} from "lucide-react";
import BubbleChat from "./ChatAppBubble";
import {
    getChatsByRoomId,
    getMe,
    getRoomAll,
    getRoomIdGalih,
    login,
    logout,
    postChat,
    postRoom,
    setRoomIdGalih,
    signup,
} from "../_services/api";
import { Type_Chat, Type_RoomAll } from "../_services/interface";
import {
    chatBot,
    convertToTanggalIndonesia,
    createRandomString,
    getYmdNow,
    groupChatsByDate,
    newMessageWithPending,
} from "../_services/utils";
import { useMessages } from "next-intl";

export default function ChatApp() {
    const messages = useMessages();
    const [open, setOpen] = useState(false);
    const [activeRoom, setActiveRoom] = useState<Type_RoomAll | null>(null);
    const [rooms, setRooms] = useState<Type_RoomAll[]>([]);
    const [loading, setLoading] = useState("");
    const [error, setError] = useState("");
    const [messageInput, setMessageInput] = useState("");
    const passwordInput = useRef(false);
    const [chatsByRoom, setChatsByRoom] = useState<any>({});
    const idUser = useRef<{ _id: string; email: string; nama: string } | null>(
        null,
    );
    const [userOnline, setUserOnline] = useState<string[]>([]);
    const [idChatReplay, setIdChatReplay] = useState<Type_Chat | null>(null);
    const [pendingChat, setPendingChat] = useState<string[]>([]);

    useEffect(() => {
        (async () => {
            setLoading("Fetching user auth..");
            const me = await getMe();
            if (me.status == 401) {
                setLoading("");
                const chatsInit = chatBot("", 1, messages.chatbot, "") as any;
                setActiveRoom(chatsInit);
                return;
            } else if (me.status != 200) {
                setError(me.data.pesan);
                setLoading("");
                return;
            }
            idUser.current = me.data;
            if (me.data.email == "galih8.4.2001@gmail.com") {
                setLoading("Fetching list room..");
                const roomAll = await getRoomAll();
                if (roomAll.status != 200 && !Array.isArray(roomAll.data)) {
                    setError(roomAll.data.pesan);
                } else if (Array.isArray(roomAll.data)) {
                    setRooms(roomAll.data);
                }
            } else {
                setLoading("Fetching chats..");
                const roomIdGalih = await getRoomIdGalih();
                const roomDetails = await getChatsByRoomId(roomIdGalih ?? "");
                const chatsGrouped = groupChatsByDate(roomDetails.data.chats);
                setActiveRoom({
                    ...roomDetails.data,
                    chats: chatsGrouped,
                });
            }
            setLoading("");
        })();
    }, []);

    const selectRoom = async (id: string) => {
        if (chatsByRoom[id]) {
            setActiveRoom(chatsByRoom[id]);
            return;
        }
        setLoading("Fetching chats..");
        const roomDetails = await getChatsByRoomId(id);
        setLoading("");
        if (roomDetails.status == 401) {
            setError(roomDetails.data.pesan);
            return;
        }
        const chatsGrouped = groupChatsByDate(roomDetails.data.chats);
        const structActiveRoomNew = {
            ...roomDetails.data,
            chats: chatsGrouped,
        };
        setChatsByRoom({
            ...chatsByRoom,
            [id]: structActiveRoomNew,
        });
        setActiveRoom(structActiveRoomNew);
    };

    const onSending = async (e: SyntheticEvent) => {
        e.preventDefault();
        if (!messageInput) {
            return;
        }
        if (passwordInput.current) {
            const fetchingLogin = await login(
                "galih8.4.2001@gmail.com",
                messageInput,
            );
            if (fetchingLogin.status != 200) {
                setError(fetchingLogin.data.pesan);
                return;
            }
            window.location.reload();
            return;
        }
        const roomId = activeRoom?._id;
        if (roomId == "INIT") {
            if (messageInput == "Galih Sukmamukti" && activeRoom) {
                const chatsInit = chatBot("", 3, messages.chatbot, "") as any;
                setActiveRoom({
                    ...activeRoom,
                    chats: chatsInit,
                });
                passwordInput.current = true;
                return;
            }
            setLoading("Redirect to realtime chat..");
            const email = `${messageInput.replace(/[^a-zA-Z0-9]/g, "")}${Date.now()}@galihsuks.com`;
            const nama = messageInput.replace(/[^a-zA-Z0-9 ]/g, "");
            const password = createRandomString();
            await signup(email, nama, password);
            await login(email, password);
            const newRoom = await postRoom(
                "private",
                ["galih8.4.2001@gmail.com"],
                "",
            );
            await setRoomIdGalih(newRoom.data._id);
            const fetchingNewRoom = await getChatsByRoomId(newRoom.data._id);
            const chatsInit = chatBot(
                nama,
                2,
                messages.chatbot,
                fetchingNewRoom.data.createdAt,
            ) as any;
            const structActiveRoomNew = {
                ...fetchingNewRoom.data,
                chats: chatsInit,
            };
            setActiveRoom(structActiveRoomNew);
            setLoading("");
            return;
        }

        const idChatReplayParam = idChatReplay ? idChatReplay._id : null;
        setIdChatReplay(null);
        if (idUser.current && activeRoom) {
            const newPesanPending = newMessageWithPending(
                messageInput,
                idChatReplay,
                idUser.current,
            );
            setPendingChat([...pendingChat, newPesanPending._id]);
            addChat(newPesanPending);
            const fetchingPostChat = await postChat(
                roomId ?? "",
                messageInput,
                idChatReplayParam,
            );
            setActiveRoom({
                ...activeRoom,
                chats: activeRoom.chats.map((c) => {
                    const tglRoom = convertToTanggalIndonesia(
                        c.tanggal,
                    ).tglBlnTahun_number_dash_reverse;
                    const tglNewChat = getYmdNow();
                    if (tglRoom == tglNewChat) {
                        return {
                            tanggal: c.tanggal,
                            chats: c.chats.map((sc) => {
                                if (sc._id == newPesanPending._id) {
                                    return {
                                        ...sc,
                                        _id: fetchingPostChat.data._id,
                                        createdAt:
                                            fetchingPostChat.data.createdAt,
                                        updatedAt:
                                            fetchingPostChat.data.updatedAt,
                                        seenUsers:
                                            fetchingPostChat.data.seenUsers,
                                    };
                                } else return sc;
                            }),
                        };
                    } else return c;
                }),
            });
            setPendingChat(pendingChat.filter((a) => a != newPesanPending._id));
        }
    };

    const addChat = (pesan: Type_Chat) => {
        if (activeRoom) {
            setActiveRoom({
                ...activeRoom,
                chats: activeRoom.chats.map((c) => {
                    const tglRoom = convertToTanggalIndonesia(
                        c.tanggal,
                    ).tglBlnTahun_number_dash_reverse;
                    const tglNewChat = getYmdNow();
                    if (tglRoom == tglNewChat) {
                        return {
                            tanggal: c.tanggal,
                            chats: [...c.chats, pesan],
                        };
                    } else return c;
                }),
            });
        }
    };

    const actionLogout = async () => {
        await logout();
        window.location.reload();
    };

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
                    {loading ? (
                        <div style={{ flex: 1 }}></div>
                    ) : (
                        <>
                            {activeRoom ? (
                                <div className="flex items-center gap-2">
                                    {idUser.current?._id ==
                                        "6981ac566e0d5d6ecef90484" && (
                                        <button
                                            onClick={() => setActiveRoom(null)}
                                            className="flex items-center gap-2 text-sm text-gray-600"
                                        >
                                            <ArrowLeft className="h-4 w-4" />
                                        </button>
                                    )}
                                    <div>
                                        <p className="text-base font-semibold">
                                            {activeRoom.nama}
                                        </p>
                                        {activeRoom.anggota.filter(
                                            (a) => a._id != idUser.current?._id,
                                        )[0].online.last && (
                                            <p className="text-sm text-zinc-500">
                                                {userOnline.includes(
                                                    activeRoom.anggota.filter(
                                                        (a) =>
                                                            a._id !=
                                                            idUser.current?._id,
                                                    )[0]._id,
                                                )
                                                    ? "Active"
                                                    : `Last seen ${convertToTanggalIndonesia(activeRoom.anggota.filter((a) => a._id != idUser.current?._id)[0].online.last).full_text_time}`}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => actionLogout()}
                                        className="flex items-center gap-2 text-sm text-gray-600"
                                    >
                                        <DoorOpenIcon className="h-4 w-4" />
                                    </button>
                                    <p className="text-base font-semibold">
                                        Chat Rooms
                                    </p>
                                </div>
                            )}{" "}
                        </>
                    )}

                    <button onClick={() => setOpen(false)}>
                        <X className="h-5 w-5 text-gray-500 hover:text-gray-50" />
                    </button>
                </div>

                <div
                    className={`flex flex-1 flex-col overflow-hidden ${loading && "justify-center items-center"}`}
                >
                    {loading ? (
                        <>
                            <span className="loader"></span>
                            <p className="text-xs mt-2">{loading}</p>
                        </>
                    ) : (
                        <>
                            {activeRoom == null ? (
                                <RoomList
                                    rooms={rooms}
                                    selectRoom={selectRoom}
                                />
                            ) : (
                                <>
                                    <ChatRoomView
                                        room={activeRoom}
                                        idUser={idUser.current?._id ?? ""}
                                    />
                                    {/* Input */}
                                    <form onSubmit={onSending}>
                                        <div className="flex items-center gap-2 border-t border-white/10 px-3 py-2">
                                            <input
                                                value={messageInput}
                                                onChange={(e) => {
                                                    setMessageInput(
                                                        e.target.value,
                                                    );
                                                }}
                                                type="text"
                                                placeholder="Type a message..."
                                                spellCheck={false}
                                                className="flex-1 rounded-lg border border-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-50 transition-all duration-200"
                                            />
                                            <button
                                                type="submit"
                                                className="rounded-lg p-2 btn glass"
                                            >
                                                <Send className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

/* ===================== */
/* Room List */
/* ===================== */
function RoomList({
    rooms,
    selectRoom,
}: {
    rooms: Type_RoomAll[];
    selectRoom: (id: string) => void;
}) {
    return (
        <div className="flex flex-col divide-y">
            {rooms.map((room) => (
                <button
                    onClick={() => selectRoom(room._id)}
                    className="px-4 py-3 text-left hover:bg-gray-100"
                >
                    <p className="font-medium">{room.nama}</p>
                    <p className="text-xs text-gray-500">
                        {room.lastchat && (
                            <div className="flex items-center gap-2">
                                <CheckCheckIcon
                                    className={`size-2 text-pink-600`}
                                />
                                <p className="line-clamp-1">{`${room.lastchat.idPengirim.nama} : ${room.lastchat.pesan}`}</p>
                            </div>
                        )}
                    </p>
                </button>
            ))}
        </div>
    );
}

/* ===================== */
/* Chat Room */
/* ===================== */
function ChatRoomView({
    room,
    idUser,
}: {
    room: Type_RoomAll;
    idUser: string;
}) {
    return (
        <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 text-sm">
                {room.chats.map((r, ind_r) => (
                    <div className="space-y-2" key={ind_r}>
                        {r.tanggal && (
                            <ItemChat
                                tipe={"waktu"}
                                pesan=""
                                mine={true}
                                waktu={r.tanggal}
                            />
                        )}
                        {r.chats.map((c, ind_c) => (
                            <ItemChat
                                key={ind_c}
                                tipe={"bubble"}
                                pesan={c.pesan}
                                mine={c.idPengirim._id == idUser}
                                waktu={c.createdAt}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </>
    );
}

const ItemChat = ({
    tipe,
    waktu,
    pesan,
    mine,
}: {
    tipe: string;
    waktu: string;
    pesan: string;
    mine: boolean;
}) => {
    switch (tipe) {
        case "waktu":
            return (
                <span className="flex justify-center items-center gap-5">
                    <div
                        style={{ height: "1px", width: "100%" }}
                        className="bg-white opacity-30"
                    ></div>
                    <p className="opacity-50 text-xs text-nowrap">
                        {
                            convertToTanggalIndonesia(waktu)
                                .tglBlnTahun_text_space
                        }
                    </p>
                    <div
                        style={{ height: "1px", width: "100%" }}
                        className="bg-white opacity-30"
                    ></div>
                </span>
            );
        default:
            return <BubbleChat pesan={pesan} time={waktu} mine={mine} />;
    }
};
