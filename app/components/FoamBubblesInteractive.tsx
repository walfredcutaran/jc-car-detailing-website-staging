"use client";

import React, { useEffect, useRef, useState } from "react";

type Bubble = {
    id: string;
    x: number; // %
    y: number; // % start
    size: number; // px
    duration: number; // s
    delay: number; // s
    opacity: number;
    drift: number; // px
    popped: boolean;
};

function rand(min: number, max: number) {
    return min + Math.random() * (max - min);
}
function uid() {
    return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}
function makeBubble(): Bubble {
    return {
        id: uid(),
        x: rand(0, 100),
        y: rand(80, 110),
        size: Math.round(rand(18, 56)),
        duration: rand(10, 22),
        delay: rand(0, 6),
        opacity: rand(0.28, 0.6),
        drift: rand(-40, 40),
        popped: false,
    };
}

export default function FoamBubblesInteractive({
    count = 22,
    popDistance = 28,
}: {
    count?: number;
    popDistance?: number;
}) {
    const [mounted, setMounted] = useState(false);
    const [bubbles, setBubbles] = useState<Bubble[]>([]);

    const bubbleRefs = useRef<Map<string, HTMLSpanElement>>(new Map());
    const mouse = useRef({ x: -9999, y: -9999 });

    // ✅ Mount -> generate bubbles on client only
    useEffect(() => {
        setMounted(true);
        setBubbles(Array.from({ length: count }).map(makeBubble));
    }, [count]);

    // ✅ Track mouse (only meaningful when mounted)
    useEffect(() => {
        if (!mounted) return;

        const onMove = (e: MouseEvent) => {
            mouse.current.x = e.clientX;
            mouse.current.y = e.clientY;
        };
        const onLeave = () => {
            mouse.current.x = -9999;
            mouse.current.y = -9999;
        };

        window.addEventListener("mousemove", onMove, { passive: true });
        window.addEventListener("mouseleave", onLeave, { passive: true });
        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseleave", onLeave);
        };
    }, [mounted]);

    // ✅ Pop bubbles when cursor gets close (rAF loop)
    useEffect(() => {
        if (!mounted) return;

        let raf = 0;

        const tick = () => {
            const mx = mouse.current.x;
            const my = mouse.current.y;

            if (mx > -1000 && my > -1000) {
                const idsToPop: string[] = [];

                bubbleRefs.current.forEach((el, id) => {
                    const rect = el.getBoundingClientRect();
                    const cx = rect.left + rect.width / 2;
                    const cy = rect.top + rect.height / 2;

                    const dx = cx - mx;
                    const dy = cy - my;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist <= popDistance) idsToPop.push(id);
                });

                if (idsToPop.length) {
                    setBubbles((prev) =>
                        prev.map((b) =>
                            idsToPop.includes(b.id) ? { ...b, popped: true } : b
                        )
                    );

                    window.setTimeout(() => {
                        setBubbles((prev) => {
                            const kept = prev.filter((b) => !idsToPop.includes(b.id));
                            const replaced = idsToPop.map(() => makeBubble());
                            return [...kept, ...replaced];
                        });
                    }, 280);
                }
            }

            raf = requestAnimationFrame(tick);
        };

        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [mounted, popDistance]);

    // ✅ Click to pop bubbles near cursor
    useEffect(() => {
        if (!mounted) return;

        const onClick = () => {
            const mx = mouse.current.x;
            const my = mouse.current.y;

            const idsToPop: string[] = [];
            bubbleRefs.current.forEach((el, id) => {
                const rect = el.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = cx - mx;
                const dy = cy - my;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist <= popDistance * 1.6) idsToPop.push(id);
            });

            if (!idsToPop.length) return;

            setBubbles((prev) =>
                prev.map((b) => (idsToPop.includes(b.id) ? { ...b, popped: true } : b))
            );

            window.setTimeout(() => {
                setBubbles((prev) => {
                    const kept = prev.filter((b) => !idsToPop.includes(b.id));
                    const replaced = idsToPop.map(() => makeBubble());
                    return [...kept, ...replaced];
                });
            }, 280);
        };

        window.addEventListener("click", onClick);
        return () => window.removeEventListener("click", onClick);
    }, [mounted, popDistance]);

    // ✅ Render nothing on the server + before mount (hydration-safe)
    if (!mounted) return null;

    return (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            {bubbles.map((b) => (
                <span
                    key={b.id}
                    ref={(el) => {
                        if (!el) bubbleRefs.current.delete(b.id);
                        else bubbleRefs.current.set(b.id, el);
                    }}
                    className={[
                        "absolute rounded-full will-change-transform",
                        b.popped ? "animate-bubblePop" : "animate-bubbleRise",
                    ].join(" ")}
                    style={
                        {
                            left: `${b.x}%`,
                            top: `${b.y}%`,
                            width: `${b.size}px`,
                            height: `${b.size}px`,
                            opacity: b.opacity,
                            animationDuration: b.popped ? "280ms" : `${b.duration}s`,
                            animationDelay: b.popped ? "0ms" : `${b.delay}s`,
                            background:
                                "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95), rgba(255,255,255,0.40) 42%, rgba(255,255,255,0.12) 70%, rgba(255,255,255,0.06) 78%, transparent 82%)",
                            boxShadow:
                                "inset 0 0 10px rgba(255,255,255,0.35), 0 0 14px rgba(255,255,255,0.25)",
                            "--drift": `${b.drift}px`,
                        } as React.CSSProperties & { "--drift": string }
                    }
                >
                    <span
                        className="absolute left-[18%] top-[18%] h-[28%] w-[28%] rounded-full"
                        style={{
                            background:
                                "radial-gradient(circle, rgba(255,255,255,0.95), rgba(255,255,255,0.35), transparent 70%)",
                            filter: "blur(0.6px)",
                        }}
                    />
                </span>
            ))}

            <style jsx global>{`
        @keyframes bubbleRise {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          60% {
            transform: translate3d(var(--drift, 0px), -55vh, 0) scale(1.06);
          }
          100% {
            transform: translate3d(calc(var(--drift, 0px) * 1.2), -110vh, 0)
              scale(1.02);
            opacity: 0;
          }
        }

        @keyframes bubblePop {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          55% {
            transform: scale(1.25);
            opacity: 0.7;
          }
          100% {
            transform: scale(0.2);
            opacity: 0;
          }
        }

        .animate-bubbleRise {
          animation-name: bubbleRise;
          animation-timing-function: ease-in-out;
          animation-iteration-count: 1;
          animation-fill-mode: forwards;
        }

        .animate-bubblePop {
          animation-name: bubblePop;
          animation-timing-function: ease-out;
          animation-iteration-count: 1;
          animation-fill-mode: forwards;
        }
      `}</style>
        </div>
    );
}
