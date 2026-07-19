"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiHeart, FiCamera, FiMapPin, FiFeather } from "react-icons/fi";
import { PageShell } from "@/components/ui/PageShell";
import { useJourney } from "@/lib/store";
import { daysTogether, pluralDays } from "@/lib/weather";
import { journeySteps, stepIndex } from "@/lib/content";

/**
 * Наша статистика: дни вместе, обратный отсчёт,
 * лента воспоминаний и слова, оставленные на маршруте.
 */
export default function MemoriesPage() {
  const { content, answers, progress, hydrated } = useJourney();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const days = daysTogether(content.couple.startDate);
  const target = new Date(content.couple.proposalDateTime).getTime();
  const diff = Math.max(0, target - now);
  const countdown = {
    d: Math.floor(diff / 86_400_000),
    h: Math.floor((diff / 3_600_000) % 24),
    m: Math.floor((diff / 60_000) % 60),
    s: Math.floor((diff / 1000) % 60),
  };

  const ordered = useMemo(
    () => [...content.stops].sort((a, b) => a.order - b.order),
    [content.stops]
  );
  const completedStops = ordered.filter(
    (s) => stepIndex(`stop-${s.id}` as (typeof journeySteps)[number]) < progress
  ).length;

  const stats = [
    { icon: FiHeart, value: `${days}`, label: `${pluralDays(days)} вместе` },
    { icon: FiCamera, value: `${content.gallery.length}`, label: "общих фото" },
    { icon: FiMapPin, value: `${completedStops} / ${ordered.length}`, label: "точек пройдено" },
    { icon: FiFeather, value: `${Object.keys(answers).length}`, label: "слов сохранено" },
  ];

  if (!hydrated) return <div className="flex-1" />;

  return (
    <PageShell className="justify-start pt-24 pb-16">
      <p className="text-xs tracking-[0.35em] uppercase text-ink-faint mb-3">
        Наша история в цифрах
      </p>
      <h1 className="font-display text-4xl md:text-5xl mb-12">Воспоминания</h1>

      {/* Обратный отсчёт */}
      {diff > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="glass rounded-3xl px-10 py-8 mb-10 text-center"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-ink-faint mb-4">
            До особенного вечера
          </p>
          <div className="flex gap-6 justify-center font-display text-4xl md:text-5xl">
            {[
              [countdown.d, "дней"],
              [countdown.h, "часов"],
              [countdown.m, "минут"],
              [countdown.s, "секунд"],
            ].map(([v, l]) => (
              <div key={l} className="flex flex-col items-center">
                <span className="tabular-nums">{String(v).padStart(2, "0")}</span>
                <span className="text-xs font-sans tracking-widest uppercase text-ink-faint mt-2">
                  {l}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Статистика любви */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl mb-14">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.12, duration: 0.9 }}
            className="glass rounded-2xl p-6 text-center"
          >
            <s.icon className="mx-auto mb-3 text-gold" size={20} />
            <p className="font-display text-3xl mb-1">{s.value}</p>
            <p className="text-xs text-ink-faint tracking-wide">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Лента маршрута и сохранённые слова */}
      <div className="w-full max-w-2xl">
        <h2 className="font-display text-2xl mb-8 text-center">Лента нашего дня</h2>
        <div className="relative pl-8">
          <div className="absolute left-[9px] top-2 bottom-2 w-px bg-line" />
          {ordered.map((stop, i) => {
            const done = i < completedStops;
            const answer = answers[stop.id];
            return (
              <motion.div
                key={stop.id}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.08 }}
                className="relative mb-8"
              >
                <span
                  className={`absolute -left-8 top-1 h-[19px] w-[19px] rounded-full border-2 ${
                    done ? "bg-gold border-gold-deep" : "bg-surface-strong border-line"
                  }`}
                />
                <p className="text-xs tracking-[0.25em] uppercase text-ink-faint mb-1">
                  {done ? stop.chapterTitle : "Ещё впереди"}
                </p>
                <h3 className="font-display text-xl mb-1">{done ? stop.name : "· · ·"}</h3>
                {done && answer && (
                  <blockquote className="glass rounded-2xl px-5 py-4 mt-3 font-display italic text-ink-soft leading-relaxed">
                    «{answer}»
                  </blockquote>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <Link href="/gallery" className="btn-ghost mt-6">
        Открыть галерею
      </Link>
    </PageShell>
  );
}
