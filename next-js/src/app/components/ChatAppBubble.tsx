"use client";

import { CheckCheckIcon, Clock6Icon } from "lucide-react";
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
}) {
    return (
        <div
            className={`flex ${mine ? "justify-end ps-10" : "justify-start pe-10"}`}
        >
            <div
                className={`relative flex flex-col rounded-t-lg px-1 py-0 ${mine ? "glass rounded-s-lg" : "bg-gray-50 text-gray-700 rounded-e-lg"}`}
            >
                {reply && (
                    <div
                        className={`${mine ? "bg-black/50" : "bg-black/10"} w-full mt-1 rounded-md px-2 py-1`}
                    >
                        <p
                            className={`text-xs line-clamp-1 mb-1 font-semibold ${mine ? "text-pink-400" : "text-pink-800"}`}
                            style={{ fontSize: "10px" }}
                        >
                            {reply.idPengirim.nama}
                        </p>
                        <p
                            className={`text-xs line-clamp-1 ${mine ? "text-white" : "text-zinc-900"}`}
                        >
                            {reply.pesan}
                        </p>
                    </div>
                )}
                <div className="text-xs px-2 py-2">
                    <p className="inline mr-[50px]">{pesan}</p>
                </div>
                {pendingChat.includes(_id) ? (
                    <div className="absolute bottom-1 right-2">
                        <Clock6Icon className="size-3 opacity-50" />
                    </div>
                ) : (
                    <div className="flex items-center gap-1 absolute bottom-1 right-2">
                        {time && (
                            <p
                                className="text-end opacity-50"
                                style={{ fontSize: "10px" }}
                            >
                                {convertToTanggalIndonesia(time).jam_menit}
                            </p>
                        )}
                        {mine && (
                            <CheckCheckIcon
                                className={`size-3 ${seen.length == anggotaGroup.length ? "text-pink-400" : "opacity-50"}`}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
