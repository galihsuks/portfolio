export const envVar = {
    frontendURL: process.env.NEXT_PUBLIC_FRONTEND_URL ?? "",
    curriculumVitaeURL: process.env.NEXT_PUBLIC_URL_CV ?? "",
};

export function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
