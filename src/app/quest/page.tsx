"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiMapPin, FiExternalLink, FiHeart } from "react-icons/fi";
import { PageShell } from "@/components/ui/PageShell";
import { StepGate } from "@/components/StepGate";
import { AstanaMap } from "@/components/scenes/AstanaMap";
import { useJourney } from "@/lib/store";
import { journeySteps, stepIndex } from "@/lib/content";
import { fetchAstanaWeather, Weather, daysTogether, pluralDays } from "@/lib/weather";

/**
 * Карта путешествия: пройденный путь, текущая цель, погода.
 * Следующая точка открывается только после завершения предыдущей главы.
 */
export default function QuestPage() {
  return (
    <StepGate step="stop-baiterek">
      <QuestOverview />
    </StepGate>
  );
}

function QuestOverview() {
  const { content, progress } = useJourney();
  const [weather, setWeather] = useState<Weather | null>(null);

  useEffect(() => {
    fetchAstanaWeather().then(setWeather);
  }, []);

  const ordered = useMemo(
    () => [...content.stops].sort((a, b) => a.order - b.order),
    [content.stops]
  );

  // Сколько точек квеста уже пройдено
  const completedStops = ordered.filter(
    (s) => stepIndex(`stop-${s.id}` as (typeof journeySteps)[number]) < progress
  ).length;

  const allDone = completedStops >= ordered.length;
  const currentStop = allDone ? null : ordered[completedStops];
  const days = daysTogether(content.couple.startDate);

  return (
    <PageShell className="justify-start pt-24 pb-16">
      <div className="w-full max-w-4xl flex flex-col items-center">
        <p className="text-xs tracking-[0.35em] uppercase text-ink-faint mb-3">
          Наш маршрут
        </p>
        <h1 className="font-display text-4xl md:text-5xl mb-2 text-center">
          Путешествие по Астане
        </h1>
        <div className="flex items-center gap-4 text-sm text-ink-soft mb-8">
          <span className="flex items-center gap-1.5">
            <FiHeart className="text-blush" size={14} />
            {days} {pluralDays(days)} вместе
          </span>
          {weather && (
            <span>
              {weather.icon} {weather.temperature}° · {weather.description}
            </span>
          )}
        </div>

        <AstanaMap stops={ordered} completedStops={completedStops} />

        {/* Карточка текущей цели */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="glass rounded-3xl p-8 mt-8 w-full max-w-lg text-center"
        >
          {currentStop ? (
            <>
              <p className="text-xs tracking-[0.3em] uppercase text-ink-faint mb-3">
                Следующая точка · {completedStops + 1} из {ordered.length}
              </p>
              <h2 className="font-display text-3xl mb-4">{currentStop.name}</h2>
              <p className="font-display italic text-ink-soft leading-relaxed mb-8">
                {currentStop.hint}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {/* Официальный формат Maps URL: на телефоне открывает приложение
                    Google Maps, на компьютере — новую вкладку */}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${currentStop.lat}%2C${currentStop.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost justify-center"
                >
                  <FiExternalLink size={14} /> Открыть в Google Maps
                </a>
                <Link href={`/quest/${currentStop.id}`} className="btn-primary">
                  <FiMapPin size={14} /> Я на месте
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs tracking-[0.3em] uppercase text-ink-faint mb-3">
                Все точки пройдены
              </p>
              <h2 className="font-display text-3xl mb-4">Остался последний шаг</h2>
              <p className="font-display italic text-ink-soft leading-relaxed mb-8">
                Карта показывает ещё одно место. Самое важное.
              </p>
              <Link href="/final" className="btn-primary">
                Узнать, куда идти
              </Link>
            </>
          )}
        </motion.div>
      </div>
    </PageShell>
  );
}
