"use client";

import { CheckCheckIcon, CheckIcon, Clock6Icon } from "lucide-react";
import { convertToTanggalIndonesia } from "../_services/utils";
import { Type_user } from "../_services/interface";

export default function BubbleChat({
    _id,
    pesan,
    reply,
    seen = [],
    time,
    mine,
    pendingChat,
    anggotaGroup,
    onReply,
    onDelete,
    canDelete = false,
    senderName,
}: {
    _id: string;
    pesan: string;
    reply: null | {
        pesan: string;
        idPengirim: {
            nama: string;
        };
    };
    anggotaGroup: {
        online: {
            status: boolean;
            last: string;
        };
        _id: string;
        email: string;
        nama: string;
    }[];
    seen?: {
        timestamp: string;
        user: Type_user;
        _id: string;
    }[];
    time: string;
    mine: boolean;
    pendingChat: string[];
    onReply?: () => void;
    onDelete?: () => void;
    canDelete?: boolean;
    senderName?: string;
}) {
    const totalReadersTarget = Math.max(anggotaGroup.length - 1, 0);
    const seenByOthers = Math.max(seen.length - 1, 0);
    const hasAnyReader = seenByOthers > 0;
    const hasAllReaders =
        totalReadersTarget > 0 && seenByOthers >= totalReadersTarget;

    return (
        <div
            className={`flex ${mine ? "justify-end ps-10" : "justify-start pe-10"}`}
        >
            <div
                className={`group relative flex max-w-[85%] flex-col rounded-2xl px-3 py-2 ${mine ? "glass" : "bg-white/10 text-white"}`}
            >
                {!mine && (
                    <p className="mb-1 text-[10px] text-cyan-300">
                        {senderName ?? "User"}
                    </p>
                )}
                {reply && (
                    <div
                        className={`${mine ? "bg-black/50" : "bg-black/20"} w-full mb-2 rounded-md border-l-2 border-pink-300 px-2 py-1`}
                    >
                        <p
                            className={`text-xs line-clamp-1 mb-1 font-semibold ${mine ? "text-pink-400" : "text-pink-200"}`}
                            style={{ fontSize: "10px" }}
                        >
                            {reply.idPengirim.nama}
                        </p>
                        <p
                            className={`text-xs line-clamp-1 ${mine ? "text-white" : "text-slate-100"}`}
                        >
                            {reply.pesan}
                        </p>
                    </div>
                )}
                <div className="text-sm">
                    <p>{pesan}</p>
                </div>
                {pendingChat.includes(_id) ? (
                    <div className="mt-2 flex justify-end">
                        <Clock6Icon className="size-3 opacity-50" />
                    </div>
                ) : (
                    <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-300">
                        <button
                            type="button"
                            onClick={onReply}
                            className="hover:text-white"
                        >
                            Reply
                        </button>
                        {canDelete && onDelete && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete();
                                }}
                                className="hover:text-rose-300"
                            >
                                Delete
                            </button>
                        )}
                        <span className="ml-auto">
                            {convertToTanggalIndonesia(time).jam_menit}
                        </span>
                        {mine && (
                            <>
                                {hasAnyReader ? (
                                    <CheckCheckIcon
                                        className={`size-3 ${hasAllReaders ? "text-pink-400" : "opacity-80"}`}
                                    />
                                ) : (
                                    <CheckIcon className="size-3 opacity-80" />
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
