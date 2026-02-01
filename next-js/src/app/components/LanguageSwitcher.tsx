"use client";

import { useLocale } from "next-intl";
import { Globe } from "lucide-react";
import { delay } from "../_services/utils";
import { useState } from "react";

const languages = [
    { code: "en", label: "EN" },
    { code: "id", label: "ID" },
];

export default function LanguageSwitcher() {
    const locale = useLocale();
    const [open, setOpen] = useState(false);

    const changeLanguage = (lang: string) => {
        (async () => {
            const response = await fetch("/api/cookies", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ locale: lang }),
            });
            const result = await response.json();
            if (response.status != 200) {
                console.log(result);
                return;
            }
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: "smooth",
            });
            await delay(1000);
            window.location.reload();
        })();
    };

    return (
        <>
            <div className="relative group hidden md:block">
                <button className="flex items-center gap-2 glass px-3 py-1.5 rounded-full text-sm hover:bg-white hover:text-gray-900 transition">
                    <Globe className="size-4" />
                    <span>{locale.toUpperCase()}</span>
                </button>

                <div className="absolute right-0 mt-2 min-w-[80px] glass backdrop-blur-lg rounded-lg overflow-hidden opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => changeLanguage(lang.code)}
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-white hover:text-gray-900 transition ${
                                locale === lang.code ? "font-semibold" : ""
                            }`}
                        >
                            {lang.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* MOBILE VERSION */}
            <div
                className={`relative flex flex-col items-center md:hidden z-10 transition-all duration-200 ${open ? "gap-2" : "gap-0"}`}
                onClick={() => {
                    setOpen(!open);
                }}
            >
                <button
                    className={`flex items-center gap-2 glass px-3 py-1.5 rounded-full text-sm transition ${open ? "bg-white text-gray-900" : ""}`}
                >
                    <Globe className="size-4" />
                    <span>{locale.toUpperCase()}</span>
                </button>

                <div
                    className={`backdrop-blur-lg rounded-lg overflow-hidden transition-all duration-200 ${open ? "max-h-80 glass" : "max-h-0"}`}
                >
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => changeLanguage(lang.code)}
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-white hover:text-gray-900 transition ${
                                locale === lang.code ? "font-semibold" : ""
                            }`}
                        >
                            {lang.label}
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
}
