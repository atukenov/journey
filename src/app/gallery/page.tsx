"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { PageShell } from "@/components/ui/PageShell";
import { useJourney } from "@/lib/store";

/**
 * Галерея воспоминаний: элегантная кладка, мягкий лайтбокс.
 */
export default function GalleryPage() {
  const { content } = useJourney();
  const [open, setOpen] = useState<number | null>(null);
  const photos = content.gallery;

  const step = (dir: 1 | -1) => {
    if (open === null) return;
    setOpen((open + dir + photos.length) % photos.length);
  };

  return (
    <PageShell className="justify-start pt-24 pb-16">
      <p className="text-xs tracking-[0.35em] uppercase text-ink-faint mb-3">
        Наши воспоминания
      </p>
      <h1 className="font-display text-4xl md:text-5xl mb-12">Галерея</h1>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 max-w-5xl w-full [column-fill:balance]">
        {photos.map((photo, i) => (
          <motion.button
            key={photo.src + i}
            onClick={() => setOpen(i)}
            className="relative block w-full mb-5 rounded-2xl overflow-hidden glass group text-left"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, delay: (i % 3) * 0.12, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4 }}
          >
            <Image
              src={photo.src}
              alt={photo.caption}
              width={600}
              height={i % 3 === 1 ? 800 : 450}
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <div
              className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: "linear-gradient(transparent, rgba(20,15,8,0.6))" }}
            >
              <p className="font-display italic text-white/90">{photo.caption}</p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Лайтбокс */}
      <AnimatePresence>
        {open !== null && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-6"
            style={{ background: "rgba(15, 12, 8, 0.9)", backdropFilter: "blur(12px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => setOpen(null)}
          >
            <button
              className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors"
              aria-label="Закрыть"
            >
              <FiX size={26} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); step(-1); }}
              className="absolute left-4 md:left-8 text-white/50 hover:text-white transition-colors"
              aria-label="Назад"
            >
              <FiChevronLeft size={32} />
            </button>
            <motion.figure
              key={open}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-4xl max-h-[80vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={photos[open].src}
                alt={photos[open].caption}
                width={1200}
                height={900}
                className="max-h-[70vh] w-auto rounded-2xl object-contain"
              />
              <figcaption className="font-display italic text-white/80 text-lg mt-5">
                {photos[open].caption}
              </figcaption>
            </motion.figure>
            <button
              onClick={(e) => { e.stopPropagation(); step(1); }}
              className="absolute right-4 md:right-8 text-white/50 hover:text-white transition-colors"
              aria-label="Вперёд"
            >
              <FiChevronRight size={32} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}
