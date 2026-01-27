"use client";

import { after } from "node:test";
import { useEffect, useRef, useState } from "react";

const arrPosisi = ["Full Stack", "Frontend", "Backend"];

export default function HeroSectionTeks() {
    const indexCur = useRef(0);
    const [teks, setTeks] = useState("Full Stack");

    useEffect(() => {
        const looping = setInterval(() => {
            const indexNext = indexCur.current + 1;
            if (indexNext > 2) {
                indexCur.current = 0;
                rewrite(teks, arrPosisi[0]);
            } else {
                indexCur.current = indexNext;
                rewrite(teks, arrPosisi[indexNext]);
            }
        }, 3000);

        return () => {
            clearInterval(looping);
        };
    }, []);

    async function rewrite(before: string, after: string) {
        const lengthBefore = before.length;
        const lengthAfter = after.length;
        let teksBefore = before;
        let teksAfter = after;

        for (let i = 0; i < lengthBefore; i++) {
            teksBefore = teksBefore.slice(0, -1);
            setTeks(teksBefore);
            await delay(20);
        }
        for (let i = 0; i < lengthAfter; i++) {
            teksBefore = `${teksBefore}${teksAfter[i]}`;
            setTeks(teksBefore);
            await delay(20);
        }
    }

    return (
        <>
            <p>{teks} Developer</p>
        </>
    );
}

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
