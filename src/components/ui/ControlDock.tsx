"use client";

import { motion } from "framer-motion";
import { FiMoon, FiSun, FiMusic } from "react-icons/fi";
import { useJourney } from "@/lib/store";
import { piano } from "@/lib/audio";

/**
 * Тихая панель управления в углу: тема и музыка.
 * Не отвлекает, но всегда под рукой.
 */
export function ControlDock() {
  const { theme, toggleTheme, musicEnabled, setMusicEnabled, hydrated } = useJourney();
  const musicOn = musicEnabled;

  const toggleMusic = async () => {
    if (!piano) return;
    if (musicOn) {
      piano.stop();
      setMusicEnabled(false);
    } else {
      setMusicEnabled(true);
      await piano.start();
    }
  };

  if (!hydrated) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.4, duration: 1 }}
      className="fixed top-5 right-5 z-50 flex items-center gap-2"
    >
      <button
        onClick={toggleMusic}
        aria-label={musicOn ? "Выключить музыку" : "Включить музыку"}
        className={`glass rounded-full p-3 transition-colors duration-300 ${
          musicOn ? "text-gold" : "text-ink-faint hover:text-ink-soft"
        }`}
      >
        <motion.span
          animate={musicOn ? { rotate: [0, -8, 8, 0] } : {}}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="block"
        >
          <FiMusic size={16} />
        </motion.span>
      </button>
      <button
        onClick={toggleTheme}
        aria-label="Переключить тему"
        className="glass rounded-full p-3 text-ink-faint hover:text-ink-soft transition-colors duration-300"
      >
        {theme === "light" ? <FiMoon size={16} /> : <FiSun size={16} />}
      </button>
    </motion.div>
  );
}
