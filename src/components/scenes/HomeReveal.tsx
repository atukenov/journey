"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { QuestStop } from "@/lib/content";
import { AstanaMap, catmullRomPath } from "./AstanaMap";

/**
 * Финал карты: золотая нить тянется дальше всех точек
 * и приводит к маленькому дому. Дым из трубы, свет в окнах, звёзды.
 */

export const HOME_POINT = { x: 810, y: 300 };

export function HomeRevealScene({
  stops,
  onRevealed,
}: {
  stops: QuestStop[];
  onRevealed?: () => void;
}) {
  const routeRef = useRef<SVGPathElement>(null);
  const houseRef = useRef<SVGGElement>(null);
  const windowsRef = useRef<SVGGElement>(null);
  const smokeRef = useRef<SVGGElement>(null);
  const starsRef = useRef<SVGGElement>(null);
  const revealedCb = useRef(onRevealed);
  revealedCb.current = onRevealed;

  const ordered = [...stops].sort((a, b) => a.order - b.order);
  const last = ordered[ordered.length - 1];
  const extensionD = catmullRomPath([
    { x: last?.mapX ?? 620, y: last?.mapY ?? 540 },
    { x: 730, y: 470 },
    { x: 790, y: 380 },
    HOME_POINT,
  ]);

  useEffect(() => {
    const route = routeRef.current;
    if (!route) return;
    const length = route.getTotalLength();
    gsap.set(route, { strokeDasharray: length, strokeDashoffset: length });
    gsap.set(houseRef.current, { scale: 0, transformOrigin: "50% 100%" });
    gsap.set(windowsRef.current, { opacity: 0 });
    gsap.set(smokeRef.current, { opacity: 0 });
    gsap.set(starsRef.current, { opacity: 0 });

    const tl = gsap.timeline({ delay: 2.2 });
    tl.to(route, { strokeDashoffset: 0, duration: 3.4, ease: "power2.inOut" })
      .to(houseRef.current, { scale: 1, duration: 1.4, ease: "elastic.out(1, 0.55)" }, "-=0.4")
      .to(windowsRef.current, { opacity: 1, duration: 1.6, ease: "sine.inOut" }, "+=0.3")
      .to(smokeRef.current, { opacity: 1, duration: 1.2 }, "-=0.8")
      .to(starsRef.current, { opacity: 1, duration: 2, ease: "sine.inOut" }, "-=0.5")
      .call(() => revealedCb.current?.());

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <AstanaMap stops={ordered} completedStops={ordered.length}>
      {/* продолжение маршрута — к дому */}
      <path
        ref={routeRef}
        d={extensionD}
        fill="none"
        stroke="var(--gold)"
        strokeWidth="3.5"
        strokeLinecap="round"
        style={{ filter: "drop-shadow(0 0 6px var(--glow))" }}
      />

      {/* звёзды над домом */}
      <g ref={starsRef}>
        {[
          [762, 212, 2.2], [800, 190, 1.6], [845, 215, 2.4],
          [875, 245, 1.5], [742, 245, 1.7], [822, 168, 1.4],
        ].map(([x, y, r], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={r}
            fill="var(--gold)"
            style={{ animation: `twinkle ${2 + i * 0.5}s ease-in-out ${i * 0.3}s infinite` }}
          />
        ))}
      </g>

      {/* дом */}
      <g ref={houseRef}>
        {/* тёплый ореол */}
        <circle cx={HOME_POINT.x} cy={HOME_POINT.y - 14} r="52" fill="var(--gold)" opacity="0.12" style={{ filter: "blur(10px)" }} />
        {/* труба */}
        <rect x={HOME_POINT.x + 10} y={HOME_POINT.y - 44} width="8" height="16" rx="2" fill="var(--gold-deep)" />
        {/* крыша */}
        <path
          d={`M ${HOME_POINT.x - 32} ${HOME_POINT.y - 26} L ${HOME_POINT.x} ${HOME_POINT.y - 52} L ${HOME_POINT.x + 32} ${HOME_POINT.y - 26} Z`}
          fill="var(--gold-deep)"
        />
        {/* стены */}
        <rect x={HOME_POINT.x - 26} y={HOME_POINT.y - 26} width="52" height="34" rx="4" fill="var(--surface-strong)" stroke="var(--gold-deep)" strokeWidth="1.5" />
        {/* окна и дверь */}
        <g ref={windowsRef}>
          <rect x={HOME_POINT.x - 18} y={HOME_POINT.y - 18} width="12" height="11" rx="2" fill="#ffd98a" style={{ filter: "drop-shadow(0 0 6px rgba(255, 200, 110, 0.9))" }} />
          <rect x={HOME_POINT.x + 6} y={HOME_POINT.y - 18} width="12" height="11" rx="2" fill="#ffd98a" style={{ filter: "drop-shadow(0 0 6px rgba(255, 200, 110, 0.9))" }} />
        </g>
        <rect x={HOME_POINT.x - 5} y={HOME_POINT.y - 4} width="10" height="12" rx="2" fill="var(--gold-deep)" />
        {/* сердце над домом */}
        <path
          d={`M ${HOME_POINT.x} ${HOME_POINT.y - 62} c -2.5 -3, -6.5 -5, -6.5 -8.5 c 0 -2.8, 2.2 -4, 4 -4 c 1.3 0, 2.1 1.2, 2.5 2.2 c 0.4 -1, 1.2 -2.2, 2.5 -2.2 c 1.8 0, 4 1.2, 4 4 c 0 3.5, -4 5.5, -6.5 8.5 Z`}
          fill="var(--blush)"
          transform={`translate(0 -6)`}
        />
      </g>

      {/* дым из трубы */}
      <g ref={smokeRef}>
        {[0, 1.6, 3.2].map((delay, i) => (
          <circle
            key={i}
            cx={HOME_POINT.x + 14}
            cy={HOME_POINT.y - 48}
            r={4 + i}
            fill="var(--ink-faint)"
            opacity="0"
            style={{ animation: `smoke-rise 5s ease-out ${delay}s infinite` }}
          />
        ))}
      </g>

      {/* подпись */}
      <text
        x={HOME_POINT.x}
        y={HOME_POINT.y + 34}
        textAnchor="middle"
        fontSize="17"
        fontFamily="var(--font-display)"
        fontStyle="italic"
        fill="var(--gold-deep)"
      >
        Дом
      </text>
    </AstanaMap>
  );
}
