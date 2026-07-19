"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiLock } from "react-icons/fi";
import { useJourney } from "@/lib/store";
import { JourneyStep, journeySteps, stepRoutes } from "@/lib/content";

/**
 * Защита маршрута: глава доступна только после прохождения предыдущих.
 * Если рано — мягкий экран с приглашением вернуться на свой шаг.
 */
export function StepGate({
  step,
  children,
}: {
  step: JourneyStep;
  children: React.ReactNode;
}) {
  const { isUnlocked, progress, hydrated } = useJourney();

  if (!hydrated) {
    return <div className="flex-1" />;
  }

  if (isUnlocked(step)) return <>{children}</>;

  const currentStep = journeySteps[Math.min(progress, journeySteps.length - 1)];

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="glass rounded-3xl px-10 py-12 max-w-md"
      >
        <FiLock className="mx-auto mb-6 text-gold" size={28} />
        <h2 className="font-display text-2xl mb-3">Эта глава ещё впереди</h2>
        <p className="text-ink-soft text-sm leading-relaxed mb-8">
          Каждая история раскрывается в свой черёд. Вернись туда, где мы
          остановились.
        </p>
        <Link href={stepRoutes[currentStep]} className="btn-primary">
          Вернуться
        </Link>
      </motion.div>
    </main>
  );
}
