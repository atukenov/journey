"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Content,
  defaultContent,
  JourneyStep,
  journeySteps,
  stepIndex,
} from "./content";

const CONTENT_KEY = "our-journey:content";
const PROGRESS_KEY = "our-journey:progress";
const ANSWERS_KEY = "our-journey:answers";
const CHECKS_KEY = "our-journey:checks";
const THEME_KEY = "our-journey:theme";
const MUSIC_KEY = "our-journey:music";

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* приватный режим — молча продолжаем */
  }
}

export interface Answers {
  [stopId: string]: string;
}

interface JourneyState {
  content: Content;
  updateContent: (patch: Partial<Content>) => void;
  resetContent: () => void;
  /** индекс самого дальнего открытого шага */
  progress: number;
  /** отметить шаг пройденным (открывает следующий) */
  completeStep: (step: JourneyStep) => void;
  isUnlocked: (step: JourneyStep) => boolean;
  resetProgress: () => void;
  answers: Answers;
  saveAnswer: (stopId: string, text: string) => void;
  checks: Record<string, boolean>;
  toggleCheck: (id: string) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
  /** музыка включена (звук стартует при первом касании — ограничение браузеров) */
  musicEnabled: boolean;
  setMusicEnabled: (on: boolean) => void;
  hydrated: boolean;
}

const JourneyContext = createContext<JourneyState | null>(null);

export function JourneyProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<Content>(defaultContent);
  const [progress, setProgress] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [musicEnabled, setMusicEnabledState] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setContent(readJSON(CONTENT_KEY, defaultContent));
    setAnswers(readJSON(ANSWERS_KEY, {}));
    setChecks(readJSON(CHECKS_KEY, {}));
    const savedProgress = Number(window.localStorage.getItem(PROGRESS_KEY) ?? 0);
    setProgress(Number.isFinite(savedProgress) ? savedProgress : 0);
    setMusicEnabledState(window.localStorage.getItem(MUSIC_KEY) !== "off");
    const savedTheme = window.localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(savedTheme === "dark" || (!savedTheme && prefersDark) ? "dark" : "light");
    setHydrated(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    if (hydrated) window.localStorage.setItem(THEME_KEY, theme);
  }, [theme, hydrated]);

  const updateContent = useCallback((patch: Partial<Content>) => {
    setContent((prev) => {
      const next = { ...prev, ...patch };
      writeJSON(CONTENT_KEY, next);
      return next;
    });
  }, []);

  const resetContent = useCallback(() => {
    window.localStorage.removeItem(CONTENT_KEY);
    setContent(defaultContent);
  }, []);

  const completeStep = useCallback((step: JourneyStep) => {
    setProgress((prev) => {
      const next = Math.max(prev, stepIndex(step) + 1);
      window.localStorage.setItem(PROGRESS_KEY, String(next));
      return next;
    });
  }, []);

  const isUnlocked = useCallback(
    (step: JourneyStep) => stepIndex(step) <= progress,
    [progress]
  );

  const resetProgress = useCallback(() => {
    // Сброс начинает историю заново — прошлые ответы тоже стираются
    window.localStorage.removeItem(PROGRESS_KEY);
    window.localStorage.removeItem(ANSWERS_KEY);
    setProgress(0);
    setAnswers({});
  }, []);

  const saveAnswer = useCallback((stopId: string, text: string) => {
    setAnswers((prev) => {
      const next = { ...prev, [stopId]: text };
      writeJSON(ANSWERS_KEY, next);
      return next;
    });
  }, []);

  const toggleCheck = useCallback((id: string) => {
    setChecks((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      writeJSON(CHECKS_KEY, next);
      return next;
    });
  }, []);

  const toggleTheme = useCallback(
    () => setTheme((t) => (t === "light" ? "dark" : "light")),
    []
  );

  const setMusicEnabled = useCallback((on: boolean) => {
    setMusicEnabledState(on);
    window.localStorage.setItem(MUSIC_KEY, on ? "on" : "off");
  }, []);

  const value = useMemo(
    () => ({
      content,
      updateContent,
      resetContent,
      progress,
      completeStep,
      isUnlocked,
      resetProgress,
      answers,
      saveAnswer,
      checks,
      toggleCheck,
      theme,
      toggleTheme,
      musicEnabled,
      setMusicEnabled,
      hydrated,
    }),
    [
      content,
      updateContent,
      resetContent,
      progress,
      completeStep,
      isUnlocked,
      resetProgress,
      answers,
      saveAnswer,
      checks,
      toggleCheck,
      theme,
      toggleTheme,
      musicEnabled,
      setMusicEnabled,
      hydrated,
    ]
  );

  return <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>;
}

export function useJourney(): JourneyState {
  const ctx = useContext(JourneyContext);
  if (!ctx) throw new Error("useJourney должен использоваться внутри JourneyProvider");
  return ctx;
}

export { journeySteps };
