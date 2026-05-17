"use server";

import { cookies } from "next/headers";
import {
    Type_ApiLoginRes,
    Type_ApiMeRes,
    Type_ApiSignupRes,
    Type_Chat,
    Type_RoomAll,
    Type_RoomAllOriginal,
    Type_user,
} from "./interface";
import { envVar } from "./utils";

/* eslint-disable @typescript-eslint/no-explicit-any */
function unwrapData<T>(payload: any): T {
    return (payload?.data ?? payload) as T;
}

function mapUserFromAny(payload: any): Type_user {
    return {
        _id: String(payload?._id ?? ""),
        email: String(payload?.email ?? ""),
        nama: String(payload?.nama ?? ""),
    };
}

function mapChatFromAny(payload: any): Type_Chat {
    return {
        _id: String(payload?._id ?? ""),
        pesan: String(payload?.pesan ?? ""),
        idPengirim: mapUserFromAny(payload?.idPengirim ?? payload?.pengirim),
        idChatReply: payload?.idChatReply
            ? {
                  pesan: String(payload.idChatReply.pesan ?? ""),
                  idPengirim: {
                      nama: String(payload.idChatReply.idPengirim?.nama ?? ""),
                  },
              }
            : payload?.reply
              ? {
                    pesan: String(payload.reply.pesan ?? ""),
                    idPengirim: {
                        nama: String(payload.reply.namaPengirim ?? ""),
                    },
                }
              : null,
        seenUsers: Array.isArray(payload?.seenUsers)
            ? payload.seenUsers.map((seen: any) => ({
                  _id: String(seen?._id ?? ""),
                  timestamp: String(seen?.timestamp ?? new Date().toISOString()),
                  user: mapUserFromAny(seen?.user ?? { nama: seen?.namaUser }),
              }))
            : [],
        createdAt: String(payload?.createdAt ?? new Date().toISOString()),
        updatedAt: String(
            payload?.updatedAt ?? payload?.createdAt ?? new Date().toISOString(),
        ),
    };
}

function mapRoomFromRoomList(payload: any): Type_RoomAll {
    const fallbackLastchat = payload?.lastChat
        ? {
              _id: String(payload.lastChat._id ?? ""),
              pesan: String(payload.lastChat.pesan ?? ""),
              idPengirim: {
                  _id: "",
                  email: "",
                  nama: String(payload.lastChat.namaPengirim ?? ""),
              },
              idChatReply: null,
              seenUsers: [],
              createdAt: String(payload.updatedAt ?? new Date().toISOString()),
              updatedAt: String(payload.updatedAt ?? new Date().toISOString()),
          }
        : null;

    return {
        _id: String(payload?._id ?? ""),
        nama: String(payload?.nama ?? ""),
        tipe: String(payload?.tipe ?? "private"),
        anggota: Array.isArray(payload?.anggota)
            ? payload.anggota.map((anggota: any) => ({
                  _id: String(anggota?._id ?? ""),
                  email: String(anggota?.email ?? ""),
                  nama: String(anggota?.nama ?? ""),
                  online: {
                      status: Boolean(anggota?.online?.status ?? false),
                      last: String(anggota?.online?.last ?? ""),
                  },
              }))
            : [],
        chats: [],
        lastchat: fallbackLastchat,
        chatsUnread: Number(payload?.chatsUnread ?? payload?.unread ?? 0),
        online: Boolean(payload?.online ?? false),
        pesan: String(payload?.pesan ?? ""),
    };
}

