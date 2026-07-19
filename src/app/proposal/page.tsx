"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { StepGate } from "@/components/StepGate";
import { RevealText } from "@/components/ui/RevealText";
import { useJourney } from "@/lib/store";

/**
 * Финал. Никаких кнопок. Только слова.
 * Первая строка. Пауза. Вторая строка. Экран гаснет.
 * Тишина. И — вопрос.
 */

type Stage = "line1" | "line2" | "dark" | "question";

export default function ProposalPage() {
  return (
    <StepGate step="proposal">
      <Proposal />
    </StepGate>
  );
}

function Proposal() {
  const { content, completeStep } = useJourney();
  const [stage, setStage] = useState<Stage>("line1");

  useEffect(() => {
    completeStep("proposal");
    const timers = [
      setTimeout(() => setStage("line2"), 7000),
      setTimeout(() => setStage("dark"), 13500),
      setTimeout(() => setStage("question"), 19500),
    ];
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="flex-1 relative flex items-center justify-center overflow-hidden px-6">
      {/* затемнение мира */}
      <motion.div
        className="fixed inset-0 z-0"
        style={{ background: "#0a0812" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: stage === "dark" || stage === "question" ? 1 : 0 }}
        transition={{ duration: 4, ease: "easeInOut" }}
      />

      <div className="relative z-10 w-full max-w-3xl text-center">
        <AnimatePresence mode="wait">
          {stage === "line1" && (
            <motion.div key="l1" exit={{ opacity: 0, filter: "blur(8px)" }} transition={{ duration: 1.8 }}>
              <RevealText
                as="h1"
                text={content.proposal.line1}
                className="font-display text-4xl md:text-6xl leading-tight"
                delay={1.2}
                stagger={0.35}
              />
            </motion.div>
          )}

          {stage === "line2" && (
            <motion.div key="l2" exit={{ opacity: 0, filter: "blur(8px)" }} transition={{ duration: 1.8 }}>
              <RevealText
                as="h1"
                text={content.proposal.line2}
                className="font-display text-4xl md:text-6xl leading-tight"
                delay={1}
                stagger={0.35}
              />
            </motion.div>
          )}

          {stage === "question" && (
            <motion.div
              key="q"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2 }}
              className="flex flex-col items-center"
            >
              {/* тихие звёзды вокруг вопроса */}
              {QUESTION_STARS.map((s, i) => (
                <motion.span
                  key={i}
                  className="absolute rounded-full bg-white pointer-events-none"
                  style={{
                    left: `${s.x}%`,
                    top: `${s.y}%`,
                    width: s.size,
                    height: s.size,
                    animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  transition={{ delay: 2 + i * 0.15, duration: 2 }}
                />
              ))}

              <RevealText
                as="h1"
                text={content.proposal.question}
                className="font-display text-5xl md:text-8xl leading-tight text-white"
                delay={2.5}
                stagger={0.8}
              />

              {/* медленно бьющееся сердце */}
              <motion.svg
                viewBox="0 0 100 90"
                className="w-14 mt-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 6.5, duration: 2 }}
                style={{
                  overflow: "visible",
                  filter: "drop-shadow(0 0 20px rgba(217, 165, 160, 0.5))",
                }}
              >
                <motion.path
                  d="M50 82 C 20 60, 4 42, 4 26 C 4 10, 16 4, 27 4 C 38 4, 46 12, 50 20 C 54 12, 62 4, 73 4 C 84 4, 96 10, 96 26 C 96 42, 80 60, 50 82 Z"
                  fill="#d9a5a0"
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                  style={{ transformOrigin: "50px 45px" }}
                />
              </motion.svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

const QUESTION_STARS = Array.from({ length: 40 }, (_, i) => ({
  x: (i * 41.7) % 100,
  y: (i * 59.3) % 100,
  size: 1 + ((i * 7) % 3),
  dur: 2.5 + ((i * 13) % 30) / 10,
  delay: ((i * 17) % 40) / 10,
}));
