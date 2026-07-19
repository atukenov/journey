"use client";

import { use, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PageShell } from "@/components/ui/PageShell";
import { RevealText } from "@/components/ui/RevealText";
import { StepGate } from "@/components/StepGate";
import { CodeWordGate } from "@/components/CodeWordGate";
import { useJourney } from "@/lib/store";
import { JourneyStep } from "@/lib/content";

/**
 * Глава на точке маршрута.
 * Сначала — кодовое слово из спрятанной записки.
 * Потом — послание, вопрос или задание. Ответы сохраняются.
 */
export default function StopPage({ params }: { params: Promise<{ stop: string }> }) {
  const { stop: stopId } = use(params);
  const { content } = useJourney();
  const stop = content.stops.find((s) => s.id === stopId);

  if (!stop) {
    return (
      <PageShell className="justify-center text-center">
        <p className="text-ink-soft">Эта точка не найдена на нашей карте.</p>
      </PageShell>
    );
  }

  return (
    <StepGate step={`stop-${stop.id}` as JourneyStep}>
      <StopChapter stopId={stop.id} />
    </StepGate>
  );
}

function StopChapter({ stopId }: { stopId: string }) {
  const router = useRouter();
  const { content, completeStep, answers, saveAnswer } = useJourney();
  const stop = content.stops.find((s) => s.id === stopId)!;
  const [unlocked, setUnlocked] = useState(false);
  const [answer, setAnswer] = useState(answers[stopId] ?? "");

  const ordered = useMemo(
    () => [...content.stops].sort((a, b) => a.order - b.order),
    [content.stops]
  );
  const isLast = stop.order === ordered.length;
  const needsAnswer = Boolean(stop.question || stop.taskPrompt);
  const isNight = stop.id === "expo";

  const finish = () => {
    if (needsAnswer) saveAnswer(stopId, answer.trim());
    completeStep(`stop-${stopId}` as JourneyStep);
    router.push(isLast ? "/final" : "/quest");
  };

  return (
    <PageShell className="justify-center py-24">
      {/* Ночное небо для сферы EXPO — глава о будущем и звёздах */}
      {isNight && unlocked && <NightBackdrop />}

      {!unlocked ? (
        <CodeWordGate
          codeWord={stop.codeWord}
          hint={stop.hint}
          placeName={stop.name}
          onUnlock={() => setUnlocked(true)}
        />
      ) : (
        <motion.div
          className="relative z-10 w-full max-w-xl flex flex-col items-center text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          <p
            className={`text-xs tracking-[0.35em] uppercase mb-3 ${
              isNight ? "text-white/40" : "text-ink-faint"
            }`}
          >
            {stop.chapterTitle}
          </p>
          <h1
            className={`font-display text-4xl md:text-5xl mb-10 ${
              isNight ? "text-white" : ""
            }`}
          >
            {stop.name}
          </h1>

          <div className="mb-10 space-y-2">
            {stop.message.split("\n").map((line, i) => (
              <RevealText
                key={i}
                text={line}
                className={`font-display italic text-2xl md:text-3xl leading-relaxed ${
                  isNight ? "text-white/85" : "text-ink-soft"
                }`}
                delay={0.8 + i * 1.6}
                stagger={0.14}
              />
            ))}
          </div>

          {(stop.question || stop.taskPrompt) && (
            <motion.div
              className="w-full mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.8, duration: 1 }}
            >
              <p
                className={`text-base leading-relaxed mb-5 ${
                  isNight ? "text-white/70" : "text-ink-soft"
                }`}
              >
                {stop.question ?? stop.taskPrompt}
              </p>
              <textarea
                className="input-soft min-h-[120px] resize-none"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Напиши здесь..."
              />
              <p className={`text-xs mt-2 ${isNight ? "text-white/40" : "text-ink-faint"}`}>
                Твои слова сохранятся в нашей истории
              </p>
            </motion.div>
          )}

          <motion.button
            onClick={finish}
            disabled={needsAnswer && !answer.trim()}
            className="btn-primary"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: needsAnswer ? 3.4 : 4.5, duration: 1 }}
          >
            Продолжить
          </motion.button>
        </motion.div>
      )}
    </PageShell>
  );
}

function NightBackdrop() {
  return (
    <motion.div
      className="fixed inset-0 z-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 3 }}
      style={{
        background:
          "radial-gradient(ellipse at 50% 110%, #2a2338 0%, #14111f 55%, #0a0812 100%)",
      }}
      aria-hidden
    >
      {Array.from({ length: 90 }, (_, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${(i * 37.3) % 100}%`,
            top: `${(i * 53.7) % 100}%`,
            width: 1 + ((i * 7) % 3),
            height: 1 + ((i * 7) % 3),
            opacity: 0.7,
            animation: `twinkle ${2.5 + ((i * 13) % 40) / 10}s ease-in-out ${((i * 17) % 50) / 10}s infinite`,
          }}
        />
      ))}
    </motion.div>
  );
}
