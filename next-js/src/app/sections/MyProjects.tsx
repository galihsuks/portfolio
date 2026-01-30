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
        <section className="mt-32" id="project-section">
            <SectionTitle
                title={messages.projects.title}
                description={messages.projects.subtitle}
            />

            <div
                style={{ maxWidth: "1100px" }}
                className="mt-12 flex flex-col gap-10 mx-auto"
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

const ItemProject = ({
    tipe = 0,
    me_created_in,
    data,
}: {
    tipe: number;
    data: ProjectInterface;
    me_created_in: string;
}) => {
    const IconBadge = icons[data.icon as keyof typeof icons];

    if (tipe) {
        return (
            <div className="flex items-center justify-center">
                <div
                    style={{
                        minHeight: "450px",
                        zIndex: 10,
                        boxShadow: "0px 0px 20px rgba(0,0,0,0.5)",
                    }}
                    className="group w-full max-w-80 glass p-6 rounded-xl"
                >
                    <div className="flex items-center w-max ml-auto text-xs gap-2 glass rounded-full px-3 py-1 mb-3">
                        <IconBadge className="size-3.5" />
                        <span>{data.badge}</span>
                    </div>
                    <h3 className="text-3xl font-semibold">
                        {data.name.split(" ")[0]}
                    </h3>
                    {data.name.split(" ").length > 1 && (
                        <h3 className="text-2xl font-semibold">
                            {data.name.split(" ")[1]}
                        </h3>
                    )}
                    <p className="text-gray-200 mt-2">
                        {me_created_in} {data.created_in}
                    </p>
                    <div className="mt-3 flex flex-col">
                        {data.list.map((l, ind_l) => (
                            <div
                                key={ind_l}
                                className="flex items-center gap-2 py-2"
                            >
                                <div className="rounded-full glass border-0 p-1">
                                    <CheckIcon
                                        className="size-3 text-white"
                                        strokeWidth={3}
                                    />
                                </div>
                                <p>{l}</p>
                            </div>
                        ))}
                    </div>
                    <a
                        href={data.link}
                        target="_blank"
                        className={`rounded-md flex items-center gap-4 hover:gap-6 transition-all duration-400 mt-5 w-full btn hover:bg-white hover:text-gray-800 glass`}
                    >
                        Visit Project
                        <ArrowRight className="size-3" strokeWidth={3} />
                    </a>
                </div>

                <img
                    style={{ zIndex: 5 }}
                    src={data.image}
                    alt={data.name}
                    className="rounded-e-xl aspect-video object-cover object-bottom hidden md:block"
                />
            </div>
        );
    } else {
        return (
            <div className="flex items-center justify-center">
                <img
                    src={data.image}
                    alt={data.name}
                    className="rounded-s-xl aspect-video object-cover object-bottom hidden md:block"
                    style={{ zIndex: 5 }}
                />
                <div
                    style={{
                        minHeight: "450px",
                        zIndex: 10,
                        boxShadow: "0px 0px 20px rgba(0,0,0,0.5)",
                    }}
                    className="group w-full max-w-80 glass p-6 rounded-xl"
                >
                    <div className="flex items-center w-max ml-auto text-xs gap-2 glass rounded-full px-3 py-1 mb-3">
                        <ShoppingBagIcon className="size-3.5" />
                        <span>{data.badge}</span>
                    </div>
                    <h3 className="text-3xl font-semibold">
                        {data.name.split(" ")[0]}
                    </h3>
                    {data.name.split(" ").length > 1 && (
                        <h3 className="text-2xl font-semibold">
                            {data.name.split(" ")[1]}
                        </h3>
                    )}
                    <p className="text-gray-200 mt-2">
                        {me_created_in} {data.created_in}
                    </p>
                    <div className="mt-3 flex flex-col">
                        {data.list.map((l, ind_l) => (
                            <div
                                key={ind_l}
                                className="flex items-center gap-2 py-2"
                            >
                                <div className="rounded-full glass border-0 p-1">
                                    <CheckIcon
                                        className="size-3 text-white"
                                        strokeWidth={3}
                                    />
                                </div>
                                <p>{l}</p>
                            </div>
                        ))}
                    </div>
                    <a
                        href={data.link}
                        target="_blank"
                        className={`rounded-md flex items-center gap-4 hover:gap-6 transition-all duration-400 mt-5 w-full btn hover:bg-white hover:text-gray-800 glass`}
                    >
                        Visit Project
                        <ArrowRight className="size-3" strokeWidth={3} />
                    </a>
                </div>
            </div>
        );
    }
};
