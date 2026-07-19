"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * Особенная сцена.
 * Двое идут навстречу через всю жизнь.
 * Встречаются. Берутся за руки. Идут вместе.
 * И строят маленький дом: стены, крыша, свет, дым, звёзды.
 */

type Stage = "walk" | "meet" | "together" | "build" | "glow";

const HOUSE = { x: 620, y: 300 }; // основание дома

export function WalkingHomeScene({ onFinished }: { onFinished?: () => void }) {
  const [stage, setStage] = useState<Stage>("walk");

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage("meet"), 5500),
      setTimeout(() => setStage("together"), 9000),
      setTimeout(() => setStage("build"), 13000),
      setTimeout(() => setStage("glow"), 17500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (stage === "glow" && onFinished) {
      const t = setTimeout(onFinished, 2500);
      return () => clearTimeout(t);
    }
  }, [stage, onFinished]);

  const after = (s: Stage) => {
    const order: Stage[] = ["walk", "meet", "together", "build", "glow"];
    return order.indexOf(stage) >= order.indexOf(s);
  };

  // позиции пары
  const himX = stage === "walk" ? 150 : after("together") ? 508 : 332;
  const herX = stage === "walk" ? 620 : after("together") ? 540 : 368;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <svg viewBox="0 0 900 420" className="w-full" aria-hidden>
        {/* вечернее небо проявляется к финалу */}
        <motion.rect
          x="0" y="0" width="900" height="420" rx="32"
          fill="#181428"
          initial={{ opacity: 0 }}
          animate={{ opacity: after("build") ? 0.85 : 0 }}
          transition={{ duration: 4 }}
        />

        {/* звёзды */}
        {after("glow") &&
          STAR_FIELD.map((s, i) => (
            <motion.circle
              key={i}
              cx={s.x}
              cy={s.y}
              r={s.r}
              fill="#ffe9c4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              transition={{ delay: i * 0.12, duration: 1.5 }}
              style={{ animation: `twinkle ${2 + (i % 4)}s ease-in-out ${i * 0.2}s infinite` }}
            />
          ))}

        {/* луна */}
        <motion.circle
          cx="780" cy="80" r="22"
          fill="#f6e7c8"
          initial={{ opacity: 0 }}
          animate={{ opacity: after("build") ? 0.9 : 0 }}
          transition={{ duration: 3 }}
          style={{ filter: "blur(0.5px) drop-shadow(0 0 18px rgba(246,231,200,0.6))" }}
        />

        {/* земля */}
        <line x1="60" y1="340" x2="840" y2="340" stroke="var(--line)" strokeWidth="1.5" />

        {/* ─── дом строится ─── */}
        {after("build") && (
          <g>
            {/* стены поднимаются */}
            <motion.rect
              x={HOUSE.x - 45} width="90" height="56" rx="5"
              fill="var(--surface-strong)" stroke="var(--gold-deep)" strokeWidth="1.5"
              initial={{ y: HOUSE.y + 40, height: 0, opacity: 0 }}
              animate={{ y: HOUSE.y - 16, height: 56, opacity: 1 }}
              transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            />
            {/* крыша опускается */}
            <motion.path
              d={`M ${HOUSE.x - 56} ${HOUSE.y - 16} L ${HOUSE.x} ${HOUSE.y - 62} L ${HOUSE.x + 56} ${HOUSE.y - 16} Z`}
              fill="var(--gold-deep)"
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            />
            {/* труба */}
            <motion.rect
              x={HOUSE.x + 18} y={HOUSE.y - 56} width="11" height="22" rx="2"
              fill="var(--gold-deep)"
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ delay: 2.4, duration: 0.8 }}
              style={{ transformOrigin: `${HOUSE.x + 23}px ${HOUSE.y - 34}px` }}
            />
            {/* дверь */}
            <motion.rect
              x={HOUSE.x - 9} y={HOUSE.y + 18} width="18" height="22" rx="3"
              fill="var(--gold-deep)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.8, duration: 0.8 }}
            />
          </g>
        )}

        {/* свет в окнах и дым */}
        {after("glow") && (
          <g>
            <motion.circle
              cx={HOUSE.x} cy={HOUSE.y - 10} r="85"
              fill="#ffcf7d"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.14 }}
              transition={{ duration: 2.5 }}
              style={{ filter: "blur(24px)" }}
            />
            {[HOUSE.x - 32, HOUSE.x + 14].map((wx, i) => (
              <motion.rect
                key={i}
                x={wx} y={HOUSE.y - 4} width="18" height="15" rx="3"
                fill="#ffd98a"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.5, duration: 1.4 }}
                style={{ filter: "drop-shadow(0 0 8px rgba(255, 200, 110, 0.9))" }}
              />
            ))}
            {[0, 1.7, 3.4].map((delay, i) => (
              <circle
                key={i}
                cx={HOUSE.x + 23.5}
                cy={HOUSE.y - 58}
                r={4 + i * 1.5}
                fill="#cbc3b6"
                opacity="0"
                style={{ animation: `smoke-rise 5.5s ease-out ${delay}s infinite` }}
              />
            ))}
          </g>
        )}

        {/* ─── двое ─── */}
        {/* он */}
        <motion.g
          animate={{ x: himX }}
          transition={{ duration: stage === "walk" ? 0 : 3.5, ease: [0.35, 0.6, 0.35, 1] }}
          initial={{ x: 150 }}
        >
          <motion.g
            animate={{ y: [0, -2.5, 0] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
          >
            <g transform="translate(0 340)" fill={after("build") ? "#efe6d6" : "var(--ink-soft)"}>
              <circle cx="0" cy="-46" r="7" />
              <path d="M0 -38 C 6 -36, 7 -26, 6 -14 L 4 0 L -4 0 L -6 -14 C -7 -26, -6 -36, 0 -38 Z" />
              {/* рука тянется к ней после встречи */}
              {after("meet") && (
                <motion.path
                  d="M5 -30 C 10 -28, 14 -24, 16 -20"
                  stroke={after("build") ? "#efe6d6" : "var(--ink-soft)"}
                  strokeWidth="3.5" strokeLinecap="round" fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2 }}
                />
              )}
            </g>
          </motion.g>
        </motion.g>

        {/* она */}
        <motion.g
          animate={{ x: herX }}
          transition={{ duration: stage === "walk" ? 0 : 3.5, ease: [0.35, 0.6, 0.35, 1] }}
          initial={{ x: 620 }}
        >
          <motion.g
            animate={{ y: [0, -2.5, 0] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut", delay: 0.5 }}
          >
            <g transform="translate(0 340)" fill={after("build") ? "#e8cfa8" : "var(--gold-deep)"}>
              <circle cx="0" cy="-46" r="7" />
              <path d="M0 -38 C 6 -35, 8 -24, 9 -2 L -9 -2 C -8 -24, -6 -35, 0 -38 Z" />
              {after("meet") && (
                <motion.path
                  d="M-5 -30 C -10 -28, -14 -24, -16 -20"
                  stroke={after("build") ? "#e8cfa8" : "var(--gold-deep)"}
                  strokeWidth="3.5" strokeLinecap="round" fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2 }}
                />
              )}
            </g>
          </motion.g>
        </motion.g>

        {/* сердце в момент встречи */}
        {after("meet") && !after("build") && (
          <motion.path
            d="M350 250 c -3 -3.8, -8 -6.3, -8 -10.7 c 0 -3.5, 2.8 -5, 5 -5 c 1.7 0, 2.6 1.5, 3 2.8 c 0.4 -1.3, 1.3 -2.8, 3 -2.8 c 2.2 0, 5 1.5, 5 5 c 0 4.4, -5 6.9, -8 10.7 Z"
            fill="var(--blush)"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.4, 1.15, 1, 0.9], y: [0, -8, -14, -22] }}
            transition={{ duration: 3.4, ease: "easeOut" }}
            style={{ transformOrigin: "350px 244px" }}
          />
        )}
      </svg>
    </div>
  );
}

const STAR_FIELD = Array.from({ length: 26 }, (_, i) => ({
  x: 70 + ((i * 131) % 760),
  y: 40 + ((i * 67) % 150),
  r: 1 + (i % 3) * 0.7,
}));
