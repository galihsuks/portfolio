import { useTranslations } from "next-intl";
import SectionTitle from "../components/SectionTitle";

export default function Ability() {
    const t = useTranslations("ability");

    const logos = [
        "/img/figma.png",
        "/img/html.png",
        "/img/css.png",
        "/img/js.png",
        "/img/php.png",
        "/img/express.png",
        "/img/firebase.png",
        "/img/mongo.png",
        "/img/mysql.png",
        "/img/bootstrap.png",
        "/img/react.png",
        "/img/ci.png",
        "/img/nextjs.png",
        "/img/tailwind.png",
        "/img/ts.png",
    ];

    return (
        <section className="mt-32">
            <SectionTitle title={t("title")} description={t("subtitle")} />
            <div className="container-logo mt-10 flex flex-wrap justify-center gap-7 max-w-4xl w-full mx-auto py-4">
                {logos.map((logo, index) => (
                    <div
                        key={index}
                        className="item-logo hover:-translate-y-0.5 p-6 rounded-xl bg-white"
                    >
                        <img
                            src={logo}
                            alt="logo"
                            className="h-7 w-auto max-w-xs"
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}
