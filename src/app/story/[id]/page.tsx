"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { PageShell } from "@/components/ui/PageShell";
import { RevealText, RevealLines } from "@/components/ui/RevealText";
import { StepGate } from "@/components/StepGate";
import { TwoStrangersScene } from "@/components/scenes/TwoStrangers";
import { useJourney } from "@/lib/store";

export default function StoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  if (id === "1") {
    return (
      <StepGate step="story-1">
        <ChapterOne />
      </StepGate>
    );
  }
  return (
    <StepGate step="story-2">
      <ChapterTwo />
    </StepGate>
  );
}

/* ───────────────────────── Глава 1 · Двое незнакомцев ─────────────────── */

function ChapterOne() {
  const router = useRouter();
  const { content, completeStep } = useJourney();
  const [met, setMet] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMet(true), 6500);
    return () => clearTimeout(t);
  }, []);

  const next = () => {
    completeStep("story-1");
    router.push("/story/2");
  };

  return (
    <PageShell className="justify-center text-center">
      <p className="text-xs tracking-[0.35em] uppercase text-ink-faint mb-3">
        Глава первая
      </p>
      <h1 className="font-display text-4xl md:text-5xl mb-10">{content.story1.title}</h1>

      <TwoStrangersScene met={met} />

      <RevealText
        text={content.story1.text}
        className="font-display italic text-xl md:text-2xl text-ink-soft max-w-xl leading-relaxed mt-10 mb-12"
        delay={2}
        stagger={0.16}
      />

      <motion.button
        onClick={next}
        className="btn-primary mb-16"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 9, duration: 1 }}
      >
        Продолжить
      </motion.button>
    </PageShell>
  );
}

/* ───────────────────────── Глава 2 · Первая встреча ───────────────────── */

function ChapterTwo() {
  const router = useRouter();
  const { content, completeStep } = useJourney();
  const photos = content.gallery;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (photos.length < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % photos.length), 5000);
    return () => clearInterval(t);
  }, [photos.length]);

  const next = () => {
    completeStep("story-2");
    router.push("/quest");
  };

  return (
    <PageShell className="justify-center text-center">
      <p className="text-xs tracking-[0.35em] uppercase text-ink-faint mb-3 mt-20">
        Глава вторая
      </p>
      <h1 className="font-display text-4xl md:text-5xl mb-10">{content.story2.title}</h1>

      {/* Плывущие воспоминания — фотографии, сменяющие друг друга */}
      <div className="relative w-full max-w-2xl aspect-[4/3] md:aspect-[16/10] mb-10">
        <AnimatePresence>
          <motion.div
            key={index}
            className="absolute inset-0 rounded-3xl overflow-hidden glass"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={photos[index]?.src ?? ""}
              alt={photos[index]?.caption ?? ""}
              fill
              sizes="(max-width: 768px) 100vw, 672px"
              className="object-cover"
              priority
            />
            <div
              className="absolute inset-x-0 bottom-0 p-6 text-left"
              style={{
                background: "linear-gradient(transparent, rgba(20,15,8,0.55))",
              }}
            >
              <p className="font-display italic text-white/90 text-lg">
                {photos[index]?.caption}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <RevealLines
        lines={content.story2.lines}
        className="mb-12 space-y-2"
        lineClassName="font-display italic text-xl md:text-2xl text-ink-soft leading-relaxed"
        delay={1}
        lineDelay={2.2}
      />

      <motion.button
        onClick={next}
        className="btn-primary mb-16"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 + content.story2.lines.length * 2.2 + 1, duration: 1 }}
      >
        Продолжить
      </motion.button>
    </PageShell>
  );
}
