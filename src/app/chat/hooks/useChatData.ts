import { useMutation, useQuery } from "@tanstack/react-query";
import {
    addMembersRoom,
    deleteChat,
    getChatsByRoomId,
    getMe,
    getRoomAll,
    getRoomIdGalih,
    getUserOne,
    login,
    loginId,
    postChat,
    postRoom,
    seenChat,
    setRoomIdGalih,
    signup,
    updateRoom,
} from "../../_services/api";

export function useMeQuery() {
    return useQuery({
        queryKey: ["chat-me"],
        queryFn: getMe,
    });
}

export function useRoomsQuery(enabled: boolean) {
    return useQuery({
        queryKey: ["chat-rooms"],
        queryFn: getRoomAll,
        enabled,
    });
}

export function useRoomDetailQuery(roomId: string, enabled: boolean) {
    return useQuery({
        queryKey: ["chat-room-detail", roomId],
        queryFn: () => getChatsByRoomId(roomId),
        enabled: enabled && Boolean(roomId),
    });
}

export function useSendChatMutation(roomId: string) {
    return useMutation({
        mutationFn: (payload: { pesan: string; idChatReply: string | null }) =>
            postChat(roomId, payload.pesan, payload.idChatReply),
    });
}

export function useSeenMutation(roomId: string) {
    return useMutation({
        mutationFn: () => seenChat(roomId),
    });
}

export function useDeleteChatMutation() {
    return useMutation({
        mutationFn: (chatId: string) => deleteChat(chatId),
    });
}

export function useUpdateRoomMutation(roomId: string) {
    return useMutation({
        mutationFn: (nama: string) => updateRoom(roomId, nama),
    });
}

export function useAddMembersRoomMutation(roomId: string) {
    return useMutation({
        mutationFn: (emails: string[]) => addMembersRoom(roomId, emails),
    });
}

export const chatAuthApi = {
    getMe,
    login,
    loginId,
    signup,
    getUserOne,
    postRoom,
    getRoomIdGalih,
    setRoomIdGalih,
};
