"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { FLOWER_COLORS, FlowerSVG, LeafSVG } from "./flowerArt";

declare global {
  interface Window {
    __introDone?: boolean;
  }
}

type Item = {
  kind: "flower" | "leaf";
  x: number;
  y: number;
  size: number;
  rot: number;
  petals: number;
  ci: number;
  g: string;
};

const GREENS = ["#2f4a3a", "#3d5c47", "#51704f", "#26402f", "#6b8a63"];
const rand = (a: number, b: number) => a + Math.random() * (b - a);

function build(W: number, H: number): Item[] {
  const items: Item[] = [];
  const step = 140;
  // follaje de fondo
  for (let x = -40; x < W + 60; x += step)
    for (let y = -40; y < H + 60; y += step)
      items.push({ kind: "leaf", x: x + rand(-40, 40), y: y + rand(-40, 40), size: rand(140, 260), rot: rand(0, 360), petals: 0, ci: 0, g: GREENS[Math.floor(rand(0, GREENS.length))] });
  // flores
  for (let x = -60; x < W + 80; x += step)
    for (let y = -60; y < H + 80; y += step)
      items.push({ kind: "flower", x: x + rand(-50, 50), y: y + rand(-50, 50), size: rand(150, 270), rot: rand(0, 360), petals: Math.floor(rand(5, 10)), ci: Math.floor(rand(0, FLOWER_COLORS.length)), g: "" });
  return items.sort(() => Math.random() - 0.5).sort((a, b) => (a.kind === b.kind ? 0 : a.kind === "leaf" ? -1 : 1));
}

export default function FlowerIntro() {
  const root = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<Item[] | null>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.__introDone = true;
      const id = setTimeout(() => setGone(true), 0);
      return () => clearTimeout(id);
    }
    document.body.style.overflow = "hidden";
    // eslint-disable-next-line react-hooks/set-state-in-effect -- las posiciones aleatorias solo pueden calcularse en el cliente
    setItems(build(window.innerWidth, window.innerHeight));
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!items || !root.current) return;
    const W = window.innerWidth;
    const els = gsap.utils.toArray<HTMLElement>(".fi-item", root.current);
    const cover = root.current.querySelector(".fi-cover");
    const streaks = gsap.utils.toArray<HTMLElement>(".fi-streak", root.current);
    gsap.set(els, { rotation: (i) => items[i].rot, transformOrigin: "50% 50%" });
    // la ráfaga barre de izquierda a derecha; las hojas, más ligeras, salen antes
    const delays = items.map((it) => (it.x / W) * 0.85 + Math.random() * 0.2 + (it.kind === "leaf" ? 0 : 0.12));
    const H = window.innerHeight;

    const tl = gsap.timeline({
      onComplete: () => {
        window.__introDone = true;
        document.body.style.overflow = "";
        setGone(true);
        import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => ScrollTrigger.refresh());
      },
    });
    const durs = items.map(() => rand(1.4, 2.1));
    // brisa: un leve temblor, y justo antes de la ráfaga se inclinan a contraviento
    tl.to(els, { x: "+=4", rotation: "+=4", duration: 0.3, ease: "sine.inOut", yoyo: true, repeat: 3, stagger: { each: 0.002, from: "random" } }, 0.15)
      .to(els, { x: "-=14", rotation: "-=10", duration: 0.45, ease: "sine.inOut", stagger: { each: 0.0015, from: "start" } }, 1.05)
      .addLabel("gust", 1.5)
      // x acelera con el viento; y sube y luego cae (eases distintos → trayectorias curvas)
      .to(els, { x: () => W * 1.25 + rand(0, 450), ease: "power3.in", duration: (i) => durs[i], delay: (i) => delays[i] }, "gust")
      .to(els, { y: () => -rand(60, 0.45 * H), ease: "sine.out", duration: (i) => durs[i] * 0.55, delay: (i) => delays[i] }, "gust")
      .to(els, { rotation: () => "+=" + rand(260, 720), scale: () => rand(0.55, 1.1), ease: "power2.in", duration: (i) => durs[i], delay: (i) => delays[i] }, "gust")
      .to(streaks, { xPercent: 380, opacity: 0.9, duration: 0.9, ease: "power2.in", stagger: 0.07 }, "gust")
      .to(streaks, { opacity: 0, duration: 0.3 }, "gust+=0.9")
      .to(cover, { opacity: 0, duration: 1.1, ease: "power1.inOut" }, "gust+=0.5");
    return () => {
      tl.kill();
    };
  }, [items]);

  if (gone) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[100] overflow-hidden" aria-hidden>
      <div className="fi-cover absolute inset-0 bg-[#233a2c]" />
      {items?.map((it, i) => (
        <div key={i} className="fi-item pointer-events-none absolute will-change-transform" style={{ left: it.x - it.size / 2, top: it.y - it.size / 2, width: it.size, height: it.size }}>
          {it.kind === "flower" ? (
            <FlowerSVG petals={it.petals} c1={FLOWER_COLORS[it.ci][0]} c2={FLOWER_COLORS[it.ci][1]} className="h-full w-full" />
          ) : (
            <LeafSVG fill={it.g} className="h-full w-full" />
          )}
        </div>
      ))}
      {items &&
        Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="fi-streak absolute h-px w-[30vw] bg-white/70 opacity-0" style={{ top: `${8 + i * 12}%`, left: "-35vw" }} />
        ))}
    </div>
  );
}
