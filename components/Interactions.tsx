"use client";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Divide el texto en palabras con máscara (overflow hidden) conservando <em> y otros hijos. */
function splitWords(el: HTMLElement) {
  const inners: HTMLElement[] = [];
  const walk = (node: Node) => {
    Array.from(node.childNodes).forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        (n.textContent ?? "").split(/(\s+)/).forEach((w) => {
          if (!w) return;
          if (/^\s+$/.test(w)) return frag.appendChild(document.createTextNode(" "));
          const mask = document.createElement("span");
          mask.style.cssText = "display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.12em;margin-bottom:-.12em";
          const inner = document.createElement("span");
          inner.style.display = "inline-block";
          inner.textContent = w;
          mask.appendChild(inner);
          inners.push(inner);
          frag.appendChild(mask);
        });
        n.parentNode!.replaceChild(frag, n);
      } else if (n.nodeType === 1) walk(n);
    });
  };
  walk(el);
  return inners;
}

export default function Interactions() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Text reveal con máscaras
        gsap.utils.toArray<HTMLElement>("[data-mask]").forEach((el) => {
          const words = splitWords(el);
          gsap.from(words, {
            yPercent: 115, rotate: 4, duration: 1.1, ease: "power4.out", stagger: 0.07,
            scrollTrigger: { trigger: el, start: "top 85%" },
          });
        });
      });

      // Botones magnéticos + brillo de cristal que sigue al cursor
      mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const cleanups: (() => void)[] = [];
        gsap.utils.toArray<HTMLElement>("[data-magnetic]").forEach((el) => {
          const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.5)" });
          const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.5)" });
          const move = (e: MouseEvent) => {
            const r = el.getBoundingClientRect();
            xTo((e.clientX - (r.left + r.width / 2)) * 0.35);
            yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
            el.style.setProperty("--mx", `${e.clientX - r.left}px`);
            el.style.setProperty("--my", `${e.clientY - r.top}px`);
          };
          const leave = () => { xTo(0); yTo(0); };
          el.addEventListener("mousemove", move);
          el.addEventListener("mouseleave", leave);
          cleanups.push(() => { el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", leave); });
        });
        return () => cleanups.forEach((c) => c());
      });

      // Scroll horizontal fluido
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const sec = document.querySelector<HTMLElement>("#colecciones");
        const track = sec?.querySelector<HTMLElement>(".h-track");
        if (!sec || !track) return;
        const dist = () => track.scrollWidth - window.innerWidth;
        const tween = gsap.to(track, {
          x: () => -dist(), ease: "none",
          scrollTrigger: { trigger: sec, pin: true, scrub: 1, start: "top top", end: () => "+=" + dist(), invalidateOnRefresh: true },
        });
        gsap.utils.toArray<HTMLElement>(".h-img", sec).forEach((img) => {
          gsap.fromTo(img, { xPercent: -12 }, { xPercent: 12, ease: "none", scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
        });
        gsap.to(".h-bar", { scaleX: 1, ease: "none", scrollTrigger: { trigger: sec, scrub: true, start: "top top", end: () => "+=" + dist() } });
      });

      // Imagen que se expande a pantalla completa
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const sec = document.querySelector<HTMLElement>("#expansion");
        if (!sec) return;
        const tl = gsap.timeline({ scrollTrigger: { trigger: sec, pin: true, scrub: 1, start: "top top", end: "+=140%" } });
        const start = window.innerWidth < 768 ? "inset(42% 8% 8% 8% round 20px)" : "inset(40% 30% 8% 30% round 28px)";
        tl.fromTo(".ex-frame", { clipPath: start }, { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "power2.inOut", duration: 1 }, 0)
          .fromTo(".ex-img", { scale: 1.5 }, { scale: 1, ease: "power2.inOut", duration: 1 }, 0)
          .fromTo(".ex-text", { opacity: 0, yPercent: 40 }, { opacity: 1, yPercent: 0, duration: 0.5 }, 0.7)
          // el título sube y se desvanece antes de que la foto llegue a su altura
          .to(".ex-title", { yPercent: -40, opacity: 0, ease: "power1.in", duration: 0.35 }, 0);
      });
    });
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    return () => { window.removeEventListener("load", refresh); ctx.revert(); };
  }, []);
  return null;
}
