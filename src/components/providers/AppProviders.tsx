"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { JourneyProvider, useJourney } from "@/lib/store";
import { piano } from "@/lib/audio";
import { ControlDock } from "@/components/ui/ControlDock";
import { FloatingMessages } from "@/components/FloatingMessages";

/** Запускает пианино при первом же касании экрана (раньше браузер звук не отдаст) */
function MusicAutostart() {
  const { musicEnabled, hydrated } = useJourney();

  useEffect(() => {
    if (!hydrated || !musicEnabled || !piano || piano.isPlaying) return;
    const start = () => {
      piano?.start();
    };
    // Вдруг контекст уже разрешён (повторный визит) — пробуем сразу
    start();
    window.addEventListener("pointerdown", start, { once: true });
    window.addEventListener("keydown", start, { once: true });
    return () => {
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
    };
  }, [hydrated, musicEnabled]);

  return null;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Музыка мягко «приседает» при смене главы
  useEffect(() => {
    piano?.duck();
  }, [pathname]);

  // Офлайн-поддержка: регистрируем сервис-воркер
  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  const isAdmin = pathname.startsWith("/admin");
  const isProposal = pathname.startsWith("/proposal");

  return (
    <JourneyProvider>
      <MusicAutostart />
      <div className="ambient" aria-hidden />
      {!isAdmin && <ControlDock />}
      {!isAdmin && !isProposal && <FloatingMessages />}
      <AnimatePresence mode="wait">
        <div key={pathname} className="relative z-10 flex-1 flex flex-col">
          {children}
        </div>
      </AnimatePresence>
    </JourneyProvider>
  );
}
