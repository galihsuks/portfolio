"use client";

function required(name: string): string {
    const value = process.env[name];
    if (!value || value.trim() === "") {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

function optional(name: string, fallback: string): string {
    const value = process.env[name];
    return value && value.trim() !== "" ? value : fallback;
}

export const env = {
    VITE_API_URL: required("NEXT_PUBLIC_BACKEND_URL"),
    VITE_WS_URL: required("NEXT_PUBLIC_WS"),
    VITE_WS_APP_ID: optional("NEXT_PUBLIC_WS_APP_ID", "omong"),
} as const;
