"use client";

import { motion } from "framer-motion";

/**
 * Двое — минималистичные силуэты, медленно идущие навстречу.
 * Тонкая линия земли, длинные тени, тёплый свет между ними.
 */

function Figure({ variant }: { variant: "him" | "her" }) {
  const isHim = variant === "him";
  return (
    <motion.g
      animate={{ y: [0, -2.5, 0] }}
      transition={{ repeat: Infinity, duration: 1.15, ease: "easeInOut", delay: isHim ? 0 : 0.55 }}
    >
      {/* голова */}
      <circle cx="0" cy="-46" r="7" fill="currentColor" />
      {/* тело — мягкий вытянутый силуэт */}
      <path
        d={
          isHim
            ? "M0 -38 C 6 -36, 7 -26, 6 -14 L 4 0 L -4 0 L -6 -14 C -7 -26, -6 -36, 0 -38 Z"
            : "M0 -38 C 6 -35, 8 -24, 9 -2 L -9 -2 C -8 -24, -6 -35, 0 -38 Z"
        }
        fill="currentColor"
      />
    </motion.g>
  );
}

export function TwoStrangersScene({ met }: { met: boolean }) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <svg viewBox="0 0 800 220" className="w-full" aria-hidden>
        {/* тёплое свечение в точке будущей встречи */}
        <motion.circle
          cx="400"
          cy="190"
          r="70"
          fill="var(--gold)"
          initial={{ opacity: 0 }}
          animate={{ opacity: met ? 0.18 : 0.05 }}
          transition={{ duration: 3 }}
          style={{ filter: "blur(30px)" }}
        />

        {/* линия земли */}
        <motion.line
          x1="60"
          y1="190"
          x2="740"
          y2="190"
          stroke="var(--line)"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.5, ease: "easeOut" }}
        />

        {/* он */}
        <motion.g
          style={{ color: "var(--ink-soft)" }}
          initial={{ x: 110 }}
          animate={{ x: met ? 382 : 300 }}
          transition={{ duration: met ? 4 : 7, ease: [0.3, 0.5, 0.3, 1] }}
        >
          <g transform="translate(0 190)">
            <Figure variant="him" />
            <ellipse cx="0" cy="2" rx="16" ry="2.5" fill="var(--ink)" opacity="0.08" />
          </g>
        </motion.g>

        {/* она */}
        <motion.g
          style={{ color: "var(--gold-deep)" }}
          initial={{ x: 690 }}
          animate={{ x: met ? 418 : 500 }}
          transition={{ duration: met ? 4 : 7, ease: [0.3, 0.5, 0.3, 1] }}
        >
          <g transform="translate(0 190)">
            <Figure variant="her" />
            <ellipse cx="0" cy="2" rx="16" ry="2.5" fill="var(--ink)" opacity="0.08" />
          </g>
        </motion.g>

        {/* маленькое сердце над ними при встрече */}
        {met && (
          <motion.path
            d="M400 96 C 396 91, 390 88, 390 82 C 390 77, 394 75, 397 75 C 399 75, 400 77, 400 79 C 400 77, 401 75, 403 75 C 406 75, 410 77, 410 82 C 410 88, 404 91, 400 96 Z"
            fill="var(--blush)"
            initial={{ opacity: 0, scale: 0, y: 10 }}
            animate={{ opacity: [0, 1, 1], scale: 1, y: 0 }}
            transition={{ delay: 3.6, duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "400px 85px" }}
          />
        )}
      </svg>
    </div>
  );
}
