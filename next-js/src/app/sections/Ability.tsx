"use client";
import { useMessages } from "next-intl";
import SectionTitle from "../components/SectionTitle";
import { useEffect, useRef, useState } from "react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";

const lists = [
    {
        id: 1,
        image: "/img/figma_white.png",
        label: "Figma",
        since: "2021",
        shape: "ver",
    },
    {
        id: 2,
        image: "/img/html_white.png",
        label: "HTML",
        since: "2022",
        shape: "ver",
    },
    {
        id: 3,
        image: "/img/css_white.png",
        label: "CSS",
        since: "2022",
        shape: "ver",
    },
    {
        id: 4,
        image: "/img/js_white.png",
        label: "JavaScript",
        since: "2022",
        shape: "ver",
    },
    {
        id: 5,
        image: "/img/php_white.png",
        label: "PHP",
        since: "2023",
        shape: "hor",
    },
];
const list2 = [
    {
        id: 6,
        image: "/img/express_white.png",
        label: "Express.js",
        since: "2022",
        shape: "hor",
    },
    {
        id: 7,
        image: "/img/firebase_white.png",
        label: "Firebase",
        since: "2022",
        shape: "ver",
    },
    {
        id: 8,
        image: "/img/mongo_white.png",
        label: "MongoDB",
        since: "2021",
        shape: "ver",
    },
    {
        id: 9,
        image: "/img/mysql_white.png",
        label: "MySQL",
        since: "2023",
        shape: "ver",
    },
    {
        id: 10,
        image: "/img/bootstrap_white.png",
        label: "Bootstrap",
        since: "2023",
        shape: "hor",
    },
];
const list3 = [
    {
        id: 11,
        image: "/img/react_white.png",
        label: "React",
        since: "2022",
        shape: "ver",
    },
    {
        id: 12,
        image: "/img/ci_white.png",
        label: "CodeIgniter",
        since: "2023",
        shape: "ver",
    },
    {
        id: 13,
        image: "/img/nextjs_white.png",
        label: "Next.js",
        since: "2024",
        shape: "ver",
    },
    {
        id: 14,
        image: "/img/tailwind_white.png",
        label: "Tailwind CSS",
        since: "2024",
        shape: "hor",
    },
    {
        id: 15,
        image: "/img/ts_white.png",
        label: "TypeScript",
        since: "2024",
        shape: "ver",
    },
];
const arraynya = [1, 15, 9, 8, 2, 7, 3, 14, 4, 5, 12, 10, 13, 6, 11];

export default function Ability() {
    const messages = useMessages();
    const currIndx = useRef(0);
    const [curId, setCurId] = useState(1);
    const [onHover, setOnHover] = useState(false);
    const [isOpen, setIsOpen] = useState(true);
    const extra_skills = messages.ability.extra_skills as string[];

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (currIndx.current >= arraynya.length - 1) {
                currIndx.current = 0;
            } else {
                currIndx.current++;
            }
            setCurId(arraynya[currIndx.current]);
        }, 2000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return (
        <section className="mt-32" id="ability-section">
            <SectionTitle
                title={messages.ability.title}
                description={messages.ability.subtitle}
            />
            <div
                className="container-icon-ability flex flex-wrap justify-center gap-10 max-w-3xl w-full mx-auto py-5 mt-5"
                onMouseEnter={() => {
                    setOnHover(true);
                }}
                onMouseLeave={() => {
                    setOnHover(false);
                }}
            >
                {lists.map((list, index) => (
                    <div
                        key={index}
                        className={`flex items-center gap-0 group transition-all duration-400 item-icon ${onHover ? "hover:gap-4" : list.id == curId ? "gap-4" : ""}`}
                    >
                        <img
                            src={list.image}
                            alt="logo"
                            className={`h-7 w-auto ${list.shape}`}
                        />
                        <div
                            className={`${onHover ? "group-hover:max-w-80" : list.id == curId ? "max-w-80" : ""} max-w-0 overflow-hidden transition-all duration-400`}
                        >
                            <p className="font-semibold text-2xl text-nowrap">
                                {list.label}
                            </p>
                            <p className="text-nowrap">{list.since}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div
                className="container-icon-ability flex flex-wrap justify-center gap-10 max-w-3xl w-full mx-auto py-5"
                onMouseEnter={() => {
                    setOnHover(true);
                }}
                onMouseLeave={() => {
                    setOnHover(false);
                }}
            >
                {list2.map((list, index) => (
                    <div
                        key={index}
                        className={`flex items-center gap-0 group hover:gap-4 transition-all duration-400 item-icon ${onHover ? "hover:gap-4" : list.id == curId ? "gap-4" : ""}`}
                    >
                        <img
                            src={list.image}
                            alt="logo"
                            className={`h-7 w-auto ${list.shape}`}
                        />
                        <div
                            className={`${onHover ? "group-hover:max-w-80" : list.id == curId ? "max-w-80" : ""} max-w-0 overflow-hidden transition-all duration-400`}
                        >
                            <p className="font-semibold text-2xl text-nowrap">
                                {list.label}
                            </p>
                            <p className="text-nowrap">{list.since}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div
                className="container-icon-ability flex flex-wrap justify-center gap-10 max-w-3xl w-full mx-auto py-5 mb-5"
                onMouseEnter={() => {
                    setOnHover(true);
                }}
                onMouseLeave={() => {
                    setOnHover(false);
                }}
            >
                {list3.map((list, index) => (
                    <div
                        key={index}
                        className={`flex items-center gap-0 group hover:gap-4 transition-all duration-400 item-icon ${onHover ? "hover:gap-4" : list.id == curId ? "gap-4" : ""}`}
                    >
                        <img
                            src={list.image}
                            alt="logo"
                            className={`h-7 w-auto ${list.shape}`}
                        />
                        <div
                            className={`${onHover ? "group-hover:max-w-80" : list.id == curId ? "max-w-80" : ""} max-w-0 overflow-hidden transition-all duration-400`}
                        >
                            <p className="font-semibold text-2xl text-nowrap">
                                {list.label}
                            </p>
                            <p className="text-nowrap">{list.since}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex flex-col glass rounded-md max-w-3xl w-full mx-auto">
                <h3
                    className="flex cursor-pointer hover:bg-white/10 transition items-start justify-between gap-4 p-4 font-medium"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    Extra Skills
                    <ChevronDownIcon
                        className={`size-5 transition-all shrink-0 duration-400 ${isOpen ? "rotate-180" : ""}`}
                    />
                </h3>
                <div
                    className={`px-4 text-sm/6 transition-all duration-400 overflow-hidden ${isOpen ? "pt-2 pb-4 max-h-80" : "max-h-0"}`}
                >
                    <div className="flex flex-col">
                        {extra_skills.map((skill, ind_s) => (
                            <div
                                key={ind_s}
                                className="flex items-center gap-2 py-2"
                            >
                                <div className="rounded-full glass border-0 p-1">
                                    <CheckIcon
                                        className="size-3 text-white"
                                        strokeWidth={3}
                                    />
                                </div>
                                <p>{skill}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
