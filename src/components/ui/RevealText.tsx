"use client";

import { motion } from "framer-motion";

/**
 * Текст, проявляющийся слово за словом — медленно, как дыхание.
 */
export function RevealText({
  text,
  className = "",
  delay = 0,
  stagger = 0.14,
  as: Tag = "p",
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "p" | "h1" | "h2" | "h3";
}) {
  const words = text.split(/\s+/);
  const MotionTag = motion[Tag];

  return (
    <MotionTag
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block whitespace-pre"
          variants={{
            hidden: { opacity: 0, y: 14, filter: "blur(8px)" },
            visible: {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
            },
          }}
        >
          {word}
          {i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </MotionTag>
  );
}

/** Многострочный вариант: строки появляются одна за другой */
export function RevealLines({
  lines,
  className = "",
  lineClassName = "",
  delay = 0,
  lineDelay = 1.6,
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  lineDelay?: number;
}) {
  return (
    <div className={className}>
      {lines.map((line, i) => (
        <RevealText
          key={i}
          text={line}
          className={lineClassName}
          delay={delay + i * lineDelay}
        />
      ))}
    </div>
  );
}
