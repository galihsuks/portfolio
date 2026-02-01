import {
    ArrowRight,
    ArrowRightCircleIcon,
    CheckIcon,
    CrownIcon,
    GraduationCapIcon,
    MessageSquareIcon,
    ShoppingBagIcon,
    WifiHighIcon,
    ZapIcon,
} from "lucide-react";
import SectionTitle from "../components/SectionTitle";
import { useMessages } from "next-intl";
import ItemProject from "./MyProjectsItem";

const icons = {
    shop: ShoppingBagIcon,
    iot: WifiHighIcon,
    chat: MessageSquareIcon,
    education: GraduationCapIcon,
};

interface ProjectInterface {
    name: string;
    created_in: string;
    badge: string;
    icon: string;
    list: string[];
    link: string;
    image: string;
    account_login: null | {
        email: string;
        password: string;
    };
}

export default function Projects() {
    const messages = useMessages();
    const projects = messages.projects.projects as ProjectInterface[];

    return (
        <section className="mt-25 md:mt-32" id="project-section">
            <SectionTitle
                title={messages.projects.title}
                description={messages.projects.subtitle}
            />

            <div
                style={{ maxWidth: "1100px" }}
                className="mt-12 flex flex-col gap-5 md:gap-10 mx-auto"
            >
                {projects.map((p, ind_p) => (
                    <ItemProject
                        key={ind_p}
                        tipe={ind_p % 2}
                        data={p}
                        me_created_in={messages.projects.created_in}
                    />
                ))}
            </div>
        </section>
    );
}
