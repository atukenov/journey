"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PageShell } from "@/components/ui/PageShell";
import { StepGate } from "@/components/StepGate";
import { WalkingHomeScene } from "@/components/scenes/WalkingHome";
import { useJourney } from "@/lib/store";

/**
 * Дом. Тёплый свет, свечи — и наша история,
 * рассказанная одной анимацией: от незнакомцев до собственного дома.
 */
export default function HomePage() {
  return (
    <StepGate step="home">
      <HomeChapter />
    </StepGate>
  );
}

function HomeChapter() {
  const router = useRouter();
  const { content, completeStep } = useJourney();
  const [sceneDone, setSceneDone] = useState(false);

  const next = () => {
    completeStep("home");
    router.push("/proposal");
  };

  return (
    <PageShell className="justify-center py-24">
      <p className="text-xs tracking-[0.35em] uppercase text-ink-faint mb-3">
        Последняя глава
      </p>
      <h1 className="font-display text-4xl md:text-5xl mb-10">{content.homeScreen.title}</h1>

      <WalkingHomeScene onFinished={() => setSceneDone(true)} />

      {/* свечи */}
      <div className="flex items-end gap-8 mt-10 mb-8" aria-hidden>
        {[36, 48, 30].map((h, i) => (
          <Candle key={i} height={h} delay={i * 0.4} />
        ))}
      </div>

      <AnimatePresence>
        {sceneDone && (
          <motion.div
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <div className="mb-10 space-y-2">
              {content.homeScreen.message.split("\n").map((line, i) => (
                <motion.p
                  key={i}
                  className="font-display italic text-2xl md:text-3xl text-ink-soft leading-relaxed"
                  initial={{ opacity: 0, filter: "blur(6px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{ delay: 0.5 + i * 1.4, duration: 1.4 }}
                >
                  {line}
                </motion.p>
              ))}
            </div>
            <motion.button
              onClick={next}
              className="btn-primary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.4, duration: 1 }}
            >
              {content.homeScreen.button}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}

function Candle({ height, delay }: { height: number; delay: number }) {
  return (
    <motion.svg
      width="26"
      height={height + 34}
      viewBox={`0 0 26 ${height + 34}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 + delay, duration: 1.2 }}
    >
      {/* ореол пламени */}
      <circle cx="13" cy="16" r="12" fill="#ffca6e" opacity="0.25" style={{ filter: "blur(6px)" }} />
      {/* пламя */}
      <g className="flame" style={{ animationDelay: `${delay}s` }}>
        <path d="M13 6 C 16 12, 17 15, 13 20 C 9 15, 10 12, 13 6 Z" fill="#ffb84d" />
        <path d="M13 10 C 14.6 13, 15 15, 13 18 C 11 15, 11.4 13, 13 10 Z" fill="#fff1c9" />
      </g>
      {/* фитиль и свеча */}
      <rect x="12.3" y="20" width="1.4" height="4" fill="#7a6f5f" />
      <rect x="6" y="24" width="14" height={height} rx="4" fill="var(--surface-strong)" stroke="var(--line)" />
    </motion.svg>
  );
}
