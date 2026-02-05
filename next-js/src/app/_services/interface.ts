export interface Type_ApiLoginRes {
    email: string;
    nama: string;
    id: string;
    token: string;
    pesan: string;
}
export interface Type_ApiSignupRes {
    pesan: string;
}
export interface Type_ApiMeRes {
    pesan: string;
    online: {
        status: boolean;
        last: string;
    };
    _id: string;
    email: string;
    sandi: string;
    nama: string;
    token: string[];
    createdAt: string;
    updatedAt: string;
}

export interface Type_RoomAllOriginal {
    _id: string;
    nama: string;
    tipe: string;
    anggota: {
        online: {
            status: boolean;
            last: string;
        };
        _id: string;
        email: string;
        nama: string;
    }[];
    chats: Type_Chat[];
    lastchat: Type_Chat | null;
    chatsUnread: number;
    online: boolean;
    pesan: string;
    createdAt: string;
    updatedAt: string;
}
export interface Type_RoomAll {
    _id: string;
    nama: string;
    tipe: string;
    anggota: {
        online: {
            status: boolean;
            last: string;
        };
        _id: string;
        email: string;
        nama: string;
    }[];
    chats: Type_GroupedChat[];
    lastchat: Type_Chat | null;
    chatsUnread: number;
    online: boolean;
    pesan: string;
}

export interface Type_Chat {
    _id: string;
    pesan: string;
    idPengirim: Type_user;
    idChatReply: null | {
        pesan: string;
        idPengirim: {
            nama: string;
        };
    };
    seenUsers: {
        timestamp: string;
        user: Type_user;
        _id: string;
    }[];
    createdAt: string;
    updatedAt: string;
}

export interface Type_user {
    _id: string;
    email: string;
    nama: string;
}

export type DateFormats = {
    tglBlnTahun_number_dash_reverse: string; // 23-01-2026
    tglBlnTahun_number_dash: string; // 23-01-2026
    tglBlnTahun_number_slash: string; // 23/01/2026
    tglBlnTahun_text_space: string; // 23 Januari 2026
    tglBlnTahun_text_dash: string; // 23-Januari-2026
    tahunBlnTgl_number_dash: string; // 2026-01-23
    tahunBlnTgl_number_slash: string; // 2026/01/23
    full_text: string; // Jumat, 23 Januari 2026
    full_text_time: string; // Jumat, 23 Januari 2026 13:45:10
    jam_menit: string; // 13:45
    jam_menit_detik: string; // 13:45:10
    iso_local: string; // 2026-01-23T13:45:10
};

export interface Type_GroupedChat {
    tanggal: string;
    chats: Type_Chat[];
}
