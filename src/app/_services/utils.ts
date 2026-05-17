import {
    DateFormats,
    Type_Chat,
} from "./interface";

export const envVar = {
    backendURL: process.env.NEXT_PUBLIC_BACKEND_URL ?? "",
    frontendURL: process.env.NEXT_PUBLIC_FRONTEND_URL ?? "",
    curriculumVitaeURL: process.env.NEXT_PUBLIC_URL_CV ?? "",
    websocketURL: process.env.NEXT_PUBLIC_WS ?? "",
};

export function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function getSmartDisplay(date: Date, timezone: string) {
    const locale = "id-ID";

    // helper ambil Y-M-D dalam timezone
    function getYMD(d: Date) {
        const parts = new Intl.DateTimeFormat("en-CA", {
            timeZone: timezone,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }).formatToParts(d);

        const y = parts.find((p) => p.type === "year")?.value;
        const m = parts.find((p) => p.type === "month")?.value;
        const d2 = parts.find((p) => p.type === "day")?.value;

        return `${y}-${m}-${d2}`; // YYYY-MM-DD
    }

    const todayStr = getYMD(new Date());
    const targetStr = getYMD(date);

    // convert ke date object pure calendar (tanpa jam)
    const todayDate = new Date(todayStr);
    const targetDate = new Date(targetStr);

    const diffMs = todayDate.getTime() - targetDate.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    // ambil jam:menit
    const timeParts = new Intl.DateTimeFormat(locale, {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).formatToParts(date);

    const h = timeParts.find((p) => p.type === "hour")?.value || "00";
    const m = timeParts.find((p) => p.type === "minute")?.value || "00";

    // RULE LOGIC
    if (diffDays === 0) {
        return `${h}:${m}`; // hari ini
    }

    if (diffDays === 1) {
        return "Yesterday"; // kemarin
    }

    if (diffDays > 1 && diffDays <= 7) {
        return new Intl.DateTimeFormat(locale, {
            timeZone: timezone,
            weekday: "long",
        }).format(date); // nama hari
    }

    // > 7 hari → dd/mm/yyyy
    const d = new Intl.DateTimeFormat(locale, {
        timeZone: timezone,
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).formatToParts(date);

    const dd = d.find((p) => p.type === "day")?.value;
    const mm = d.find((p) => p.type === "month")?.value;
    const yy = d.find((p) => p.type === "year")?.value;

    return `${dd}/${mm}/${yy}`;
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

    // const optFull: Intl.DateTimeFormatOptions = {
    //     timeZone: timezone,
    //     weekday: "long",
    //     day: "2-digit",
    //     month: "long",
    //     year: "numeric",
    // };

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
        smart_display: getSmartDisplay(date, timezone),
    };
}

export function getMongoDateNow(timestamp?: number) {
    return timestamp
        ? new Date(timestamp).toISOString()
        : new Date().toISOString();
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
    const dateMongo = getMongoDateNow();
    return {
        _id: `${Date.now()}`,
        pesan: pesan,
        idChatReply: idChatReply,
        idPengirim: idPengirim,
        seenUsers: [
            {
                timestamp: dateMongo,
                user: idPengirim,
                _id: "",
            },
        ],
        createdAt: dateMongo,
        updatedAt: dateMongo,
    };
}


