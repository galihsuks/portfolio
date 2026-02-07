import { ArrowRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import potoku from "../../../public/my_photo.png";
import Image from "next/image";
import HeroSectionTeks from "./HeroSection_teks";
import Link from "next/link";
import { envVar } from "../_services/utils";

export default function HeroSection() {
    const t = useTranslations("hero");
    return (
        <>
            <section className="flex flex-col items-center" id="hero-section">
                <div className="flex items-center gap-3 mt-10 md:mt-32">
                    <h1 className="font-hand text-4xl/13 md:text-6xl/19">
                        {t("greet")}
                    </h1>
                    <HeroSectionTeks />
                </div>
                <Image
                    alt="Galih Sukmamukti"
                    src={potoku}
                    width={200}
                    height={200}
                />
                <h1 className="md:text-center text-4xl md:text-6xl/19 mt-4 font-semibold max-w-3xl md:w-full">
                    Galih Sukmamukti Hidayatullah
                </h1>
                <p
                    className="md:text-center text-gray-100 text-xs/5 md:text-base/7 mt-6 md:w-full"
                    style={{ maxWidth: "1100px" }}
                >
                    {t("description")}
                </p>

                <div className="flex flex-col md:flex-row justify-center items-start md:items-center w-full gap-4 md:gap-3 mt-6">
                    <Link
                        href={envVar.curriculumVitaeURL as string}
                        target="_blank"
                        className="btn glass py-3"
                    >
                        {t("cta_cv")}
                    </Link>
                    <button
                        className="btn glass flex items-center justify-center gap-2 py-3"
                        id="hire-me-btn"
                    >
                        {t("cta_hire")}
                        <ArrowRightIcon className="size-4.5" />
                    </button>
                </div>
            </section>
        </>
    );
}
