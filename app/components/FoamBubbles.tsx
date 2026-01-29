"use client";

import { useMemo } from "react";

type Bubble = {
    left: string;
    top: string;
    size: number;
    duration: number;
    delay: number;
    opacity: number;
};

export default function FoamBubbles({ count = 20 }: { count?: number }) {
    const bubbles = useMemo(() => {
        const rand = (min: number, max: number) => min + Math.random() * (max - min);

        return Array.from({ length: count }).map((): Bubble => ({
            left: `${rand(0, 100)}%`,
            top: `${rand(0, 100)}%`,
            size: Math.round(rand(14, 46)), // bigger bubbles
            duration: rand(12, 26),
            delay: rand(0, 12),
            opacity: rand(0.18, 0.45), // 🔥 brighter
        }));
    }, [count]);

    return (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            {bubbles.map((b, i) => (
                <span
                    key={i}
                    className="absolute rounded-full"
                    style={{
                        left: b.left,
                        top: b.top,
                        width: `${b.size}px`,
                        height: `${b.size}px`,
                        opacity: b.opacity,
                        animation: `bubbleFloat ${b.duration}s ease-in-out ${b.delay}s infinite`,
                        background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95), rgba(255,255,255,0.35) 40%, rgba(255,255,255,0.12) 65%, rgba(255,255,255,0.05) 75%, transparent 78%)",
                        boxShadow: `
              inset 0 0 8px rgba(255,255,255,0.35),
              0 0 12px rgba(255,255,255,0.25)
            `,
                    }}
                >
                    {/* glossy highlight */}
                    <span
                        className="absolute left-[18%] top-[18%] h-[28%] w-[28%] rounded-full"
                        style={{
                            background:
                                "radial-gradient(circle, rgba(255,255,255,0.95), rgba(255,255,255,0.4), transparent 70%)",
                            filter: "blur(0.5px)",
                        }}
                    />
                </span>
            ))}

            <style jsx global>{`
        @keyframes bubbleFloat {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(0, -22px, 0) scale(1.06);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
      `}</style>
        </div>
    );
}
