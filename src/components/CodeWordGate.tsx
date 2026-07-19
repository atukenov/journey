"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiKey } from "react-icons/fi";

/**
 * Ввод кодового слова на точке маршрута.
 * Слово спрятано в записке на месте — вводится без учёта регистра и «ё/е».
 */
export function CodeWordGate({
  codeWord,
  hint,
  placeName,
  onUnlock,
}: {
  codeWord: string;
  hint: string;
  placeName: string;
  onUnlock: () => void;
}) {
  const [value, setValue] = useState("");
  const [shake, setShake] = useState(0);

  const normalize = (s: string) =>
    s.trim().toLowerCase().replaceAll("ё", "е").replace(/\s+/g, " ");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (normalize(value) === normalize(codeWord)) {
      onUnlock();
    } else {
      setShake((n) => n + 1);
      setValue("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="glass rounded-3xl px-8 py-10 max-w-md w-full text-center"
    >
      <FiKey className="mx-auto mb-5 text-gold" size={26} />
      <p className="text-xs tracking-[0.3em] uppercase text-ink-faint mb-2">
        Точка маршрута
      </p>
      <h2 className="font-display text-3xl mb-4">{placeName}</h2>
      <p className="text-ink-soft text-sm leading-relaxed mb-8 italic">{hint}</p>
      <p className="text-sm text-ink-soft mb-4">
        Найди на месте записку с кодовым словом — и глава откроется.
      </p>
      <motion.form
        key={shake}
        animate={shake > 0 ? { x: [0, -10, 10, -6, 6, 0] } : {}}
        transition={{ duration: 0.45 }}
        onSubmit={submit}
        className="flex flex-col gap-4"
      >
        <input
          className="input-soft text-center tracking-widest"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="кодовое слово"
          autoComplete="off"
          autoCapitalize="off"
        />
        <button type="submit" className="btn-primary" disabled={!value.trim()}>
          Открыть главу
        </button>
      </motion.form>
    </motion.div>
  );
}
