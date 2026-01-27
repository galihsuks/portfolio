"use client";

import { useEffect, useLayoutEffect } from "react";
import Lenis from "lenis";

export default function LenisScroll() {
    useLayoutEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            smoothWheel: true,
            // smoothTouch: false,
            anchors: true,
        });

        const raf = (time: number) => {
            lenis.raf(time);
            requestAnimationFrame(raf);
        };

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    return null;
}
