"use client";

import { ChevronUpIcon, MessageCircle } from "lucide-react";
import { useState } from "react";

export default function ChatAppNoLogin() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen((p) => !p)}
        className={`cursor-pointer fixed z-50 flex bottom-3 md:bottom-6 right-3 md:right-6 ${open ? "h-10 w-10 rotate-180" : "h-14 w-14"} glass items-center justify-center rounded-full`}
      >
        {open ? <ChevronUpIcon className="h-4 w-4" /> : <MessageCircle className="h-6 w-6" />}
      </button>
      <div
        className={`transition-all duration-400 overflow-hidden fixed z-50 flex rounded-xl bg-black/70 border-white/10 backdrop-blur-lg md:bottom-20 md:right-6 bottom-16 right-3 ${open ? "h-[520px] md:w-[900px] w-[95%] border" : "h-[0px] w-[0px]"}`}
      >
        {/* TODO */}
      </div>
    </>
  );
}
