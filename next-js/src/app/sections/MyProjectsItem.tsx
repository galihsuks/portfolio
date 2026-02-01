"use client";

import {
    ArrowRight,
    CheckIcon,
    GraduationCapIcon,
    Link,
    MessageSquareIcon,
    ShoppingBagIcon,
    WifiHighIcon,
} from "lucide-react";
import { useMessages } from "next-intl";
import { SetStateAction, useState } from "react";

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

const ItemProject = ({
    tipe = 0,
    me_created_in,
    data,
}: {
    tipe: number;
    data: ProjectInterface;
    me_created_in: string;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const IconBadge = icons[data.icon as keyof typeof icons];

    if (tipe) {
        return (
            <div className="flex items-center justify-center">
                <ModalProject
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    href={data.link}
                    username={data.account_login?.email ?? ""}
                    password={data.account_login?.password ?? ""}
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
                        <IconBadge className="size-3 md:size-3.5" />
                        <span>{data.badge}</span>
                    </div>
                    <img
                        src={data.image}
                        alt={data.name}
                        className="rounded-xl mb-3 aspect-video object-cover object-bottom md:hidden block"
                        style={{ zIndex: 5 }}
                    />
                    <h3 className="text-2xl md:text-3xl font-semibold">
                        {data.name.split(" ")[0]}
                    </h3>
                    {data.name.split(" ").length > 1 && (
                        <h3 className="text-base md:text-2xl font-semibold">
                            {data.name.split(" ")[1]}
                        </h3>
                    )}
                    <p className="text-gray-200 mt-2 text-xs md:text-sm">
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
                                        className="size-2 md:size-3 text-white"
                                        strokeWidth={3}
                                    />
                                </div>
                                <p className="text-xs md:text-sm">{l}</p>
                            </div>
                        ))}
                    </div>
                    {data.account_login?.email ? (
                        <button
                            onClick={() => {
                                setIsOpen(true);
                            }}
                            className={`rounded-md flex items-center gap-4 hover:gap-6 transition-all duration-400 mt-5 w-full btn hover:bg-white hover:text-gray-800 glass`}
                        >
                            Visit Project
                            <ArrowRight className="size-3" strokeWidth={3} />
                        </button>
                    ) : (
                        <a
                            href={data.link}
                            target="_blank"
                            className={`rounded-md flex items-center gap-4 hover:gap-6 transition-all duration-400 mt-5 w-full btn hover:bg-white hover:text-gray-800 glass`}
                        >
                            Visit Project
                            <ArrowRight className="size-3" strokeWidth={3} />
                        </a>
                    )}
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
                <ModalProject
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    href={data.link}
                    username={data.account_login?.email ?? ""}
                    password={data.account_login?.password ?? ""}
                />
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
                        <IconBadge className="size-3 md:size-3.5" />
                        <span>{data.badge}</span>
                    </div>
                    <img
                        src={data.image}
                        alt={data.name}
                        className="rounded-xl mb-3 aspect-video object-cover object-bottom md:hidden block"
                        style={{ zIndex: 5 }}
                    />
                    <h3 className="text-2xl md:text-3xl font-semibold">
                        {data.name.split(" ")[0]}
                    </h3>
                    {data.name.split(" ").length > 1 && (
                        <h3 className="text-base md:text-2xl font-semibold">
                            {data.name.split(" ")[1]}
                        </h3>
                    )}
                    <p className="text-gray-200 mt-2 text-xs md:text-sm">
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
                                        className="size-2 md:size-3 text-white"
                                        strokeWidth={3}
                                    />
                                </div>
                                <p className="text-xs md:text-sm">{l}</p>
                            </div>
                        ))}
                    </div>
                    {data.account_login?.email ? (
                        <button
                            onClick={() => {
                                setIsOpen(true);
                            }}
                            className={`rounded-md flex items-center gap-4 hover:gap-6 transition-all duration-400 mt-5 w-full btn hover:bg-white hover:text-gray-800 glass`}
                        >
                            Visit Project
                            <ArrowRight className="size-3" strokeWidth={3} />
                        </button>
                    ) : (
                        <a
                            href={data.link}
                            target="_blank"
                            className={`rounded-md flex items-center gap-4 hover:gap-6 transition-all duration-400 mt-5 w-full btn hover:bg-white hover:text-gray-800 glass`}
                        >
                            Visit Project
                            <ArrowRight className="size-3" strokeWidth={3} />
                        </a>
                    )}
                </div>
            </div>
        );
    }
};

const ModalProject = ({
    isOpen,
    setIsOpen,
    username,
    password,
    href,
}: {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    username: string;
    password: string;
    href: string;
}) => {
    const messages = useMessages();

    console.log("ini dari modal");
    console.log(messages.projects.modal_login);

    return (
        <div
            className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-black/20 text-lg font-medium backdrop-blur-2xl transition duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
            <p>{messages.projects.modal_login.label}:</p>
            <div>
                <p className="mb-2 text-xs md:text-sm">Email : {username}</p>
                <p className="text-xs md:text-sm">Password : {password}</p>
            </div>
            <div className="flex items-center justify-center gap-2">
                <a
                    href={href}
                    target="_blank"
                    onClick={() => setIsOpen(false)}
                    className="text-xs md:text-sm btn glass"
                >
                    {messages.projects.modal_login.cta_next}
                </a>

                <button
                    onClick={() => setIsOpen(false)}
                    className=" text-xs md:text-sm btn glass"
                >
                    {messages.projects.modal_login.cta_cancel}
                </button>
            </div>
        </div>
    );
};

export default ItemProject;
