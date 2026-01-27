import { ArrowRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import potoku from "../../../public/my_photo.png";
import Image from "next/image";
import HeroSectionTeks from "./HeroSection_teks";

export default function HeroSection() {
    const t = useTranslations("hero");
    return (
        <>
            <section className="flex flex-col items-center">
                <div className="flex items-center gap-3 mt-32">
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
                <h1 className="text-center text-4xl/13 md:text-6xl/19 mt-4 font-semibold tracking-tight max-w-3xl">
                    Galih Sukmamukti Hidayatullah
                </h1>
                <p
                    className="text-center text-gray-100 text-base/7 mt-6"
                    style={{ maxWidth: "1100px" }}
                >
                    {t("description")}
                </p>

                <div className="flex flex-col md:flex-row max-md:w-full items-center gap-4 md:gap-3 mt-6">
                    <button className="btn max-md:w-full glass py-3">
                        {t("cta_cv")}
                    </button>
                    <button className="btn max-md:w-full glass flex items-center justify-center gap-2 py-3">
                        {t("cta_hire")}
                        <ArrowRightIcon className="size-4.5" />
                    </button>
                </div>
            </section>
        </>
    );
}
