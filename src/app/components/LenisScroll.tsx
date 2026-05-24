"use client";

import { useLayoutEffect } from "react";
import Lenis from "lenis";

export default function LenisScroll() {
    useLayoutEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            smoothWheel: true,
            anchors: true,
            prevent: (node) => {
                if (!(node instanceof HTMLElement)) return false;
                return Boolean(node.closest("[data-lenis-prevent]"));
            },
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
