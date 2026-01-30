"use client";

import { MenuIcon, XIcon } from "lucide-react";
import { useMessages } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import { envVar } from "../_services/utils";

const sections = [
    "hero-section",
    "ability-section",
    "work-section",
    "project-section",
    "contact-section",
];

export default function Navbar() {
    const messages = useMessages();
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const [active, setActive] = useState("hero-section");

    const links = messages.navbar.list as {
        name: string;
        href: string;
    }[];

    useEffect(() => {
        const observers = [] as any;
        sections.forEach((id) => {
            const el = document.getElementById(id);
            if (!el) return;
            console.log(el);
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setActive(id);
                    }
                },
                {
                    root: null,
                    rootMargin: "0px",
                    threshold: 0.1, // 60% section terlihat baru dianggap aktif
                },
            );
            observer.observe(el);
            observers.push(observer);
        });
        return () => observers.forEach((obs: any) => obs.disconnect());
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [pathname]);

    return (
        <>
            <nav
                className={`sticky top-0 z-50 flex w-full items-center justify-between px-4 py-3.5 md:px-16 lg:px-24 transition-colors ${isScrolled ? "bg-white/15 backdrop-blur-lg" : ""}`}
            >
                <a href="#!">
                    <h1 className="font-hand text-2xl/19 md:text-3xl/19">
                        Galih
                    </h1>
                </a>

                <div className="hidden items-center space-x-10 md:flex">
                    {links.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`transition ${link.href.slice(1) == active ? "font-bold" : "hover:text-gray-300"}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        href={envVar.curriculumVitaeURL as string}
                        target="_blank"
                        className="btn glass"
                    >
                        {messages.navbar.cta_cv}
                    </Link>
                    <LanguageSwitcher />
                </div>

                <button
                    onClick={() => setIsOpen(true)}
                    className="transition active:scale-90 md:hidden"
                >
                    <MenuIcon className="size-6.5" />
                </button>
            </nav>

            <div
                className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-black/20 text-lg font-medium backdrop-blur-2xl transition duration-300 md:hidden ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                {links.map((link) => (
                    <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                    >
                        {link.name}
                    </Link>
                ))}

                <Link
                    href="/"
                    className="btn glass"
                    onClick={() => setIsOpen(false)}
                >
                    {messages.navbar.cta_cv}
                </Link>

                <button
                    onClick={() => setIsOpen(false)}
                    className="rounded-md p-2 glass"
                >
                    <XIcon />
                </button>
            </div>
        </>
    );
}
