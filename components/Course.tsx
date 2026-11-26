"use client";
import { useState } from "react";
import { PetalSVG } from "./flowerArt";
import { asset } from "./asset";

const topics = [
  "Diseño botánico",
  "Diseño y creación de composición botánica",
  "Diseño de un ecosistema con plantas crasas",
  "Decoración expresiva con terrarios y las condiciones de un hábitat específico",
];

export default function Course() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(false);
    const email = new FormData(e.currentTarget).get("email");
    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo: "lista-espera-curso", email }),
      });
      if (res.ok) setSent(true);
      else setError(true);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="curso" className="relative overflow-hidden px-6 py-28 md:py-40">
      <PetalSVG data-speed="-1" data-rot="150" fill="#8a9a82" className="pointer-events-none absolute left-[48%] top-24 w-12" />
      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
        <div data-speed="-0.4" className="relative mx-auto max-w-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img decoding="async" src={asset("/img/curso-poster.jpg")} alt="Cartel del curso Proyecto Floral" className="w-full opacity-90 grayscale-[30%]" />
          <span data-speed="0.8" className="eyebrow absolute -right-3 top-8 rotate-6 bg-forest px-5 py-3 text-ivory shadow-lg">Próximamente</span>
        </div>
        <div data-speed="0.25">
          <p className="eyebrow mb-4 text-sage">Formación · Programa 2025</p>
          <h2 data-mask className="h-serif text-5xl md:text-6xl">
            Curso <em className="text-forest">Proyecto Floral</em>
          </h2>
          <p className="h-serif mt-3 text-3xl italic text-earth">PRÓXIMAMENTE…</p>
          <p className="mt-6 max-w-lg">
            Un curso/taller de formación en arte floral impartido por Anxo Domínguez. Déjanos tu email y serás
            el primero en saber cuándo se abren las plazas.
          </p>
          <ul className="mt-8 space-y-3 text-sm">
            {topics.map((t) => (
              <li key={t} className="flex gap-3">
                <span className="text-sage">✦</span>
                {t}
              </li>
            ))}
          </ul>
          {sent ? (
            <p className="mt-10 border border-sage p-5 text-forest">¡Gracias! Te avisaremos en cuanto abramos inscripciones.</p>
          ) : (
            <form onSubmit={onSubmit} className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-end">
              <label className="flex-1">
                <span className="sr-only">Email</span>
                <input name="email" type="email" required placeholder="Tu email" className="field" />
              </label>
              <button disabled={loading} data-magnetic className="eyebrow bg-forest px-8 py-4 text-ivory transition-colors hover:bg-ink disabled:opacity-60">
                {loading ? "Enviando…" : "Apuntarme a la lista"}
              </button>
            </form>
          )}
          {error && <p className="mt-4 text-sm text-granate">No se pudo enviar. Inténtalo de nuevo o llámanos al 680 20 01 00.</p>}
        </div>
      </div>
    </section>
  );
}
