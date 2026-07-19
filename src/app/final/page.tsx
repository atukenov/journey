"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PageShell } from "@/components/ui/PageShell";
import { StepGate } from "@/components/StepGate";
import { HomeRevealScene } from "@/components/scenes/HomeReveal";
import { useJourney } from "@/lib/store";

/**
 * Вместо новой точки — карта сама дорисовывает путь.
 * Цель превращается в дом: дым, свет в окнах, звёзды.
 */
export default function FinalMapPage() {
  return (
    <StepGate step="final">
      <FinalMap />
    </StepGate>
  );
}

function FinalMap() {
  const router = useRouter();
  const { content, completeStep } = useJourney();
  const [revealed, setRevealed] = useState(false);

  const goHome = () => {
    completeStep("final");
    router.push("/home");
  };

  return (
    <PageShell className="justify-start pt-24 pb-16">
      <div className="w-full max-w-4xl flex flex-col items-center">
        <p className="text-xs tracking-[0.35em] uppercase text-ink-faint mb-3">
          {content.finalMap.title}
        </p>
        <h1 className="font-display text-4xl md:text-5xl mb-8 text-center">
          Куда ведёт наша нить
        </h1>

        <HomeRevealScene stops={content.stops} onRevealed={() => setRevealed(true)} />

        <AnimatePresence>
          {revealed && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center text-center mt-10"
            >
              <div className="mb-10 space-y-2">
                {content.finalMap.message.split("\n").map((line, i) => (
                  <motion.p
                    key={i}
                    className="font-display italic text-2xl md:text-3xl text-ink-soft leading-relaxed"
                    initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ delay: 0.4 + i * 1.4, duration: 1.2 }}
                  >
                    {line}
                  </motion.p>
                ))}
              </div>
              <motion.button
                onClick={goHome}
                className="btn-primary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.2, duration: 1 }}
              >
                {content.finalMap.button}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageShell>
  );
}
