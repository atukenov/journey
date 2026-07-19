"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useJourney } from "@/lib/store";

interface Floating {
  id: number;
  text: string;
  x: number; // vw
  y: number; // vh
}

/**
 * Признания, изредка проплывающие по экрану —
 * тихие, полупрозрачные, как мысли.
 */
export function FloatingMessages() {
  const { content, hydrated } = useJourney();
  const [current, setCurrent] = useState<Floating | null>(null);

  useEffect(() => {
    if (!hydrated || content.loveMessages.length === 0) return;
    let counter = 0;
    let hideTimer: ReturnType<typeof setTimeout>;

    const show = () => {
      const text =
        content.loveMessages[Math.floor(Math.random() * content.loveMessages.length)];
      setCurrent({
        id: counter++,
        text,
        x: 12 + Math.random() * 60,
        y: 18 + Math.random() * 55,
      });
      hideTimer = setTimeout(() => setCurrent(null), 7000);
    };

    const first = setTimeout(show, 14000);
    const interval = setInterval(show, 34000);
    return () => {
      clearTimeout(first);
      clearTimeout(hideTimer);
      clearInterval(interval);
    };
  }, [hydrated, content.loveMessages]);

  return (
    <div className="fixed inset-0 pointer-events-none z-40" aria-hidden>
      <AnimatePresence>
        {current && (
          <motion.span
            key={current.id}
            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            animate={{ opacity: 0.5, y: -30, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -60, filter: "blur(6px)" }}
            transition={{ duration: 6, ease: "easeOut" }}
            className="absolute font-display italic text-xl md:text-2xl text-gold-deep"
            style={{ left: `${current.x}vw`, top: `${current.y}vh` }}
          >
            {current.text}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
