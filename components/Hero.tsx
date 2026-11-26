"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PetalSVG } from "./flowerArt";
import { asset } from "./asset";

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = root.current!;
    const video = section.querySelector("video")!;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".hero-in", { y: 50, opacity: 0, duration: 1.4, ease: "power3.out", stagger: 0.18, delay: 2.3 });

        // iOS/Safari solo permite buscar fotogramas tras un play()
        video.play().then(() => video.pause()).catch(() => {});

        let target = 0;
        const tick = () => {
          if (!video.duration || video.seeking) return;
          const t = target * (video.duration - 0.05);
          const d = t - video.currentTime;
          if (Math.abs(d) > 0.02) video.currentTime += d * 0.3;
        };
        gsap.ticker.add(tick);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            onUpdate: (self) => {
              target = self.progress;
            },
          },
        });
        tl.to({}, { duration: 1 }, 0)
          // capas con distinta velocidad → profundidad
          .fromTo(".hero-video", { scale: 1.02, yPercent: 0 }, { scale: 1.07, yPercent: 4, ease: "none", duration: 1 }, 0)
          .to(".hero-title", { yPercent: -90, opacity: 0, ease: "none", duration: 0.22 }, 0)
          .to(".hero-sub", { yPercent: -140, opacity: 0, ease: "none", duration: 0.18 }, 0)
          .fromTo(".hero-mid", { opacity: 0, yPercent: 80 }, { opacity: 1, yPercent: 0, ease: "none", duration: 0.12 }, 0.3)
          .to(".hero-mid", { opacity: 0, yPercent: -80, ease: "none", duration: 0.12 }, 0.58)
          .fromTo(".hero-end", { opacity: 0, yPercent: 60 }, { opacity: 1, yPercent: 0, ease: "none", duration: 0.12 }, 0.84)
          .to(".hero-p1", { yPercent: -900, xPercent: 120, rotation: 260, ease: "none", duration: 1 }, 0)
          .to(".hero-p2", { yPercent: -600, xPercent: -90, rotation: -200, ease: "none", duration: 1 }, 0)
          .to(".hero-p3", { yPercent: -1200, xPercent: 60, rotation: 380, ease: "none", duration: 1 }, 0)
          .to(".hero-p4", { yPercent: -450, xPercent: -140, rotation: -300, ease: "none", duration: 1 }, 0)
          .to(".hero-scroll", { opacity: 0, duration: 0.05 }, 0);

        return () => gsap.ticker.remove(tick);
      });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section id="top" ref={root} className="relative h-[480svh] bg-ink">
      <div className="sticky top-0 h-[100svh] min-h-[600px] overflow-hidden">
        <video
          className="hero-video absolute inset-0 h-full w-full object-cover"
          src={asset("/video/hero.mp4")}
          poster={asset("/video/poster.jpg")}
          muted
          playsInline
          preload="auto"
          aria-label="Recorrido por una ceremonia al aire libre decorada con flores"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/15 to-ink/60" />

        <PetalSVG fill="#f4c9d2" className="hero-p1 absolute left-[12%] top-[88%] w-8" />
        <PetalSVG fill="#fff8ee" className="hero-p2 absolute left-[78%] top-[95%] w-6" />
        <PetalSVG fill="#e8a0b2" className="hero-p3 absolute left-[45%] top-[102%] w-10" />
        <PetalSVG fill="#fbeadb" className="hero-p4 absolute left-[90%] top-[92%] w-7" />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-ivory">
          <p className="hero-in hero-sub eyebrow mb-6">Vigo · Arte floral y diseño</p>
          <h1 className="hero-in hero-title h-serif text-[clamp(3rem,9vw,8rem)] drop-shadow-lg">
            Anxo Domínguez
            <span className="block font-light italic">Arte Floral</span>
          </h1>
          <p className="hero-in hero-sub mt-8 max-w-xl text-base drop-shadow md:text-lg">
            Creamos atmósferas únicas donde cada flor cuenta una historia.
          </p>
        </div>

        <div className="hero-mid pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center text-ivory opacity-0">
          <p className="h-serif max-w-3xl text-4xl italic drop-shadow-lg md:text-6xl">Cada espacio, una historia que florece</p>
        </div>

        <div className="hero-end absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-ivory opacity-0">
          <p className="h-serif text-4xl drop-shadow-lg md:text-6xl">Tu evento, a medida</p>
          <a href="#contacto" data-magnetic className="eyebrow mt-8 glass px-9 py-4">
            Cuéntanos tu idea
          </a>
        </div>

        <div className="hero-scroll absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-ivory">
          <span className="eyebrow text-[0.6rem]">Desliza</span>
          <span className="block h-10 w-px bg-ivory/70" />
        </div>
      </div>
    </section>
  );
}
