"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useJourney } from "@/lib/store";
import { RevealText } from "@/components/ui/RevealText";

/**
 * Открывающая сцена.
 * Ночь. Две крошечные звезды медленно летят навстречу друг другу.
 * Встретившись — вспыхивают и становятся сердцем.
 * Ночь тает, наступает тёплое утро, появляется название.
 */

type Stage = "night" | "merge" | "heart" | "dawn";

export default function OpeningPage() {
  const router = useRouter();
  const { completeStep } = useJourney();
  const [stage, setStage] = useState<Stage>("night");

  useEffect(() => {
    const t1 = setTimeout(() => setStage("merge"), 4200);
    const t2 = setTimeout(() => setStage("heart"), 5100);
    const t3 = setTimeout(() => setStage("dawn"), 8200);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  const begin = () => {
    completeStep("opening");
    router.push("/story/1");
  };

  const night = stage === "night" || stage === "merge" || stage === "heart";

  return (
    <main className="flex-1 relative flex flex-col items-center justify-center overflow-hidden px-6">
      {/* Ночное небо, тающее на рассвете */}
      <motion.div
        className="fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 120%, #2a2338 0%, #14111f 55%, #0a0812 100%)",
        }}
        initial={{ opacity: 1 }}
        animate={{ opacity: night ? 1 : 0 }}
        transition={{ duration: 3.5, ease: "easeInOut" }}
      />

      {/* Россыпь дальних звёзд */}
      <motion.div
        className="fixed inset-0 z-0 pointer-events-none"
        animate={{ opacity: night ? 1 : 0 }}
        transition={{ duration: 3 }}
        aria-hidden
      >
        {STARS.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              opacity: 0.6,
              animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}
      </motion.div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[60vh] w-full">
        {/* Две звезды и сердце */}
        <div className="relative h-52 w-full flex items-center justify-center">
          <AnimatePresence>
            {stage !== "dawn" && (
              <>
                {/* Его звезда */}
                <motion.div
                  key="star-him"
                  className="absolute h-2.5 w-2.5 rounded-full"
                  style={{
                    background: "#ffe9c4",
                    boxShadow:
                      "0 0 18px 6px rgba(255, 226, 170, 0.8), 0 0 60px 20px rgba(255, 210, 140, 0.35)",
                  }}
                  initial={{ x: "-38vw", y: 30, opacity: 0, scale: 0.4 }}
                  animate={
                    stage === "night"
                      ? { x: "-6vw", y: 6, opacity: 1, scale: 1 }
                      : { x: 0, y: 0, opacity: 1, scale: 1.4 }
                  }
                  exit={{ opacity: 0 }}
                  transition={
                    stage === "night"
                      ? { duration: 4.4, ease: [0.3, 0.6, 0.4, 1] }
                      : { duration: 0.9, ease: "easeIn" }
                  }
                />
                {/* Её звезда */}
                <motion.div
                  key="star-her"
                  className="absolute h-2.5 w-2.5 rounded-full"
                  style={{
                    background: "#ffd9e0",
                    boxShadow:
                      "0 0 18px 6px rgba(255, 200, 214, 0.8), 0 0 60px 20px rgba(255, 170, 190, 0.35)",
                  }}
                  initial={{ x: "38vw", y: -26, opacity: 0, scale: 0.4 }}
                  animate={
                    stage === "night"
                      ? { x: "6vw", y: -5, opacity: 1, scale: 1 }
                      : { x: 0, y: 0, opacity: 1, scale: 1.4 }
                  }
                  exit={{ opacity: 0 }}
                  transition={
                    stage === "night"
                      ? { duration: 4.4, ease: [0.3, 0.6, 0.4, 1] }
                      : { duration: 0.9, ease: "easeIn" }
                  }
                />
              </>
            )}
          </AnimatePresence>

          {/* Вспышка встречи */}
          <AnimatePresence>
            {stage === "heart" && (
              <motion.div
                key="flash"
                className="absolute h-6 w-6 rounded-full bg-white"
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: [0, 14, 20], opacity: [1, 0.5, 0] }}
                transition={{ duration: 1.6, ease: "easeOut" }}
                style={{ boxShadow: "0 0 80px 40px rgba(255,230,200,0.6)" }}
              />
            )}
          </AnimatePresence>

          {/* Сердце, рождённое из двух звёзд */}
          {(stage === "heart" || stage === "dawn") && (
            <motion.svg
              viewBox="0 0 100 90"
              className="absolute w-28 md:w-36"
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.4, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{
                overflow: "visible",
                filter: "drop-shadow(0 0 12px rgba(255, 214, 160, 0.55))",
              }}
            >
              <motion.path
                d="M50 82 C 20 60, 4 42, 4 26 C 4 10, 16 4, 27 4 C 38 4, 46 12, 50 20 C 54 12, 62 4, 73 4 C 84 4, 96 10, 96 26 C 96 42, 80 60, 50 82 Z"
                fill="none"
                stroke={stage === "dawn" ? "var(--gold)" : "#ffdfb8"}
                strokeWidth="1.6"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2.2, delay: 0.5, ease: "easeInOut" }}
              />
              <motion.path
                d="M50 82 C 20 60, 4 42, 4 26 C 4 10, 16 4, 27 4 C 38 4, 46 12, 50 20 C 54 12, 62 4, 73 4 C 84 4, 96 10, 96 26 C 96 42, 80 60, 50 82 Z"
                fill="var(--gold)"
                initial={{ opacity: 0 }}
                animate={{ opacity: stage === "dawn" ? 0.14 : 0.08 }}
                transition={{ duration: 2, delay: 1.5 }}
              />
            </motion.svg>
          )}
        </div>

        {/* Название и приглашение — на рассвете */}
        <AnimatePresence>
          {stage === "dawn" && (
            <motion.div
              key="title"
              className="flex flex-col items-center text-center mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <TitleAndButton onBegin={begin} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Возможность пропустить долгое вступление */}
      {night && (
        <button
          onClick={() => setStage("dawn")}
          className="fixed bottom-6 right-6 z-20 text-xs tracking-widest uppercase text-white/30 hover:text-white/60 transition-colors"
        >
          пропустить
        </button>
      )}
    </main>
  );
}

function TitleAndButton({ onBegin }: { onBegin: () => void }) {
  const { content } = useJourney();
  return (
    <>
      <RevealText
        as="h1"
        text={content.opening.title}
        className="font-display text-5xl md:text-7xl tracking-wide mb-6"
        delay={0.6}
        stagger={0.3}
      />
      <RevealText
        text={content.opening.subtitle}
        className="font-display italic text-lg md:text-xl text-ink-soft max-w-md leading-relaxed mb-12"
        delay={1.8}
        stagger={0.08}
      />
      <motion.button
        onClick={onBegin}
        className="btn-primary"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.4, duration: 1 }}
      >
        {content.opening.button}
      </motion.button>
    </>
  );
}

const STARS = Array.from({ length: 70 }, (_, i) => ({
  x: (i * 37.3) % 100,
  y: (i * 53.7) % 100,
  size: 1 + ((i * 7) % 3),
  dur: 2.5 + ((i * 13) % 40) / 10,
  delay: ((i * 17) % 50) / 10,
}));
