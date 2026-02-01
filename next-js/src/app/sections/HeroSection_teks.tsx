"use client";

import { useEffect, useRef, useState } from "react";
import { delay } from "../_services/utils";

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function rewrite(before: string, after: string) {
        const lengthBefore = before.length;
        const lengthAfter = after.length;
        let teksBefore = before;
        const teksAfter = after;

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
            <p className="text-xs md:text-sm">{teks} Developer</p>
        </>
    );
}
