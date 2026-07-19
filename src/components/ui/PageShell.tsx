"use client";

import { motion } from "framer-motion";

/**
 * Обёртка страницы: мягкое кинематографичное появление.
 * Контент всплывает с лёгким подъёмом и блюром — как титры фильма.
 */
export function PageShell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={`relative flex-1 flex flex-col items-center px-6 ${className}`}
    >
      {children}
    </motion.main>
  );
}
