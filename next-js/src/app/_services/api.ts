"use server";

import { cookies } from "next/headers";
import {
    Type_ApiLoginRes,
    Type_ApiMeRes,
    Type_ApiSignupRes,
    Type_Chat,
    Type_RoomAll,
    Type_RoomAllOriginal,
} from "./interface";
import { envVar } from "./utils";

export async function login(email: string, sandi: string) {
    const fetching = await fetch(`${envVar.backendURL}/auth/login`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, sandi }),
    });
    const response = await fetching.json();
    if (fetching.status == 200) {
        (await cookies()).set("token", response.token);
        setCredentials(email, sandi);
    }
    return {
        status: fetching.status,
        data: response as Type_ApiLoginRes,
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
    const response = (await fetching.json()) as Type_ApiSignupRes;
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
            console.log("credential");
            console.log(decodedString);
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
    const response = (await fetching.json()) as Type_ApiSignupRes;
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
    const response = await fetching.json();
    const checkStatus = (await reLogin(fetching.status, getMe, {
        status: fetching.status,
        data: response,
    })) as {
        status: number;
        data: Type_ApiMeRes;
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
    const response = await fetching.json();
    const checkStatus = (await reLogin(fetching.status, getRoomAll, {
        status: fetching.status,
        data: response,
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
    const fetching = await fetch(`${envVar.backendURL}/room/${roomId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    const response = await fetching.json();
    const checkStatus = (await reLogin(fetching.status, getChatsByRoomId, {
        status: fetching.status,
        data: response,
    })) as {
        status: number;
        data: Type_RoomAllOriginal;
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
    const response = await fetching.json();
    const checkStatus = (await reLogin(fetching.status, postChat, {
        status: fetching.status,
        data: response,
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
    const response = await fetching.json();
    const checkStatus = (await reLogin(fetching.status, postChat, {
        status: fetching.status,
        data: response,
    })) as {
        status: number;
        data: Type_RoomAllOriginal;
    };
    return checkStatus;
}
