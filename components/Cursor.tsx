"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const PETALS = 16;

/**
 * Cursor personalizado con forma de margarita.
 * Gira despacio en reposo y más rápido al moverse; se abre sobre enlaces y botones,
 * crece con un «Ver» sobre las fotos, se cierra al hacer clic y se aparta en los campos de texto.
 */
export default function Cursor() {
  const root = useRef<HTMLDivElement>(null);
  const flower = useRef<HTMLDivElement>(null);
  const petals = useRef<SVGGElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches || (navigator.maxTouchPoints > 0 && window.innerWidth < 1024)) return;
    document.documentElement.classList.add("has-cursor");

    gsap.set(root.current, { xPercent: -50, yPercent: -50, opacity: 0 });
    gsap.set(petals.current, { transformOrigin: "50% 50%" });
    const xTo = gsap.quickTo(root.current, "x", { duration: 0.12, ease: "power3" });
    const yTo = gsap.quickTo(root.current, "y", { duration: 0.12, ease: "power3" });

    // giro continuo; su velocidad sube con el movimiento del ratón
    const spin = gsap.to(petals.current, { rotation: 360, duration: 16, ease: "none", repeat: -1 });
    let speed = 0;
    let lx = 0, ly = 0;
    const settle = () => {
      speed *= 0.9;
      spin.timeScale(1 + Math.min(speed, 40) * 0.6);
    };
    gsap.ticker.add(settle);

    type State = "idle" | "link" | "view" | "text";
    let state: State = "idle";
    let pressed = false;
    const apply = () => {
      const scale = { idle: 1, link: 1.45, view: 3.2, text: 0.45 }[state] * (pressed ? 0.75 : 1);
      // sobre enlaces se vuelve translúcida para que se lea el texto de debajo
      const opacity = { idle: 1, link: 0.7, view: 0.95, text: 0 }[state];
      gsap.to(flower.current, { scale, opacity, duration: 0.5, ease: "back.out(2)", overwrite: "auto" });
      gsap.to(label.current, { opacity: state === "view" ? 1 : 0, scale: state === "view" ? 1 : 0.6, duration: 0.3, overwrite: "auto" });
    };

    const move = (e: MouseEvent) => {
      gsap.to(root.current, { opacity: 1, duration: 0.3, overwrite: "auto" });
      speed += Math.hypot(e.clientX - lx, e.clientY - ly) * 0.08;
      lx = e.clientX;
      ly = e.clientY;
      xTo(e.clientX);
      yTo(e.clientY);
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const next: State = t.closest("input:not([type=checkbox]):not([type=radio]), textarea")
        ? "text"
        : t.closest("[data-cursor='view']")
          ? "view"
          : t.closest("a, button, select, label, [data-magnetic]")
            ? "link"
            : "idle";
      if (next !== state) {
        state = next;
        apply();
        if (state === "link") gsap.fromTo(petals.current, { scale: 0.8 }, { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.4)" });
      }
    };
    const down = () => { pressed = true; apply(); };
    const up = () => { pressed = false; apply(); };
    const leave = () => gsap.to(root.current, { opacity: 0, duration: 0.3 });

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      gsap.ticker.remove(settle);
      spin.kill();
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <div ref={root} className="cursor-el pointer-events-none fixed left-0 top-0 z-[200] flex h-8 w-8 items-center justify-center" aria-hidden>
      <div ref={flower} className="h-full w-full drop-shadow-[0_1px_2px_rgba(43,38,31,0.45)]">
        <svg viewBox="-50 -50 100 100" className="h-full w-full overflow-visible">
          <defs>
            <radialGradient id="margarita-centro" cx="40%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#ffe27a" />
              <stop offset="60%" stopColor="#f2b632" />
              <stop offset="100%" stopColor="#c98a1c" />
            </radialGradient>
            <linearGradient id="margarita-petalo" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#efe6d6" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
          </defs>
          <g ref={petals}>
            {Array.from({ length: PETALS }, (_, i) => (
              <ellipse
                key={i}
                cx="0"
                cy="-27"
                rx="6.5"
                ry="19"
                fill="url(#margarita-petalo)"
                stroke="rgba(122,102,80,0.35)"
                strokeWidth="0.8"
                transform={`rotate(${(360 / PETALS) * i + (i % 2) * 4})`}
              />
            ))}
          </g>
          <circle r="13" fill="url(#margarita-centro)" stroke="#b07a1a" strokeWidth="0.8" />
          {Array.from({ length: 9 }, (_, i) => {
            const a = i * 2.4;
            const r = 2.2 * Math.sqrt(i + 1);
            return <circle key={i} cx={Math.cos(a) * r} cy={Math.sin(a) * r} r="1.1" fill="#b8791a" opacity="0.6" />;
          })}
        </svg>
      </div>
      <span ref={label} className="eyebrow absolute rounded-full bg-ivory/90 px-2 py-0.5 text-[0.6rem] text-ink opacity-0">Ver</span>
    </div>
  );
}
