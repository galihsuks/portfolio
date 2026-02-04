export const envVar = {
    backendURL: process.env.NEXT_PUBLIC_BACKEND_URL ?? "",
    frontendURL: process.env.NEXT_PUBLIC_FRONTEND_URL ?? "",
    curriculumVitaeURL: process.env.NEXT_PUBLIC_URL_CV ?? "",
    websocketURL: process.env.NEXT_PUBLIC_WS ?? "",
};

export function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
