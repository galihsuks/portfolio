"use client";

import { useLocale } from "next-intl";
import { Globe } from "lucide-react";
import { delay } from "../_services/utils";

const languages = [
    { code: "en", label: "EN" },
    { code: "id", label: "ID" },
];

export default function LanguageSwitcher() {
    const locale = useLocale();

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
        <div className="relative group">
            <button
                className="flex items-center gap-2 glass px-3 py-1.5 rounded-full text-sm hover:bg-white hover:text-gray-900 transition"
                // disabled={isPending}
            >
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
    );
}
