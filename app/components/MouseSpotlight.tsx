"use client";

import { useEffect, useRef } from "react";

export default function MouseSpotlight() {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const move = (e: MouseEvent) => {
            // use CSS vars so React doesn't re-render
            el.style.setProperty("--mx", `${e.clientX}px`);
            el.style.setProperty("--my", `${e.clientY}px`);
        };

        window.addEventListener("mousemove", move, { passive: true });
        return () => window.removeEventListener("mousemove", move);
    }, []);

    return (
        <div
            ref={ref}
            className="pointer-events-none fixed inset-0 z-0"
            style={{
                // radial spotlight + subtle color fringe
                background:
                    "radial-gradient(600px 600px at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.10), transparent 60%), radial-gradient(900px 900px at var(--mx, 50%) var(--my, 50%), rgba(99,102,241,0.10), transparent 70%)",
            }}
        />
    );
}
