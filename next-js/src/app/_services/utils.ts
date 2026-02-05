import { DateFormats, Type_Chat, Type_GroupedChat } from "./interface";

export const envVar = {
    backendURL: process.env.NEXT_PUBLIC_BACKEND_URL ?? "",
    frontendURL: process.env.NEXT_PUBLIC_FRONTEND_URL ?? "",
    curriculumVitaeURL: process.env.NEXT_PUBLIC_URL_CV ?? "",
    websocketURL: process.env.NEXT_PUBLIC_WS ?? "",
};

export function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function convertToTanggalIndonesia(
    isoString: string,
    timezone: string = "Asia/Jakarta",
): DateFormats {
    const date = new Date(isoString);

    const locale = "id-ID";

    const optDate: Intl.DateTimeFormatOptions = {
        timeZone: timezone,
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    };

    const optText: Intl.DateTimeFormatOptions = {
        timeZone: timezone,
        day: "2-digit",
        month: "long",
        year: "numeric",
    };

    const optFull: Intl.DateTimeFormatOptions = {
        timeZone: timezone,
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    };

    const optTime: Intl.DateTimeFormatOptions = {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    };

    const partsDate = new Intl.DateTimeFormat(locale, optDate).formatToParts(
        date,
    );
    const partsText = new Intl.DateTimeFormat(locale, optText).formatToParts(
        date,
    );
    const partsTime = new Intl.DateTimeFormat(locale, optTime).formatToParts(
        date,
    );

    const get = (parts: Intl.DateTimeFormatPart[], type: string) =>
        parts.find((p) => p.type === type)?.value || "";

    const day = get(partsDate, "day");
    const monthNum = get(partsDate, "month");
    const year = get(partsDate, "year");

    const monthText = get(partsText, "month").slice(0, 3);
    const weekday = get(
        new Intl.DateTimeFormat(locale, {
            timeZone: timezone,
            weekday: "long",
        }).formatToParts(date),
        "weekday",
    );

    const hour = get(partsTime, "hour");
    const minute = get(partsTime, "minute");
    const second = get(partsTime, "second");

    return {
        tglBlnTahun_number_dash_reverse: `${year}-${monthNum}-${day}`,
        tglBlnTahun_number_dash: `${day}-${monthNum}-${year}`,
        tglBlnTahun_number_slash: `${day}/${monthNum}/${year}`,
        tglBlnTahun_text_space: `${day} ${monthText} ${year}`,
        tglBlnTahun_text_dash: `${day}-${monthText}-${year}`,
        tahunBlnTgl_number_dash: `${year}-${monthNum}-${day}`,
        tahunBlnTgl_number_slash: `${year}/${monthNum}/${day}`,
        full_text: `${weekday}, ${day} ${monthText} ${year}`,
        full_text_time: `${day} ${monthText} ${year} ${hour}:${minute}`,
        jam_menit: `${hour}:${minute}`,
        jam_menit_detik: `${hour}:${minute}:${second}`,
        iso_local: `${year}-${monthNum}-${day}T${hour}:${minute}:${second}`,
    };
}

export function groupChatsByDate(chats: Type_Chat[]): Type_GroupedChat[] {
    const map = new Map<string, Type_Chat[]>();

    for (const chat of chats) {
        // ambil tanggal saja (YYYY-MM-DD)
        const tanggal = new Date(chat.createdAt).toISOString().split("T")[0];
        if (!map.has(tanggal)) {
            map.set(tanggal, []);
        }
        map.get(tanggal)!.push(chat);
    }

    // convert map → array object
    return Array.from(map.entries()).map(([tanggal, chats]) => ({
        tanggal,
        chats,
    }));
}

