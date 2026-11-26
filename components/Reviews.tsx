"use client";
import { useState } from "react";

const reviews = [
  {
    name: "Patricia Álvarez Iglesias",
    tag: "Boda",
    text: "¡Espectacular! Ha sido el encargado de la decoración floral de mi boda y ramo y estaba todo tan perfecto y precioso que no tengo palabras para describir su trabajo, además el trato con Anxo que es maravilloso.",
  },
  {
    name: "Silvia Pereira",
    tag: "Boda",
    text: "Anxo eres increíble. Maravillada por su trabajo, todo lo que toca lo convierte en magia. Un 10 como profesional, y lo mismo como persona.",
  },
  {
    name: "Acuña",
    tag: "Celebración",
    text: "Súper encantador, buenas ideas y se encargan de todo en tu celebración. Me encanta. Gracias.",
  },
  {
    name: "M. Isabel Gómez Carrera",
    tag: "Evento",
    text: "Es un gran profesional, perfeccionista y muy sensible a las situaciones.",
  },
  {
    name: "Ludilad Vigo",
    tag: "Empresa",
    text: "Un 10 como empresa y un 10 como persona.",
  },
];

export default function Reviews() {
  const [i, setI] = useState(0);
  const r = reviews[i];
  const go = (d: number) => setI((cur) => (cur + d + reviews.length) % reviews.length);

  return (
    <section id="resenas" className="relative overflow-hidden bg-cream px-6 py-28 md:py-40">
      <span data-speed="-0.8" className="pointer-events-none absolute left-[8%] top-10 select-none font-[family-name:var(--font-serif)] text-[28rem] leading-none text-sage/20">“</span>
      <span data-x="15" className="pointer-events-none absolute left-0 bottom-0 select-none whitespace-nowrap font-[family-name:var(--font-serif)] text-[20vw] italic leading-none text-forest/[0.05]">Reseñas</span>
      <div data-speed="0.2" className="relative mx-auto max-w-4xl text-center">
        <p className="eyebrow mb-4 text-sage">Reseñas</p>
        <h2 data-mask className="h-serif text-5xl md:text-6xl">
          Lo que dicen <em className="text-forest">nuestros clientes</em>
        </h2>
        <figure className="mt-16 min-h-[16rem]" aria-live="polite">
          <div className="text-gold" aria-label="5 de 5 estrellas">★★★★★</div>
          <blockquote className="h-serif mt-6 text-2xl italic md:text-4xl">“{r.text}”</blockquote>
          <figcaption className="eyebrow mt-8 text-earth">
            {r.name} · {r.tag}
          </figcaption>
        </figure>
        <div className="mt-8 flex items-center justify-center gap-6">
          <button type="button" onClick={() => go(-1)} aria-label="Reseña anterior" className="h-11 w-11 rounded-full border border-earth/40 transition-colors hover:bg-forest hover:text-ivory">
            ←
          </button>
          <div className="flex">
            {reviews.map((_, k) => (
              <button type="button"
                key={k}
                onClick={() => setI(k)}
                aria-label={`Reseña ${k + 1}`}
                className="flex h-9 w-6 items-center justify-center"
              >
                <span className={`block h-2 w-2 rounded-full transition-colors ${k === i ? "bg-forest" : "bg-earth/30"}`} />
              </button>
            ))}
          </div>
          <button type="button" onClick={() => go(1)} aria-label="Reseña siguiente" className="h-11 w-11 rounded-full border border-earth/40 transition-colors hover:bg-forest hover:text-ivory">
            →
          </button>
        </div>
      </div>
    </section>
  );
}
