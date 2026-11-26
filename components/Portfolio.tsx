"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PetalSVG } from "./flowerArt";
import { asset } from "./asset";

const speeds = [-0.3, 0.45, -0.1, 0.35, -0.4, 0.2];

const items = [
  { src: asset("/img/flores-cerca.jpg"), alt: "Detalle de pasillo floral con pampa, rosas y gerberas", span: "md:col-span-5 md:row-span-2", ratio: "aspect-[4/5]" },
  { src: asset("/img/ramo-rosa.jpg"), alt: "Ramo de rosas y astilbe", span: "md:col-span-4", ratio: "aspect-[4/5]" },
  { src: asset("/img/ramo-tulipan.jpg"), alt: "Arreglo de tulipanes y fresias", span: "md:col-span-3", ratio: "aspect-square" },
  { src: asset("/img/mesa-rosas.jpg"), alt: "Mesa de banquete con rosas crema y velas", span: "md:col-span-7", ratio: "aspect-[4/3]" },
  { src: asset("/img/arco-detalle.jpg"), alt: "Arco de madera cubierto de flores secas y rosas", span: "md:col-span-5", ratio: "aspect-square" },
  { src: asset("/img/pasillo-b.jpg"), alt: "Pasillo de ceremonia bordeado de flores", span: "md:col-span-7", ratio: "aspect-[4/3]" },
];

export default function Portfolio() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(".pf-wrap").forEach((wrap) => {
          const img = wrap.querySelector("img");
          gsap.fromTo(
            img,
            { scale: 1.2 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: { trigger: wrap, start: "top bottom", end: "bottom 35%", scrub: true },
            }
          );
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="portafolio" ref={root} className="relative overflow-hidden px-6 py-28 md:py-40">
      <span data-x="18" className="pointer-events-none absolute right-0 top-10 select-none whitespace-nowrap font-[family-name:var(--font-serif)] text-[20vw] italic leading-none text-sage/[0.12]">Portafolio</span>
      <PetalSVG data-speed="-1" data-rot="140" fill="#8f2540" className="pointer-events-none absolute left-[3%] top-[30%] z-10 w-12" />
      <PetalSVG data-speed="0.9" data-rot="-100" fill="#f6d2b4" className="pointer-events-none absolute right-[5%] top-[60%] z-10 w-16" />
      <div className="relative mx-auto max-w-7xl">
        <div data-speed="0.25" className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow mb-4 text-sage">Portafolio</p>
            <h2 data-mask className="h-serif text-5xl md:text-6xl">
              Trabajos que <em className="text-forest">florecen</em>
            </h2>
          </div>
          <a
            href="https://www.instagram.com/anxodominguezartefloral"
            target="_blank"
            rel="noreferrer"
            data-magnetic className="eyebrow border-b border-ink py-2 self-start md:self-auto"
          >
            Ver más en Instagram
          </a>
        </div>
        <div className="grid grid-cols-1 gap-6 md:auto-rows-auto md:grid-cols-12 md:gap-6">
          {items.map((it, i) => (
            <div key={it.src + it.alt} data-speed={speeds[i]} data-cursor="view" className={`pf-wrap overflow-hidden bg-sand ${it.span}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img decoding="async" src={it.src} alt={it.alt} className={`h-full w-full object-cover md:aspect-auto ${it.ratio} md:min-h-[320px]`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
