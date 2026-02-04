"use client";

export default function BubbleChat({
    pesan,
    reply = null,
    seen = [],
    time,
    mine,
}: {
    pesan: string;
    reply?: null | {
        pengirim: string;
        pesan: string;
    };
    seen?: {
        time: string;
        nama: string;
    }[];
    time: string;
    mine: boolean;
}) {
    if (mine) {
        return (
            <div className="flex justify-end ps-10">
                <div className="rounded-t-lg rounded-s-lg px-3 py-2 glass">
                    <p className="mb-1">{pesan}</p>
                    <p className="text-end opacity-50 text-xs">{time}</p>
                </div>
            </div>
        );
    } else {
        return (
            <div className="flex justify-start pe-10">
                <div className="rounded-t-lg rounded-e-lg bg-gray-50 px-3 py-2 text-gray-700">
                    <p className="mb-1">{pesan}</p>
                    <p className="text-end opacity-50 text-xs">{time}</p>
                </div>
            </div>
        );
    }
}
