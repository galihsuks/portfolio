import {
    DribbbleIcon,
    GithubIcon,
    LinkedinIcon,
    TwitterIcon,
} from "lucide-react";
import { useMessages } from "next-intl";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    const messages = useMessages();

    const links = messages.navbar.list as {
        name: string;
        href: string;
    }[];

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    return (
        <footer className="flex flex-col items-center px-4 md:px-16 lg:px-24 justify-center w-full mt-20 border-0">
            <hr className="w-full border-white/20 mt-6" />
            <div className="flex flex-col md:flex-row justify-center items-center w-full justify-between gap-4 py-4">
                <p className="md:text-sm text-xs">
                    Copyright © {currentYear}. All rights reservered
                </p>
            </div>
        </footer>
    );
}
