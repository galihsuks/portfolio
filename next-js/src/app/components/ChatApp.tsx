"use client";

import {
    SetStateAction,
    SyntheticEvent,
    useEffect,
    useRef,
    useState,
} from "react";
import {
    MessageCircle,
    X,
    ArrowLeft,
    Send,
    CheckCheckIcon,
    DoorOpenIcon,
    ChevronUpIcon,
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
    seenChat,
    setRoomIdGalih,
    signup,
} from "../_services/api";
import { Type_Chat, Type_RoomAll, Type_user } from "../_services/interface";
import {
    chatBot,
    convertToTanggalIndonesia,
    createRandomString,
    envVar,
    getLastChat,
    getMongoDateNow,
    getYmdNow,
    groupChatsByDate,
    newMessageWithPending,
    sendWs,
} from "../_services/utils";
import { useMessages } from "next-intl";

export default function ChatApp() {
    const messages = useMessages();
    const [open, setOpen] = useState(false);
    const [activeRoom, setActiveRoom] = useState<string | null>(null);
    const [activeRoomObject, setActiveRoomObject] =
        useState<Type_RoomAll | null>(null);
    const [rooms, setRooms] = useState<Type_RoomAll[]>([]);
    const [loading, setLoading] = useState("");
    const [error, setError] = useState("");
    const [messageInput, setMessageInput] = useState("");
    const passwordInput = useRef(false);
    const [roomOpend, setRoomOpened] = useState<string[]>([]);
    const idUser = useRef<{ _id: string; email: string; nama: string } | null>(
        null,
    );
    const [userOnline, setUserOnline] = useState<string[]>([]);
    const [idChatReplay, setIdChatReplay] = useState<Type_Chat | null>(null);
    const [pendingChat, setPendingChat] = useState<string[]>([]);
    const [scrollTrigger, setScrollTrigger] = useState(false);
    const [wsConnected, setWsConnected] = useState(0); // 0: conecting, 1 : connected, 2 : disconnect
    const ws = useRef<WebSocket | null>(null);
    const [wsPending, setWsPending] = useState<any[]>([]);
    const roomsRef = useRef<Type_RoomAll[]>([]);
    const activeRoomRef = useRef<string | null>(null);
    const activeRoomObjectRef = useRef<Type_RoomAll | null>(null);

    useEffect(() => {
        roomsRef.current = rooms;
    }, [rooms]);

    useEffect(() => {
        activeRoomRef.current = activeRoom;
    }, [activeRoom]);

    useEffect(() => {
        activeRoomObjectRef.current = activeRoomObject;
    }, [activeRoomObject]);

    useEffect(() => {
        ws.current = new WebSocket(envVar.websocketURL);
        ws.current.onerror = (e) => {
            setWsConnected(2);
            ws.current = null;
        };
        ws.current.onopen = () => {
            setWsConnected(1);
            wsPending.forEach((e) => {
                ws.current?.send(JSON.stringify(e));
            });
            setWsPending([]);
        };
        ws.current.onmessage = (event) => {
            const parsed = JSON.parse(event.data);
            console.log("on message web sccoket");
            console.log(parsed);
            const {
                tipe,
                data,
            }: {
                tipe: string;
                data: any;
            } = parsed;
            switch (tipe) {
                case "online":
                    setRooms((prev) =>
                        prev.map((e) => {
                            if (data.rooms.includes(e._id)) {
                                return {
                                    ...e,
                                    anggota: e.anggota.map((a) => {
                                        if (a._id == data.primary_key) {
                                            return {
                                                ...a,
                                                online: {
                                                    ...a.online,
                                                    last: getMongoDateNow(),
                                                },
                                            };
                                        } else return a;
                                    }),
                                };
                            } else return e;
                        }),
                    );
                    setUserOnline(data.clients);
                    break;
                case "send":
                    switch (data.jenis) {
                        case "seen":
                            setRooms((prev) =>
                                prev.map((r) => {
                                    if (r._id == data.room_id) {
                                        return {
                                            ...r,
                                            chats: data.chats_room,
                                        };
                                    } else return r;
                                }),
                            );
                            break;
                        case "chat-add":
                            addChat(
                                data.chatAdd,
                                data.room_id,
                                convertToTanggalIndonesia(
                                    data.chatAdd.createdAt,
                                ).tglBlnTahun_number_dash_reverse,
                            );
                            setRooms((prev) =>
                                prev.map((r) => {
                                    if (r._id == data.room_id) {
                                        return {
                                            ...r,
                                            chatsUnread:
                                                activeRoomRef.current ==
                                                data.room_id
                                                    ? r.chatsUnread
                                                    : r.chatsUnread + 1,
                                        };
                                    } else return r;
                                }),
                            );
                            if (activeRoomRef.current == data.room_id) {
                                (async () => {
                                    const resSeen = await seenChat(
                                        data.room_id,
                                    );
                                    sendWs.seen(
                                        ws.current!,
                                        setWsPending,
                                        data.room_id,
                                        activeRoomObjectRef.current!.chats.map(
                                            (c) => {
                                                return {
                                                    tanggal: c.tanggal,
                                                    chats: c.chats.map((sc) => {
                                                        if (
                                                            resSeen.data.chats.includes(
                                                                sc._id,
                                                            )
                                                        ) {
                                                            return {
                                                                ...sc,
                                                                seenUsers: [
                                                                    ...sc.seenUsers,
                                                                    {
                                                                        timestamp:
                                                                            getMongoDateNow(),
                                                                        user: idUser.current!,
                                                                        _id: "",
                                                                    },
                                                                ],
                                                            };
                                                        } else return sc;
                                                    }),
                                                };
                                            },
                                        ),
                                    );
                                })();
                            }
                            setScrollTrigger((prev) => !prev);
                            break;
                        case "room-add":
                            setRooms((prev) => [...prev, data.room]);
                            break;
                        default:
                            break;
                    }
                    break;
                default:
                    break;
            }
        };

        (async () => {
            setLoading("Fetching user auth..");
            const me = await getMe();
            if (me.status == 401) {
                setLoading("");
                const chatsInit = chatBot(
                    "",
                    1,
                    messages.chatbot,
                    "",
                ) as Type_RoomAll[];
                setRooms(chatsInit);
                setActiveRoom(chatsInit[0]._id);
                return;
            } else if (me.status != 200) {
                setError(me.data.pesan);
                setLoading("");
                return;
            }
            idUser.current = me.data;
            sendWs.online(ws.current!, setWsPending, me.data._id);
            if (me.data.email == "galih8.4.2001@gmail.com") {
                setLoading("Fetching list room..");
                const roomAll = await getRoomAll();
                if (roomAll.status != 200 && !Array.isArray(roomAll.data)) {
                    setError(roomAll.data.pesan);
                } else if (Array.isArray(roomAll.data)) {
                    setRooms(roomAll.data.map((a) => ({ ...a, chats: [] })));
                    roomAll.data.forEach((r) => {
                        sendWs.subscribe(ws.current!, setWsPending, r._id);
                    });
                }
            } else {
                setLoading("Fetching chats..");
                const roomIdGalih = await getRoomIdGalih();
                const roomDetails = await getChatsByRoomId(roomIdGalih ?? "");
                const chatsGrouped = groupChatsByDate(
                    roomDetails.data.room.chats,
                );
                setRooms([
                    {
                        ...roomDetails.data.room,
                        chats: chatsGrouped,
                    },
                ]);
                console.log("Harusnya udah di set roomnya");
                sendWs.subscribe(ws.current!, setWsPending, roomIdGalih ?? "");
                sendWs.seen(
                    ws.current!,
                    setWsPending,
                    roomIdGalih ?? "",
                    chatsGrouped,
                );
                setActiveRoom(roomDetails.data.room._id);
            }
            setLoading("");
        })();

        const handlerBtnHireClicked = () => setOpen(true);
        const btnHireMe = document.getElementById("hire-me-btn");
        btnHireMe?.addEventListener("click", handlerBtnHireClicked);

        return () => {
            ws.current?.close();
            btnHireMe?.removeEventListener("click", handlerBtnHireClicked);
            rooms.forEach((r) => {
                sendWs.unsubscribe(ws.current!, setWsPending, r._id);
            });
        };
    }, []);

    useEffect(() => {
        setScrollTrigger((prev) => !prev);
    }, [open]);

    const selectRoom = async (id: string) => {
        if (roomOpend.includes(id)) {
            const findRoom = roomsRef.current.find((e) => e._id == id);
            setRooms((prev) =>
                prev.map((r) => {
                    if (r._id == id) {
                        return {
                            ...r,
                            chatsUnread: 0,
                        };
                    } else return r;
                }),
            );
            if (findRoom) {
                setActiveRoom(id);
                const resSeen = await seenChat(id);
                sendWs.seen(
                    ws.current!,
                    setWsPending,
                    id,
                    findRoom.chats.map((c) => {
                        return {
                            tanggal: c.tanggal,
                            chats: c.chats.map((sc) => {
                                if (resSeen.data.chats.includes(sc._id)) {
                                    return {
                                        ...sc,
                                        seenUsers: [
                                            ...sc.seenUsers,
                                            {
                                                timestamp: getMongoDateNow(),
                                                user: idUser.current!,
                                                _id: "",
                                            },
                                        ],
                                    };
                                } else return sc;
                            }),
                        };
                    }),
                );
            }
            return;
        }
        setLoading("Fetching chats..");
        const roomDetails = await getChatsByRoomId(id);
        setLoading("");
        if (roomDetails.status == 401) {
            setError(roomDetails.data.room.pesan);
            return;
        }
        const chatsGrouped = groupChatsByDate(roomDetails.data.room.chats);
        sendWs.seen(ws.current!, setWsPending, id, chatsGrouped);
        setRooms((prev) =>
            prev.map((r) => {
                if (r._id == id) {
                    return {
                        ...r,
                        chats: chatsGrouped,
                    };
                } else return r;
            }),
        );
        setRoomOpened((prev) => [...prev, id]);
        setActiveRoom(id);
    };

    const onSending = async (e: SyntheticEvent) => {
        e.preventDefault();
        if (!messageInput) {
            return;
        }
        setScrollTrigger((prev) => !prev);
        const messageInputLocal = messageInput;
        setMessageInput("");
        if (passwordInput.current) {
            const fetchingLogin = await login(
                "galih8.4.2001@gmail.com",
                messageInputLocal,
            );
            if (fetchingLogin.status != 200) {
                const chatsInit = chatBot(
                    "",
                    4,
                    messages.chatbot,
                    fetchingLogin.data.pesan,
                ) as Type_Chat;
                addChat(chatsInit, "INIT", getYmdNow());
                return;
            }
            window.location.reload();
            return;
        }
        if (activeRoom == "INIT") {
            if (messageInputLocal.toLowerCase() == "galih sukmamukti") {
                const chatsInit = chatBot(
                    "",
                    3,
                    messages.chatbot,
                    "",
                ) as Type_Chat;
                addChat(chatsInit, activeRoom, getYmdNow());
                passwordInput.current = true;
                return;
            }
            setLoading("Redirect to realtime chat..");
            const email = `${messageInputLocal.replace(/[^a-zA-Z0-9]/g, "")}${Date.now()}@galihsuks.com`;
            const nama = messageInputLocal.replace(/[^a-zA-Z0-9 ]/g, "");
            const password = "123456";
            await signup(email, nama, password);
            const responseLogin = await login(email, password);
            idUser.current = {
                _id: responseLogin.data.id,
                email: responseLogin.data.email,
                nama: responseLogin.data.nama,
            };
            sendWs.online(ws.current!, setWsPending, responseLogin.data.id);
            const newRoom = await postRoom(
                "private",
                ["galih8.4.2001@gmail.com"],
                "",
            );
            sendWs.subscribe(ws.current!, setWsPending, newRoom.data._id);
            await setRoomIdGalih(newRoom.data._id);
            const fetchingNewRoom = await getChatsByRoomId(newRoom.data._id);
            // TODO socket add room
            const chatsInit = chatBot(
                nama,
                2,
                messages.chatbot,
                "",
            ) as Type_Chat;
            setRooms([
                {
                    ...fetchingNewRoom.data.room,
                    chats: [
                        {
                            tanggal: getYmdNow(),
                            chats: [chatsInit],
                        },
                    ],
                },
            ]);
            setActiveRoom(fetchingNewRoom.data.room._id);
            setLoading("");
            return;
        }

        const idChatReplayParam = idChatReplay ? idChatReplay._id : null;
        setIdChatReplay(null);
        if (idUser.current && activeRoom) {
            const newPesanPending = newMessageWithPending(
                messageInputLocal,
                idChatReplay,
                idUser.current,
            );
            setPendingChat([...pendingChat, newPesanPending._id]);
            addChat(newPesanPending, activeRoom, getYmdNow());
            const fetchingPostChat = await postChat(
                activeRoom,
                messageInputLocal,
                idChatReplayParam,
            );
            addChat(
                fetchingPostChat.data,
                activeRoom,
                getYmdNow(),
                fetchingPostChat.data._id,
            );
            setPendingChat((prev) =>
                prev.filter((a) => a != newPesanPending._id),
            );
            sendWs.addChat(
                ws.current!,
                setWsPending,
                activeRoom,
                fetchingPostChat.data,
            );
            setScrollTrigger((prev) => !prev);
        }
    };

    const addChat = (
        pesan: Type_Chat,
        room_id: string,
        tglNewChat: string,
        id_pesan_replace?: string,
    ) => {
        setRooms((prev) => {
            const isAvailableTgl = prev
                .find((e) => e._id == room_id)
                ?.chats.find((e) => e.tanggal == tglNewChat);
            if (!isAvailableTgl) {
                return prev.map((r) => {
                    if (r._id == room_id) {
                        const chat_room = [
                            ...r.chats,
                            {
                                tanggal: tglNewChat,
                                chats: [pesan],
                            },
                        ];
                        return {
                            ...r,
                            chats: chat_room,
                        };
                    } else return r;
                });
            }
            if (id_pesan_replace) {
                return prev.map((r) => {
                    if (r._id == room_id) {
                        const chat_room = r.chats.map((c) => {
                            if (c.tanggal == tglNewChat) {
                                return {
                                    ...c,
                                    chats: c.chats.map((sc) => {
                                        if (sc._id == id_pesan_replace) {
                                            return {
                                                ...sc,
                                                _id: pesan._id,
                                                createdAt: pesan.createdAt,
                                                updatedAt: pesan.updatedAt,
                                                seenUsers: pesan.seenUsers,
                                            };
                                        } else return sc;
                                    }),
                                };
                            } else return c;
                        });
                        return {
                            ...r,
                            chats: chat_room,
                        };
                    } else return r;
                });
            }
            return prev.map((r) => {
                if (r._id == room_id) {
                    const chat_room = r.chats.map((c) => {
                        if (c.tanggal == tglNewChat) {
                            return {
                                ...c,
                                chats: [...c.chats, pesan],
                            };
                        } else return c;
                    });
                    return {
                        ...r,
                        chats: chat_room,
                    };
                } else return r;
            });
        });
    };

    useEffect(() => {
        if (activeRoom) {
            setActiveRoomObject(rooms.find((a) => a._id == activeRoom) ?? null);
        } else {
            setActiveRoomObject(null);
        }
    }, [rooms, activeRoom]);

    const actionLogout = async () => {
        await logout();
        window.location.reload();
    };

    return (
        <>
            <button
                onClick={() => setOpen((prev) => !prev)}
                className={`cursor-pointer fixed z-50 flex bottom-3 md:bottom-6 right-3 md:right-6 ${open ? "h-10 w-10 rotate-180" : "h-14 w-14"} glass items-center justify-center rounded-full shadow-lg hover:bg-white hover:text-zinc-600 transition-all duration-200`}
            >
                {open ? (
                    <ChevronUpIcon className="h-4 w-4" />
                ) : (
                    <MessageCircle className="h-6 w-6" />
                )}
            </button>

            <div
                data-lenis-prevent
                className={`transition-all duration-400 overflow-hidden fixed z-50 flex flex-col rounded-xl bg-black/70 border-white/10 backdrop-blur-lg shadow-2xl md:bottom-20 md:right-6 bottom-16 right-3 ${open ? "h-[500px] md:w-[350px] w-[90%] border" : "h-[0px] w-[0px]"}`}
            >
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                    {loading ? (
                        <div style={{ flex: 1 }}></div>
                    ) : (
                        <>
                            {activeRoomObject ? (
                                <div className="flex items-center gap-2">
                                    {idUser.current?._id ==
                                        "6981ac566e0d5d6ecef90484" && (
                                        <button
                                            onClick={() => {
                                                if (pendingChat.length == 0) {
                                                    setActiveRoom(null);
                                                }
                                            }}
                                            className="flex items-center gap-2 text-sm text-gray-600"
                                        >
                                            <ArrowLeft className="h-4 w-4" />
                                        </button>
                                    )}
                                    <div>
                                        <p className="text-base font-semibold">
                                            {activeRoomObject.nama}
                                        </p>
                                        {activeRoomObject.anggota.filter(
                                            (a) => a._id != idUser.current?._id,
                                        )[0].online.last && (
                                            <>
                                                {userOnline.includes(
                                                    activeRoomObject.anggota.filter(
                                                        (a) =>
                                                            a._id !=
                                                            idUser.current?._id,
                                                    )[0]._id,
                                                ) ? (
                                                    <p className="text-xs font-semibold text-pink-400">
                                                        Active
                                                    </p>
                                                ) : (
                                                    <p className="text-xs text-zinc-500">
                                                        Last seen{" "}
                                                        {
                                                            convertToTanggalIndonesia(
                                                                activeRoomObject.anggota.filter(
                                                                    (a) =>
                                                                        a._id !=
                                                                        idUser
                                                                            .current
                                                                            ?._id,
                                                                )[0].online
                                                                    .last,
                                                            ).full_text_time
                                                        }
                                                    </p>
                                                )}
                                            </>
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

                    <div className="flex gap-1 items-center justify-center">
                        <span
                            title={
                                wsConnected == 0
                                    ? "Connecting.."
                                    : wsConnected === 1
                                      ? "Realtime chat actived"
                                      : "Realtime chat not working"
                            }
                            className={`${wsConnected == 0 ? "animate-pulse bg-gray-500" : wsConnected === 1 ? "bg-pink-400" : "bg-gray-500"} rounded-full h-2 w-2`}
                        ></span>
                    </div>
                </div>

                {error && (
                    <div className="rounded-md px-2 m-2 py-1 bg-rose-200 text-rose-900">
                        {error}
                    </div>
                )}

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
                            <RoomList
                                activeRoom={activeRoom ?? ""}
                                setRooms={setRooms}
                                usersOnline={userOnline}
                                rooms={rooms}
                                selectRoom={selectRoom}
                                idUser={idUser.current?._id ?? ""}
                            />
                            {activeRoomObject && (
                                <>
                                    <ChatRoomView
                                        pendingChat={pendingChat}
                                        scrollTrigger={scrollTrigger}
                                        room={activeRoomObject}
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
    idUser,
    usersOnline,
    setRooms,
    activeRoom,
}: {
    activeRoom: string;
    rooms: Type_RoomAll[];
    idUser: string;
    selectRoom: (id: string) => void;
    usersOnline: string[];
    setRooms: React.Dispatch<React.SetStateAction<Type_RoomAll[]>>;
}) {
    return (
        <div
            className={`${activeRoom ? "hidden" : "flex"} flex-col divide-y divide-gray-800 overflow-y-auto`}
        >
            {rooms
                .sort(
                    (a, b) =>
                        Date.parse(b.lastchat?.createdAt ?? "") -
                        Date.parse(a.lastchat?.createdAt ?? ""),
                )
                .map((room, ind_room) => {
                    if (activeRoom && activeRoom == room._id) {
                        return (
                            <ItemRoomList
                                key={ind_room}
                                room={room}
                                selectRoom={selectRoom}
                                usersOnline={usersOnline}
                                idUser={idUser}
                                setRooms={setRooms}
                            />
                        );
                    }
                    return (
                        <ItemRoomList
                            key={ind_room}
                            room={room}
                            selectRoom={selectRoom}
                            usersOnline={usersOnline}
                            idUser={idUser}
                            setRooms={setRooms}
                        />
                    );
                })}
        </div>
    );
}
function ItemRoomList({
    room,
    selectRoom,
    usersOnline,
    idUser,
    setRooms,
}: {
    setRooms: React.Dispatch<React.SetStateAction<Type_RoomAll[]>>;
    idUser: string;
    usersOnline: string[];
    room: Type_RoomAll;
    selectRoom: (id: string) => void;
}) {
    const firstRender = useRef(true);

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        setRooms((prev) =>
            prev.map((r) => {
                if (r._id == room._id) {
                    return {
                        ...r,
                        lastchat: getLastChat(room.chats),
                    };
                } else return r;
            }),
        );
    }, [room.chats]);

    return (
        <button
            onClick={() => selectRoom(room._id)}
            className="px-4 py-3 text-left hover:bg-gray-100 hover:text-black"
        >
            <div className="flex gap-3 items-center">
                <div style={{ flex: 1 }}>
                    {usersOnline.includes(
                        room.anggota.find((e) => e._id != idUser)?._id ?? " ",
                    ) ? (
                        <div className="flex gap-2 items-center">
                            <span
                                className={`bg-pink-400 rounded-full h-2 w-2`}
                            ></span>
                            <p className={`font-medium text-pink-400`}>
                                {room.nama}
                            </p>
                        </div>
                    ) : (
                        <p className={`font-medium`}>{room.nama}</p>
                    )}
                    <div className="text-xs text-gray-500">
                        {room.lastchat && (
                            <div className="flex items-center gap-2">
                                {idUser === room.lastchat.idPengirim._id && (
                                    <div>
                                        <CheckCheckIcon
                                            className={`size-3 ${room.lastchat.seenUsers.length == room.anggota.length ? "text-pink-400" : "opacity-80"}`}
                                        />
                                    </div>
                                )}
                                <p className="line-clamp-1">{`${idUser === room.lastchat.idPengirim._id ? "You" : room.lastchat.idPengirim.nama.split(" ")[0]} : ${room.lastchat.pesan}`}</p>
                            </div>
                        )}
                    </div>
                </div>
                {room.lastchat && (
                    <div className={`flex flex-col items-end`}>
                        <p
                            style={{ fontSize: "10px" }}
                            className={`text-xs mb-1 ${room.chatsUnread == 0 ? "opacity-50" : "text-pink-300 font-semibold"}`}
                        >
                            {
                                convertToTanggalIndonesia(
                                    room.lastchat.createdAt,
                                ).smart_display
                            }
                        </p>
                        {room.chatsUnread > 0 && (
                            <div
                                style={{ fontSize: "10px" }}
                                className="rounded-full bg-pink-200 font-semibold text-pink-900 text-xs px-2 py-1"
                            >
                                {room.chatsUnread}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </button>
    );
}

/* ===================== */
/* Chat Room */
/* ===================== */
function ChatRoomView({
    room,
    idUser,
    scrollTrigger,
    pendingChat,
}: {
    room: Type_RoomAll;
    idUser: string;
    scrollTrigger: boolean;
    pendingChat: string[];
}) {
    const chatsContainer = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (chatsContainer.current) {
            chatsContainer.current.scrollTo({
                top: chatsContainer.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [scrollTrigger]);

    return (
        <>
            <div
                className="flex-1 overflow-y-auto px-4 py-3 text-sm"
                ref={chatsContainer}
            >
                {room.chats.map((r, ind_r) => (
                    <div className="space-y-2 mb-2" key={ind_r}>
                        {r.tanggal && (
                            <ItemChat
                                reply={null}
                                _id=""
                                pendingChat={pendingChat}
                                tipe={"waktu"}
                                pesan=""
                                mine={true}
                                waktu={r.tanggal}
                                anggotaGroup={room.anggota}
                            />
                        )}
                        {r.chats.map((c, ind_c) => (
                            <ItemChat
                                anggotaGroup={room.anggota}
                                reply={c.idChatReply}
                                _id={c._id}
                                pendingChat={pendingChat}
                                key={ind_c}
                                tipe={"bubble"}
                                pesan={c.pesan}
                                mine={c.idPengirim._id == idUser}
                                waktu={c.createdAt}
                                seen={c.seenUsers}
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
    pendingChat,
    _id,
    reply,
    anggotaGroup,
    seen = [],
}: {
    _id: string;
    tipe: string;
    waktu: string;
    pesan: string;
    mine: boolean;
    pendingChat: string[];
    reply: null | {
        pesan: string;
        idPengirim: {
            nama: string;
        };
    };
    seen?: {
        timestamp: string;
        user: Type_user;
        _id: string;
    }[];
    anggotaGroup: {
        online: {
            status: boolean;
            last: string;
        };
        _id: string;
        email: string;
        nama: string;
    }[];
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
            return (
                <BubbleChat
                    _id={_id}
                    pendingChat={pendingChat}
                    pesan={pesan}
                    time={waktu}
                    mine={mine}
                    reply={reply}
                    anggotaGroup={anggotaGroup}
                    seen={seen}
                />
            );
    }
};
