import { NextIntlClientProvider } from "next-intl";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Metadata } from "next";

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
    metadataBase: new URL(process.env.NEXT_PUBLIC_FRONTEND_URL ?? ""),
    openGraph: {
        title: "Galih Sukmamukti Hidayatullah",
        description:
            "Full Stack Developer | Web Developer | Frontend Developer | Backend Developer",
        type: "website",
        siteName: "Galih Sukmamukti Hidayatullah",
        url: new URL(process.env.NEXT_PUBLIC_FRONTEND_URL ?? ""),
        // images: [
        //     {
        //         url: "https://images.unsplash.com/photo-1549487027-8c93657755e0?q=80&w=770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        //         width: 1200,
        //         height: 630,
        //         alt: "Galih Sukmamukti Hidayatullah",
        //     },
        // ],
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
        // images: [
        //     "https://images.unsplash.com/photo-1549487027-8c93657755e0?q=80&w=770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        // ],
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
