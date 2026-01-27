"use client";

import { MenuIcon, XIcon } from "lucide-react";
import { useMessages } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
    const messages = useMessages();
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();

    const links = messages.navbar.list as {
        name: string;
        href: string;
    }[];

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
                    {/* <Image
                        src="/LOGO.png"
                        alt="logo"
                        className="h-8.5 w-auto"
                        width={205}
                        height={48}
                    /> */}
                    <h1 className="font-hand text-2xl/19 md:text-3xl/19">
                        Galih
                    </h1>
                </a>

                <div className="hidden items-center space-x-10 md:flex">
                    {links.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="transition hover:text-gray-300"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link href="/" className="btn glass">
                        {messages.navbar.cta_cv}
                    </Link>
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
