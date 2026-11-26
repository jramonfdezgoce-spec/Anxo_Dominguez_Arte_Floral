"use client";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Parallax declarativo vía atributos data-*:
 *  data-speed="0.3"   → el elemento se desplaza en Y (±speed·140px) durante su sección
 *  data-x="20"        → desplazamiento horizontal en % (palabras gigantes de fondo)
 *  data-rot="40"      → giro suave (grados)
 *  data-pimg          → imagen dentro de un contenedor overflow-hidden (zoom + deriva)
 */
export default function ParallaxEffects() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add({ motion: "(prefers-reduced-motion: no-preference)", mobile: "(max-width: 767px)" }, (c) => {
        if (!c.conditions?.motion) return;
        // en móvil todo va en una columna: desfases pequeños para que nada se solape
        const k = c.conditions?.mobile ? 0.15 : 1;
        const st = (el: Element, trig?: Element | null) => ({
          trigger: trig ?? el.closest("section") ?? el,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
        });
        gsap.utils.toArray<HTMLElement>("[data-speed]").forEach((el) => {
          const s = parseFloat(el.dataset.speed!);
          gsap.fromTo(el, { y: -s * 140 * k }, { y: s * 140 * k, ease: "none", scrollTrigger: st(el) });
        });
        gsap.utils.toArray<HTMLElement>("[data-x]").forEach((el) => {
          const x = parseFloat(el.dataset.x!);
          gsap.fromTo(el, { xPercent: -x }, { xPercent: x, ease: "none", scrollTrigger: st(el) });
        });
        gsap.utils.toArray<HTMLElement>("[data-rot]").forEach((el) => {
          const r = parseFloat(el.dataset.rot!);
          gsap.fromTo(el, { rotation: -r }, { rotation: r, ease: "none", scrollTrigger: st(el) });
        });
        gsap.utils.toArray<HTMLElement>("[data-pimg]").forEach((el) => {
          gsap.fromTo(el, { yPercent: -9, scale: 1.2 }, { yPercent: 9, scale: 1.2, ease: "none", scrollTrigger: st(el, el.parentElement) });
        });
        // entrada escalonada de los títulos
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          gsap.from(el, { y: 60, opacity: 0, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } });
        });
      });
    });
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);
    return () => {
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, []);
  return null;
}
