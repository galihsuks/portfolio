export type ChatUser = {
    _id: string;
    email: string;
    nama: string;
};

export type ChatItem = {
    _id: string;
    pesan: string;
    idPengirim: ChatUser;
    idChatReply: null | {
        pesan: string;
        idPengirim: {
            nama: string;
        };
    };
    seenUsers: {
        timestamp: string;
        user: ChatUser;
        _id: string;
    }[];
    createdAt: string;
    updatedAt: string;
};

export type RoomItem = {
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
    chats: ChatItem[];
    lastchat: ChatItem | null;
    chatsUnread: number;
    online: boolean;
    pesan: string;
};

export type WsPayload =
    | { event: "chat"; action: "add"; roomId: string; chat: ChatItem }
    | { event: "chat"; action: "seen"; roomId: string; chatIds: string[] }
    | { event: "typing"; roomId: string; userName: string; status: boolean };
