import { ExternalLinkIcon } from "lucide-react";
import SectionTitle from "../components/SectionTitle";
import { useMessages } from "next-intl";

export default function WorkflowSteps() {
    const messages = useMessages();

    const list = messages.workflow.list as {
        title: string;
        badge: string;
        date: string;
        description: string;
        link: string;
        image: string;
    }[];

    return (
        <section className="mt-32 relative" id="work-section">
            <SectionTitle
                title={messages.workflow.title}
                description={messages.workflow.description}
            />

            <div className="relative space-y-20 md:space-y-30 mt-20">
                <div className="flex-col items-center hidden md:flex absolute left-1/2 -translate-x-1/2">
                    <p className="flex items-center justify-center font-medium my-10 aspect-square bg-black/15 p-2 rounded-full">
                        01
                    </p>
                    <div className="h-72 w-0.5 bg-gradient-to-b from-transparent via-white to-transparent" />
                    <p className="flex items-center justify-center font-medium my-10 aspect-square bg-black/15 p-2 rounded-full">
                        02
                    </p>
                    <div className="h-72 w-0.5 bg-gradient-to-b from-transparent via-white to-transparent" />
                    <p className="flex items-center justify-center font-medium my-10 aspect-square bg-black/15 p-2 rounded-full">
                        03
                    </p>
                </div>
                {list.map((step, index) => (
                    <div
                        key={index}
                        className={`flex items-center justify-center gap-6 md:gap-20 ${index % 2 !== 0 ? "flex-col md:flex-row-reverse" : "flex-col md:flex-row"}`}
                    >
                        <img
                            src={step.image}
                            alt="step"
                            className="flex-1 h-auto w-full max-w-sm rounded-2xl"
                        />
                        <div
                            key={index}
                            className="flex-1 flex flex-col gap-6 md:px-6 max-w-md"
                        >
                            <div>
                                <h3 className="text-2xl font-medium text-white mb-2">
                                    {step.title}
                                </h3>
                                <div className="flex items-center gap-3">
                                    <button className="btn glass py-1 px-3 text-xs">
                                        {step.badge}
                                    </button>
                                    <h5 className="text-1xl font-medium text-white">
                                        {step.date}
                                    </h5>
                                </div>
                            </div>
                            <p className="text-gray-100 text-sm/6 pb-2">
                                {step.description}
                            </p>
                            <a
                                href={step.link}
                                className="flex items-center gap-2"
                            >
                                View company
                                <ExternalLinkIcon className="size-4" />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