export function chatBot(
    nama: string,
    step: number,
    locale: {
        opening: string;
        text_1: string;
        text_2: string;
    },
    waktu: string,
) {
    switch (step) {
        case 1:
            return {
                _id: "INIT",
                nama: "Galih Sukmamukti",
                tipe: "private",
                anggota: [
                    {
                        online: {
                            status: false,
                            last: "",
                        },
                        _id: "6981ac566e0d5d6ecef90484",
                        email: "galih8.4.2001@gmail.com",
                        nama: "Galih Sukmamukti",
                    },
                ],
                chats: [
                    {
                        tanggal: "",
                        chats: [
                            {
                                _id: "INITCHAT1",
                                pesan: locale.opening,
                                idPengirim: {
                                    _id: "6981ac566e0d5d6ecef90484",
                                    email: "galih8.4.2001@gmail.com",
                                    nama: "Galih Sukmamukti",
                                },
                                seenUsers: [
                                    {
                                        timestamp: "2026-02-04T08:32:35.704Z",
                                        user: {
                                            _id: "6981ac566e0d5d6ecef90484",
                                            email: "galih8.4.2001@gmail.com",
                                            nama: "Galih Sukmamukti",
                                        },
                                        _id: "69830423e6f1e367d0d2a318",
                                    },
                                ],
                                createdAt: "",
                                updatedAt: "",
                            },
                        ],
                    },
                ],
            };
        case 2:
            return [
                {
                    tanggal: waktu,
                    chats: [
                        {
                            _id: "INITCHAT2",
                            pesan: `${locale.text_1} ${nama}! ${locale.text_2}!`,
                            idPengirim: {
                                _id: "6981ac566e0d5d6ecef90484",
                                email: "galih8.4.2001@gmail.com",
                                nama: "Galih Sukmamukti",
                            },
                            seenUsers: [
                                {
                                    timestamp: waktu,
                                    user: {
                                        _id: "6981ac566e0d5d6ecef90484",
                                        email: "galih8.4.2001@gmail.com",
                                        nama: "Galih Sukmamukti",
                                    },
                                    _id: "69830423e6f1e367d0d2a318",
                                },
                            ],
                            createdAt: waktu,
                            updatedAt: waktu,
                        },
                    ],
                },
            ];
        case 3:
            return [
                {
                    tanggal: "",
                    chats: [
                        {
                            _id: "INITCHAT1",
                            pesan: locale.opening,
                            idPengirim: {
                                _id: "6981ac566e0d5d6ecef90484",
                                email: "galih8.4.2001@gmail.com",
                                nama: "Galih Sukmamukti",
                            },
                            seenUsers: [
                                {
                                    timestamp: "2026-02-04T08:32:35.704Z",
                                    user: {
                                        _id: "6981ac566e0d5d6ecef90484",
                                        email: "galih8.4.2001@gmail.com",
                                        nama: "Galih Sukmamukti",
                                    },
                                    _id: "69830423e6f1e367d0d2a318",
                                },
                            ],
                            createdAt: "",
                            updatedAt: "",
                        },
                        {
                            _id: "INITCHAT3",
                            pesan: "Password?",
                            idPengirim: {
                                _id: "6981ac566e0d5d6ecef90484",
                                email: "galih8.4.2001@gmail.com",
                                nama: "Galih Sukmamukti",
                            },
                            seenUsers: [
                                {
                                    timestamp: "2026-02-04T08:32:35.704Z",
                                    user: {
                                        _id: "6981ac566e0d5d6ecef90484",
                                        email: "galih8.4.2001@gmail.com",
                                        nama: "Galih Sukmamukti",
                                    },
                                    _id: "69830423e6f1e367d0d2a318",
                                },
                            ],
                            createdAt: "",
                            updatedAt: "",
                        },
                    ],
                },
            ];
    }
}

export function createRandomString() {
    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 10; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export function getYmdNow() {
    const now = new Date();
    const jakartaTime = new Date(
        now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" }),
    );
    const pad = (n: any) => String(n).padStart(2, "0");
    const formattedDate =
        `${jakartaTime.getFullYear()}-` +
        `${pad(jakartaTime.getMonth() + 1)}-` +
        `${pad(jakartaTime.getDate())}`;
    return formattedDate;
}

export function getYmdHisNow() {
    const now = new Date();
    const jakartaTime = new Date(
        now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" }),
    );
    const pad = (n: any) => String(n).padStart(2, "0");
    const formattedDate =
        `${jakartaTime.getFullYear()}-` +
        `${pad(jakartaTime.getMonth() + 1)}-` +
        `${pad(jakartaTime.getDate())} ` +
        `${pad(jakartaTime.getHours())}:` +
        `${pad(jakartaTime.getMinutes())}:` +
        `${pad(jakartaTime.getSeconds())}`;
    return formattedDate;
}

export function newMessageWithPending(
    pesan: string,
    idChatReply: null | {
        pesan: string;
        idPengirim: {
            nama: string;
        };
    },
    idPengirim: {
        _id: string;
        email: string;
        nama: string;
    },
): Type_Chat {
    return {
        _id: `${Date.now()}`,
        pesan: pesan,
        idChatReply: idChatReply,
        idPengirim: idPengirim,
        seenUsers: [
            {
                timestamp: "2026-02-04T08:32:35.704Z",
                user: idPengirim,
                _id: "",
            },
        ],
        createdAt: "",
        updatedAt: "",
    };
}
