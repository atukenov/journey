"use client";

import { motion } from "framer-motion";
import { QuestStop } from "@/lib/content";

/**
 * Авторская иллюстрированная карта Астаны.
 * Река Есиль, тихие кварталы, золотая нить маршрута.
 * Работает офлайн, живёт в обеих темах.
 */

export function catmullRomPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x} ${p2.y}`;
  }
  return d;
}

/** Тихие кварталы города — мягкие прямоугольники */
const BLOCKS = [
  { x: 120, y: 120, w: 90, h: 60, r: 14 },
  { x: 250, y: 90, w: 70, h: 90, r: 14 },
  { x: 150, y: 230, w: 110, h: 70, r: 16 },
  { x: 560, y: 120, w: 100, h: 70, r: 16 },
  { x: 700, y: 90, w: 80, h: 110, r: 16 },
  { x: 720, y: 260, w: 110, h: 70, r: 16 },
  { x: 600, y: 330, w: 80, h: 90, r: 14 },
  { x: 160, y: 480, w: 100, h: 80, r: 16 },
  { x: 300, y: 540, w: 130, h: 60, r: 16 },
  { x: 740, y: 440, w: 90, h: 90, r: 16 },
  { x: 520, y: 620, w: 110, h: 50, r: 14 },
];

export function AstanaMap({
  stops,
  completedStops,
  children,
}: {
  stops: QuestStop[];
  /** сколько точек уже пройдено */
  completedStops: number;
  /** дополнительный слой (дом в финале) */
  children?: React.ReactNode;
}) {
  const ordered = [...stops].sort((a, b) => a.order - b.order);
  const points = ordered.map((s) => ({ x: s.mapX, y: s.mapY }));
  const routeD = catmullRomPath(points);
  const totalSegments = Math.max(1, ordered.length - 1);
  const revealed = Math.min(1, Math.max(0.02, completedStops / totalSegments));

  return (
    <div className="relative w-full">
      <svg viewBox="0 0 1000 700" className="w-full" role="img" aria-label="Карта нашего маршрута по Астане">
        <defs>
          <linearGradient id="river" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--gold-soft)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--gold)" stopOpacity="0.35" />
          </linearGradient>
          <filter id="paper" x="-5%" y="-5%" width="110%" height="110%">
            <feGaussianBlur stdDeviation="0.4" />
          </filter>
        </defs>

        {/* полотно карты */}
        <rect x="20" y="20" width="960" height="660" rx="36" fill="var(--surface-strong)" stroke="var(--line)" />

        {/* река Есиль */}
        <motion.path
          d="M -10 260 C 150 300, 260 180, 400 170 C 540 160, 560 260, 700 300 C 830 337, 920 320, 1010 360"
          fill="none"
          stroke="url(#river)"
          strokeWidth="34"
          strokeLinecap="round"
          opacity="0.5"
          filter="url(#paper)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, ease: "easeOut" }}
        />

        {/* кварталы */}
        {BLOCKS.map((b, i) => (
          <motion.rect
            key={i}
            x={b.x}
            y={b.y}
            width={b.w}
            height={b.h}
            rx={b.r}
            fill="var(--gold-soft)"
            opacity="0.28"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0.28, scale: 1 }}
            transition={{ delay: 0.4 + i * 0.08, duration: 1 }}
            style={{ transformOrigin: `${b.x + b.w / 2}px ${b.y + b.h / 2}px` }}
          />
        ))}

        {/* пунктир всего пути — едва заметный */}
        <path
          d={routeD}
          fill="none"
          stroke="var(--ink-faint)"
          strokeWidth="1.5"
          strokeDasharray="2 9"
          opacity="0.35"
        />

        {/* пройденная часть — золотая нить */}
        <motion.path
          d={routeD}
          fill="none"
          stroke="var(--gold)"
          strokeWidth="3.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: revealed }}
          transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1], delay: 0.8 }}
          style={{ filter: "drop-shadow(0 0 6px var(--glow))" }}
        />

        {/* точки маршрута */}
        {ordered.map((stop, i) => {
          const done = i < completedStops;
          const current = i === completedStops;
          return (
            <motion.g
              key={stop.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + i * 0.15, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
              style={{ transformOrigin: `${stop.mapX}px ${stop.mapY}px` }}
            >
              {current && (
                <motion.circle
                  cx={stop.mapX}
                  cy={stop.mapY}
                  r="14"
                  fill="var(--gold)"
                  animate={{ opacity: [0.35, 0, 0.35], scale: [1, 2.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2.6, ease: "easeOut" }}
                  style={{ transformOrigin: `${stop.mapX}px ${stop.mapY}px` }}
                />
              )}
              <circle
                cx={stop.mapX}
                cy={stop.mapY}
                r="13"
                fill={done || current ? "var(--gold)" : "var(--surface-strong)"}
                stroke={done || current ? "var(--gold-deep)" : "var(--ink-faint)"}
                strokeWidth="1.5"
                opacity={done || current ? 1 : 0.6}
              />
              {done ? (
                <path
                  d={`M ${stop.mapX} ${stop.mapY + 4.5} C ${stop.mapX - 3.5} ${stop.mapY + 1}, ${stop.mapX - 5} ${stop.mapY - 1.5}, ${stop.mapX - 5} ${stop.mapY - 3} C ${stop.mapX - 5} ${stop.mapY - 5.5}, ${stop.mapX - 2} ${stop.mapY - 5.5}, ${stop.mapX} ${stop.mapY - 2.5} C ${stop.mapX + 2} ${stop.mapY - 5.5}, ${stop.mapX + 5} ${stop.mapY - 5.5}, ${stop.mapX + 5} ${stop.mapY - 3} C ${stop.mapX + 5} ${stop.mapY - 1.5}, ${stop.mapX + 3.5} ${stop.mapY + 1}, ${stop.mapX} ${stop.mapY + 4.5} Z`}
                  fill="var(--surface-strong)"
                />
              ) : (
                <text
                  x={stop.mapX}
                  y={stop.mapY + 4}
                  textAnchor="middle"
                  fontSize="12"
                  fontFamily="var(--font-body)"
                  fill={current ? "var(--surface-strong)" : "var(--ink-faint)"}
                >
                  {stop.order}
                </text>
              )}
              {/* название — только для открытых точек, тайна сохраняется */}
              {(done || current) && (
                <text
                  x={stop.mapX}
                  y={stop.mapY - 22}
                  textAnchor="middle"
                  fontSize="15"
                  fontFamily="var(--font-display)"
                  fontStyle="italic"
                  fill="var(--ink-soft)"
                >
                  {stop.name}
                </text>
              )}
            </motion.g>
          );
        })}

        {children}
      </svg>
    </div>
  );
}
