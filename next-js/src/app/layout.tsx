import { NextIntlClientProvider } from "next-intl";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Metadata } from "next";
import { envVar } from "./_services/utils";

/* eslint-disable @typescript-eslint/no-unused-vars */
const poppins = Poppins({
    subsets: ["latin"],
    variable: "--font-sans",
    weight: ["400", "500", "600", "700"],
});

const fontHand = localFont({
    src: [
        {
            path: "../../public/fonts/BrittanySignature.ttf",
            weight: "400",
            style: "normal",
        },
    ],
    variable: "--font-hand",
});

export const metadata: Metadata = {
    title: "Galih Sukmamukti Hidayatullah",
    description:
        "Full Stack Developer | Web Developer | Frontend Developer | Backend Developer",
    metadataBase: new URL(envVar.frontendURL),
    openGraph: {
        title: "Galih Sukmamukti Hidayatullah",
        description:
            "Full Stack Developer | Web Developer | Frontend Developer | Backend Developer",
        type: "website",
        siteName: "Galih Sukmamukti Hidayatullah",
        url: new URL(envVar.frontendURL),
        images: [
            {
                url: `${envVar.frontendURL}/my_photo_meta.jpg`,
                width: 720,
                height: 720,
                alt: "Galih Sukmamukti Hidayatullah",
            },
        ],
        locale: "id_ID",
    },
    icons: {
        icon: `./LOGO.png`,
    },
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_FRONTEND_URL ?? ""}`,
    },
    twitter: {
        card: "summary_large_image",
        title: "Galih Sukmamukti Hidayatullah",
        description:
            "Full Stack Developer | Web Developer | Frontend Developer | Backend Developer",
        images: [`${envVar.frontendURL}/my_photo_meta.jpg`],
        // creator: "@galihsuks",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    category: "portfolio",
    keywords: [
        "web developer",
        "full stack developer",
        "backend",
        "frontend",
        "galih",
        "galih sukma",
    ],
};

type Props = {
    children: React.ReactNode;
};

export default async function RootLayout({ children }: Props) {
    return (
        <html>
            <body className={`${fontHand.variable}`}>
                <NextIntlClientProvider>{children}</NextIntlClientProvider>
            </body>
        </html>
    );
}
