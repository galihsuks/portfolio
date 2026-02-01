export default function SectionTitle({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-semibold max-w-lg mx-auto mt-4 text-white">
                {title}
            </h2>
            <p className="mt-2 md:mt-4 text-center text-xs/5 md:text-sm/7 text-gray-100 max-w-sm mx-10 md:mx-auto">
                {description}
            </p>
        </div>
    );
}
