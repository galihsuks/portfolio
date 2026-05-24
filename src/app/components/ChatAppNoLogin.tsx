"use client";

import { ChevronUpIcon, MessageCircle, Send } from "lucide-react";
import { FormEvent, useMemo, useRef, useState } from "react";
import { useMessages } from "next-intl";
import { useAuthStore } from "../chat/store/auth.store";
import { OWNER_CODE } from "../chat/config/constants";

type BotLine = { id: string; mine: boolean; text: string };

export default function ChatAppNoLogin() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const inputConfirm = useRef("");
  const [step, setStep] = useState<"ask-name" | "confirm-known">("ask-name");
  const [loading, setLoading] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [botLines, setBotLines] = useState<BotLine[]>([]);
  const { setUser, setIsOpenChat, setLoginProcess } = useAuthStore();
  const messages = useMessages();
  const chatbot = messages.chatbot as {
    opening: string;
    already_visit: string;
    wrong_password?: string;
  };
  const isEn = ((messages.lang as { code?: string } | undefined)?.code ?? "id") === "en";

  const opening = useMemo(
    () => chatbot.opening || (isEn ? "Hi! Tell me your name first." : "Hai! Tulis nama kamu dulu."),
    [chatbot.opening, isEn],
  );

  const pushBot = (text: string) => {
    setBotLines((prev) => [...prev, { id: crypto.randomUUID(), mine: false, text }]);
  };

  const pushMe = (text: string) => {
    setBotLines((prev) => [...prev, { id: crypto.randomUUID(), mine: true, text }]);
  };

  async function finishLogin(payload: {
    user?: { id: string; email: string; nama: string };
    token?: string;
    isOwner?: boolean;
  }) {
    if (!payload.user?.id || !payload.token) return;
    setIsOpenChat(true);
    setLoginProcess(true);
    setUser({
      id: String(payload.user.id),
      email: String(payload.user.email ?? ""),
      nama: String(payload.user.nama ?? ""),
      token: String(payload.token),
      isOwner: Boolean(payload.isOwner),
    });
    setTimeout(() => {
      window.location.reload();
    }, 10);
  }

  const handleSubmit = async (event?: FormEvent) => {
    event?.preventDefault();
    const text = input ? input.trim() : inputConfirm.current;
    if (!text || loading) return;
    pushMe(text);
    setInput("");

    if (step === "ask-name") {
      const normalized = text.toLowerCase();
      if (normalized === OWNER_CODE) {
        setLoading(true);
        const response = await fetch("/api/chat/owner-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: text }),
        });
        const data = await response.json().catch(() => ({}));
        setLoading(false);
        if (!response.ok) {
          pushBot(
            String(data?.message ?? (isEn ? "Invalid owner code." : "Kode owner tidak valid.")),
          );
          return;
        }
        await finishLogin(data);
        return;
      }

      setNameDraft(text);
      setLoading(true);
      const response = await fetch("/api/chat/preauth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: text }),
      });
      const data = await response.json().catch(() => ({}));
      setLoading(false);

      if (!response.ok) {
        pushBot(String(data?.message ?? (isEn ? "Something went wrong." : "Terjadi kesalahan.")));
        return;
      }

      if (data?.needConfirm) {
        setStep("confirm-known");
        pushBot(String(chatbot.already_visit ?? "Kamu sudah pernah chat? ya/tidak"));
        return;
      }

      await finishLogin(data);
      return;
    }

    if (step === "confirm-known") {
      const yesWords = ["ya", "yes", "y", "udah", "sudah"];
      const isKnown = yesWords.includes(text.toLowerCase());
      setLoading(true);
      const response = await fetch("/api/chat/preauth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameDraft, confirmKnown: isKnown }),
      });
      const data = await response.json().catch(() => ({}));
      setLoading(false);
      if (!response.ok) {
        pushBot(String(data?.message ?? (isEn ? "Failed to login." : "Gagal login.")));
        return;
      }
      await finishLogin(data);
    }
  };

  return (
    <>
      <div
        onClick={() => setOpen((p) => !p)}
        className={`cursor-pointer transition-all duration-400 fixed z-50 flex bottom-3 md:bottom-6 right-3 md:right-6 ${open ? "h-10 w-10 rotate-180" : "h-14 w-14"} glass items-center justify-center rounded-full backdrop-blur-xs`}
      >
        {open ? <ChevronUpIcon className="h-4 w-4" /> : <MessageCircle className="h-6 w-6" />}
      </div>
      <div
        data-lenis-prevent
        className={`transition-all duration-400 overflow-hidden fixed z-50 flex rounded-xl bg-black/70 border-white/10 backdrop-blur-lg md:bottom-20 md:right-6 bottom-16 right-3 ${open ? "h-[520px] md:w-[350px] w-[95%] border" : "h-[0px] w-[0px]"}`}
      >
        <section className="flex-1 min-h-0 flex flex-col">
          <div className="px-4 py-3 border-b border-white/10">
            <p className="font-semibold">Galih Sukmamukti</p>
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-3">
            {botLines.length === 0 && (
              <div className="mb-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs">
                {opening}
              </div>
            )}
            {botLines.map((line) => (
              <div
                key={line.id}
                className={`mb-2 flex ${line.mine ? "justify-end" : "justify-start"}`}
              >
                <div className="max-w-[75%] rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs">
                  {line.text}
                </div>
              </div>
            ))}
            {loading && (
              <p className="text-xs text-cyan-300">{isEn ? "Processing..." : "Memproses..."}</p>
            )}
          </div>
          <form onSubmit={handleSubmit} className="border-t border-white/10 p-2">
            <div className="flex items-center gap-2">
              {step === "confirm-known" ? (
                <div className="flex-1 flex items-center gap-2 text-center">
                  <span
                    className="rounded-full p-2 btn glass flex-1"
                    onClick={() => {
                      inputConfirm.current = "ya";
                      handleSubmit();
                    }}
                  >
                    {isEn ? "Yes" : "Ya"}
                  </span>
                  <span
                    className="rounded-full p-2 btn glass flex-1"
                    onClick={() => {
                      inputConfirm.current = "no";
                      handleSubmit();
                    }}
                  >
                    {isEn ? "No" : "Belum"}
                  </span>
                </div>
              ) : (
                <>
                  <input
                    spellCheck={false}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isEn ? "Type your answer..." : "Tulis jawaban kamu..."}
                    className="flex-1 rounded-lg border border-white/10 px-3 py-2 text-sm focus:outline-none"
                  />
                  <button type="submit" className="rounded-lg p-2 btn glass" disabled={loading}>
                    <Send className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </form>
        </section>
      </div>
    </>
  );
}
