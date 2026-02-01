import { GithubIcon, InstagramIcon, MailsIcon, PhoneIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function CallToAction() {
    const t = useTranslations("contact");

    return (
        <div
            className="flex flex-col max-w-5xl mt-25 md:mt-40 px-4 mx-auto items-center justify-center rounded-xl md:glass"
            id="contact-section"
        >
            <h2 className="text-2xl md:text-4xl font-medium mt-2">
                {t("title")}
            </h2>
            <p className="mt-3 text-xs md:text-sm/7 max-w-md">
                {t("subtitle_1")}
            </p>
            <p className="text-xs md:text-sm/7 max-w-md md:mt-0 mt-1">
                {t("subtitle_2")}
            </p>

            {/* MOBILE VERSION */}
            <div className="md:hidden flex flex-col mt-7 gap-4 w-full">
                <Link
                    href={"mailto:galih8.4.2001@gmail.com"}
                    target="_blank"
                    className={`flex items-center item-icon gap-4`}
                >
                    <MailsIcon size={20} />
                    <div className={`max-w-80 overflow-hidden`}>
                        <p className="font-semibold text-sm text-nowrap">
                            Gmail
                        </p>
                        <p className="text-nowrap text-xs">
                            galih8.4.2001@gmail.com
                        </p>
                    </div>
                </Link>
                <Link
                    href={
                        "https://api.whatsapp.com/send/?phone=+6281905266517&text=Halo%2C+Galih%21+Kami+ingin+mengajak+Anda+untuk+bekerja+bersama+kami&type=phone_number&app_absent=0"
                    }
                    target="_blank"
                    className={`flex items-center item-icon gap-4`}
                >
                    <PhoneIcon size={20} />
                    <div className={`max-w-80 overflow-hidden`}>
                        <p className="font-semibold text-sm text-nowrap">
                            WhatsApp
                        </p>
                        <p className="text-nowrap text-xs">+62819-0526-6517</p>
                    </div>
                </Link>
                <Link
                    href={"https://github.com/galihsuks"}
                    target="_blank"
                    className={`flex items-center item-icon gap-4`}
                >
                    <GithubIcon size={20} />
                    <div className={`max-w-80 overflow-hidden`}>
                        <p className="font-semibold text-sm text-nowrap">
                            Github
                        </p>
                        <p className="text-nowrap text-xs">galihsuks</p>
                    </div>
                </Link>
                <Link
                    href={"https://www.instagram.com/galihsuks_"}
                    target="_blank"
                    className={`flex items-center item-icon gap-4`}
                >
                    <InstagramIcon size={20} />
                    <div className={`max-w-80 overflow-hidden`}>
                        <p className="font-semibold text-sm text-nowrap">
                            Instagram
                        </p>
                        <p className="text-nowrap text-xs">galihsuks_</p>
                    </div>
                </Link>
            </div>

            {/* DESKTOP VERSION */}
            <div className="hidden md:flex justify-center items-center gap-10 mt-10">
                <Link
                    href={"mailto:galih8.4.2001@gmail.com"}
                    target="_blank"
                    className={`flex items-center gap-0 group transition-all duration-400 item-icon hover:gap-4`}
                >
                    <MailsIcon size={30} />
                    <div
                        className={`group-hover:max-w-80 max-w-0 overflow-hidden transition-all duration-400`}
                    >
                        <p className="font-semibold text-2xl text-nowrap">
                            Gmail
                        </p>
                        <p className="text-nowrap">galih8.4.2001@gmail.com</p>
                    </div>
                </Link>
                <Link
                    href={
                        "https://api.whatsapp.com/send/?phone=+6281905266517&text=Halo%2C+Galih%21+Kami+ingin+mengajak+Anda+untuk+bekerja+bersama+kami&type=phone_number&app_absent=0"
                    }
                    target="_blank"
                    className={`flex items-center gap-0 group transition-all duration-400 item-icon hover:gap-4`}
                >
                    <PhoneIcon size={30} />
                    <div
                        className={`group-hover:max-w-80 max-w-0 overflow-hidden transition-all duration-400`}
                    >
                        <p className="font-semibold text-2xl text-nowrap">
                            WhatsApp
                        </p>
                        <p className="text-nowrap">+62819-0526-6517</p>
                    </div>
                </Link>
                <Link
                    href={"https://github.com/galihsuks"}
                    target="_blank"
                    className={`flex items-center gap-0 group transition-all duration-400 item-icon hover:gap-4`}
                >
                    <GithubIcon size={30} />
                    <div
                        className={`group-hover:max-w-80 max-w-0 overflow-hidden transition-all duration-400`}
                    >
                        <p className="font-semibold text-2xl text-nowrap">
                            Github
                        </p>
                        <p className="text-nowrap">galihsuks</p>
                    </div>
                </Link>
                <Link
                    href={"https://www.instagram.com/galihsuks_"}
                    target="_blank"
                    className={`flex items-center gap-0 group transition-all duration-400 item-icon hover:gap-4`}
                >
                    <InstagramIcon size={30} />
                    <div
                        className={`group-hover:max-w-80 max-w-0 overflow-hidden transition-all duration-400`}
                    >
                        <p className="font-semibold text-2xl text-nowrap">
                            Instagram
                        </p>
                        <p className="text-nowrap">galihsuks_</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}
