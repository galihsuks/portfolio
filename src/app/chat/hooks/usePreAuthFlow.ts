import { useState } from "react";
import { chatAuthApi } from "./useChatData";
import { ChatUser } from "../types";

const OWNER_EMAIL = "galih8.4.2001@gmail.com";
const GUEST_PASSWORD = "123456";

type BotLine = { _id: string; text: string; mine: boolean };

type Params = {
    setAuth: (user: ChatUser, isOwner: boolean) => void;
    setActiveRoomId: (roomId: string | null) => void;
    localeText: {
        opening: string;
        already_visit: string;
        loading_owner: string;
        loading_search_user: string;
        invalid_owner_code: string;
    };
};

export function usePreAuthFlow({
    setAuth,
    setActiveRoomId,
    localeText,
}: Params) {
    const [phase, setPhase] = useState<"ask-name" | "confirm-existing">("ask-name");
    const [candidate, setCandidate] = useState<{ _id: string; nama: string } | null>(null);
    const [loading, setLoading] = useState("");
    const [botLines, setBotLines] = useState<BotLine[]>([
        { _id: "b1", text: localeText.opening, mine: false },
    ]);

    const ensureGuestPrivateRoom = async () => {
        const newRoom = await chatAuthApi.postRoom("private", [OWNER_EMAIL], "");
        let roomId = newRoom.data._id ?? "";
        if (newRoom.status === 201) {
            const existing = await chatAuthApi.getRoomIdGalih();
            roomId = existing ?? roomId;
        }
        if (roomId) {
            await chatAuthApi.setRoomIdGalih(roomId);
            setActiveRoomId(roomId);
        }
    };

    const loginAsGuest = async (nama: string, existingId?: string) => {
        if (existingId) {
            await chatAuthApi.loginId(existingId);
        } else {
            const sanitized = nama.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() || "guest";
            const email = `${Date.now()}_${sanitized}@galihsuks.com`;
            await chatAuthApi.signup(email, nama, GUEST_PASSWORD);
            await chatAuthApi.login(email, GUEST_PASSWORD);
        }
        const me = await chatAuthApi.getMe();
        if (me.status === 200) {
            setAuth({ _id: me.data._id, nama: me.data.nama, email: me.data.email }, false);
        }
        await ensureGuestPrivateRoom();
    };

    const onPreAuthMessage = async (text: string) => {
        setBotLines((p) => [...p, { _id: `${Date.now()}u`, text, mine: true }]);
        if (text.toUpperCase() === "GALIHSUKS1234#") {
            setLoading(localeText.loading_owner);
            const res = await fetch("/api/chat/owner-login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: text }),
            });
            setLoading("");
            if (res.status !== 200) {
                setBotLines((p) => [
                    ...p,
                    {
                        _id: `${Date.now()}`,
                        text: localeText.invalid_owner_code,
                        mine: false,
                    },
                ]);
                return;
            }
            const json = await res.json();
            setAuth(json.user, true);
            return;
        }

        if (phase === "ask-name") {
            setLoading(localeText.loading_search_user);
            const name = text.replace(/[^a-zA-Z0-9 ]/g, "").trim() || "Guest";
            const checking = await chatAuthApi.getUserOne({ nama: name });
            setLoading("");
            if (checking.status === 200) {
                setCandidate({ _id: checking.data._id, nama: name });
                setPhase("confirm-existing");
                setBotLines((p) => [
                    ...p,
                    { _id: `${Date.now()}`, text: localeText.already_visit, mine: false },
                ]);
                return;
            }
            await loginAsGuest(name);
            return;
        }

        if (!candidate) return;
        if (["ya", "yes"].includes(text.toLowerCase())) {
            await loginAsGuest(candidate.nama, candidate._id);
        } else {
            await loginAsGuest(candidate.nama);
        }
    };

    return {
        loading,
        botLines,
        onPreAuthMessage,
    };
}