export async function loginId(id: string) {
    const timestamp = Date.now();
    const param = btoa(`${timestamp};${id}`);
    const fetching = await fetch(`${envVar.backendURL}/auth/login/${param}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    });
    const responseRaw = await fetching.json();
    const response = unwrapData<Type_ApiLoginRes>(responseRaw);
    if (fetching.status == 200) {
        (await cookies()).set("token", response.token);
    }
    return {
        status: fetching.status,
        data: response,
    };
}

export async function login(email: string, sandi: string) {
    const fetching = await fetch(`${envVar.backendURL}/auth/login`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, sandi }),
    });
    const responseRaw = await fetching.json();
    const response = unwrapData<Type_ApiLoginRes>(responseRaw);
    if (fetching.status == 200) {
        (await cookies()).set("token", response.token);
        setCredentials(email, sandi);
    }
    return {
        status: fetching.status,
        data: response,
    };
}

export async function signup(email: string, nama: string, sandi: string) {
    const fetching = await fetch(`${envVar.backendURL}/auth/signup`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, sandi, nama }),
    });
    const response = unwrapData<Type_ApiSignupRes>(await fetching.json());
    return {
        status: fetching.status,
        data: response,
    };
}

export async function setRoomIdGalih(id: string) {
    (await cookies()).set("admin_room", id);
}
export async function getRoomIdGalih() {
    return (await cookies()).get("admin_room")?.value;
}

export async function setCredentials(email: string, sandi: string) {
    const cred = btoa(`${email};${sandi}`);
    (await cookies()).set("Y3JlZGVudGlhbHM", cred);
}

export async function reLogin(
    statusCode: number,
    executeFunc: any,
    returnBefore: { status: number; data: any },
) {
    if (statusCode == 401) {
        const cred = (await cookies()).get("Y3JlZGVudGlhbHM")?.value;
        await logout(true);
        if (cred) {
            const decodedString = atob(cred);
            const arrCred = decodedString.split(";");
            await login(arrCred[0], arrCred[1]);
            const resFunc = (await executeFunc()) as {
                status: number;
                data: any;
            };
            return resFunc;
        } else {
            return {
                status: 401,
                data: {
                    pesan: "Anda belum login",
                },
            };
        }
    } else {
        return returnBefore;
    }
}

export async function getToken() {
    const token = (await cookies()).get("token")?.value;
    return token;
}

export async function logout(isReLogin = false) {
    const token = await getToken();
    const fetching = await fetch(`${envVar.backendURL}/auth/logout`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    const response = unwrapData<Type_ApiSignupRes>(await fetching.json());
    (await cookies()).delete("token");
    if (!isReLogin) {
        (await cookies()).delete("Y3JlZGVudGlhbHM");
        (await cookies()).delete("admin_room");
    }
    return {
        status: fetching.status,
        data: response,
    };
}

export async function getMe() {
    const token = await getToken();
    const fetching = await fetch(`${envVar.backendURL}/user`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    const response = unwrapData<Type_ApiMeRes>(await fetching.json());
    const checkStatus = (await reLogin(fetching.status, getMe, {
        status: fetching.status,
        data: response,
    })) as {
        status: number;
        data: Type_ApiMeRes;
    };
    return checkStatus;
}

export async function getUserOne({
    nama = "",
    email = "",
}: {
    nama?: string;
    email?: string;
}) {
    const fetching = await fetch(`${envVar.backendURL}/user/one`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ nama, email }),
    });
    const response = unwrapData(await fetching.json());
    const checkStatus = (await reLogin(fetching.status, getMe, {
        status: fetching.status,
        data: response,
    })) as {
        status: number;
        data: {
            online: {
                status: boolean;
                last: string;
            };
            email: string;
            nama: string;
            createdAt: string;
            updatedAt: string;
            pesan: string;
            _id: string;
        };
    };
    return checkStatus;
}

export async function getRoomAll() {
    const token = await getToken();
    const fetching = await fetch(`${envVar.backendURL}/room`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    const responseRaw = await fetching.json();
    const payload = unwrapData<any>(responseRaw);
    const normalized = Array.isArray(payload?.rooms)
        ? payload.rooms.map(mapRoomFromRoomList)
        : Array.isArray(payload)
          ? payload
          : payload;

    const checkStatus = (await reLogin(fetching.status, getRoomAll, {
        status: fetching.status,
        data: normalized,
    })) as {
        status: number;
        data:
            | Type_RoomAll[]
            | {
                  pesan: string;
              };
    };
    return checkStatus;
}

export async function getChatsByRoomId(roomId: string) {
    const token = await getToken();
    const fetchingSeen = await fetch(`${envVar.backendURL}/chat/${roomId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    const resSeen = unwrapData<{
        room_id: string;
        chats: string[];
        addToSeenUsers: {
            user: Type_user;
            timestamp: number;
        };
    }>(await fetchingSeen.json());

    const fetching = await fetch(`${envVar.backendURL}/room/${roomId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    const responseRaw = await fetching.json();
    const responseAny = unwrapData<any>(responseRaw);
    const response = {
        ...responseAny,
        _id: String(responseAny?._id ?? ""),
        anggota: Array.isArray(responseAny?.anggota)
            ? responseAny.anggota.map((a: any) => ({
                  ...a,
                  _id: String(a?._id ?? ""),
                  email: String(a?.email ?? ""),
                  nama: String(a?.nama ?? ""),
                  online: {
                      status: Boolean(a?.online?.status ?? false),
                      last: String(a?.online?.last ?? ""),
                  },
              }))
            : [],
        chats: Array.isArray(responseAny?.chats)
            ? responseAny.chats.map((c: any) => mapChatFromAny(c))
            : [],
        lastchat: responseAny?.lastchat ? mapChatFromAny(responseAny.lastchat) : null,
    } as Type_RoomAllOriginal;
    const checkStatus = (await reLogin(fetching.status, getChatsByRoomId, {
        status: fetching.status,
        data: response,
    })) as {
        status: number;
        data: Type_RoomAllOriginal;
    };
    return {
        ...checkStatus,
        data: {
            seen: resSeen,
            room: response,
        },
    };
}

export async function seenChat(roomId: string) {
    const token = await getToken();
    const fetchingSeen = await fetch(`${envVar.backendURL}/chat/${roomId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    const resSeen = unwrapData(await fetchingSeen.json());
    const checkStatus = (await reLogin(fetchingSeen.status, seenChat, {
        status: fetchingSeen.status,
        data: resSeen,
    })) as {
        status: number;
        data: {
            room_id: string;
            chats: string[];
            addToSeenUsers: {
                user: Type_user;
                timestamp: number;
            };
        };
    };
    return checkStatus;
}

export async function postChat(
    roomId: string,
    pesan: string,
    idChatReply: string | null,
) {
    const token = await getToken();
    const fetching = await fetch(`${envVar.backendURL}/chat/${roomId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pesan, idChatReply }),
    });
    const normalized = mapChatFromAny(unwrapData(await fetching.json()));
    const checkStatus = (await reLogin(fetching.status, postChat, {
        status: fetching.status,
        data: normalized,
    })) as {
        status: number;
        data: Type_Chat;
    };
    return checkStatus;
}

export async function postRoom(tipe: string, anggota: string[], nama: string) {
    const token = await getToken();
    const fetching = await fetch(`${envVar.backendURL}/room`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tipe, anggota, nama }),
    });
    const normalized = unwrapData(await fetching.json());
    const checkStatus = (await reLogin(fetching.status, postChat, {
        status: fetching.status,
        data: normalized,
    })) as {
        status: number;
        data: Type_RoomAllOriginal;
    };
    return checkStatus;
}

export async function deleteChat(chatId: string) {
    const token = await getToken();
    const fetching = await fetch(`${envVar.backendURL}/chat/${chatId}`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    const normalized = mapChatFromAny(unwrapData(await fetching.json()));
    const checkStatus = (await reLogin(fetching.status, deleteChat, {
        status: fetching.status,
        data: normalized,
    })) as {
        status: number;
        data: Type_Chat;
    };
    return checkStatus;
}

export async function updateRoom(roomId: string, nama: string) {
    const token = await getToken();
    const fetching = await fetch(`${envVar.backendURL}/room/${roomId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nama }),
    });
    const normalized = unwrapData(await fetching.json());
    const checkStatus = (await reLogin(fetching.status, updateRoom, {
        status: fetching.status,
        data: normalized,
    })) as {
        status: number;
        data: Type_RoomAllOriginal;
    };
    return checkStatus;
}

export async function addMembersRoom(roomId: string, anggota: string[]) {
    const token = await getToken();
    const fetching = await fetch(`${envVar.backendURL}/room/members/${roomId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ anggota }),
    });
    const normalized = unwrapData(await fetching.json());
    const checkStatus = (await reLogin(fetching.status, addMembersRoom, {
        status: fetching.status,
        data: normalized,
    })) as {
        status: number;
        data: Type_RoomAllOriginal;
    };
    return checkStatus;
}

export async function getOnlineUsers(userIds: string[]) {
    const token = await getToken();
    const fetching = await fetch(`${envVar.backendURL}/user/online`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_ids: userIds }),
    });
    const normalized = unwrapData(await fetching.json());
    const checkStatus = (await reLogin(fetching.status, getOnlineUsers, {
        status: fetching.status,
        data: normalized,
    })) as {
        status: number;
        data: Array<{
            _id: string;
            isOnline: boolean;
            lastSeen: string | null;
        }>;
    };
    return checkStatus;
}
