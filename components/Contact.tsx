"use client";
import { useRef, useState } from "react";

const eventTypes = ["Boda", "Evento corporativo", "Particular", "Otro"];
const budgets = ["Menos de 500 €", "500 – 1.000 €", "1.000 – 2.500 €", "2.500 – 5.000 €", "Más de 5.000 €", "Aún no lo sé"];
const stepNames = ["Contacto", "Tu evento", "Detalles"];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="eyebrow text-earth">{label}</span>
      {children}
    </label>
  );
}

export default function Contact() {
  const [step, setStep] = useState(0);
  const form = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  function next() {
    const section = form.current?.querySelector<HTMLElement>(`[data-step="${step}"]`);
    const inputs = Array.from(section?.querySelectorAll<HTMLInputElement>("input, select, textarea") ?? []);
    for (const el of inputs) if (!el.reportValidity()) return;
    setStep((s) => Math.min(s + 1, 2));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (step < 2) return next();
    setStatus("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo: "presupuesto", ...data }),
      });
      setStatus(res.ok ? "ok" : "error");
    } catch {
      setStatus("error");
    }
  }

  const hide = (n: number) => (step === n ? "grid" : "hidden");

  return (
    <section id="contacto" className="relative overflow-hidden bg-forest px-6 py-28 text-ivory md:py-40">
      <span data-x="18" className="pointer-events-none absolute left-0 top-4 select-none whitespace-nowrap font-[family-name:var(--font-serif)] text-[22vw] italic leading-none text-ivory/[0.05]">Contacto</span>
      <div className="relative mx-auto grid max-w-7xl gap-16 lg:grid-cols-5">
        <div data-speed="0.35" className="lg:col-span-2">
          <p className="eyebrow mb-4 text-sage">Contacto</p>
          <h2 data-mask className="h-serif text-5xl md:text-6xl">
            Hablemos de tu <em className="text-sage">evento</em>
          </h2>
          <p className="mt-6 max-w-sm text-ivory/80">
            Cuéntanos tu idea. Te responderemos con una propuesta floral a tu medida.
          </p>
          <dl className="mt-12 space-y-6 text-sm">
            <div>
              <dt className="eyebrow text-sage">Estudio</dt>
              <dd>Av. Ramón Nieto 126, Lavadores<br />36205 Vigo, Pontevedra</dd>
            </div>
            <div>
              <dt className="eyebrow text-sage">Teléfono</dt>
              <dd><a href="tel:+34680200100" className="inline-block py-2">680 20 01 00</a></dd>
            </div>
            <div>
              <dt className="eyebrow text-sage">Instagram</dt>
              <dd><a href="https://www.instagram.com/anxodominguezartefloral" target="_blank" rel="noreferrer" className="inline-block py-2">@anxodominguezartefloral</a></dd>
            </div>
          </dl>
        </div>

        <div className="bg-ivory p-8 text-ink md:p-12 lg:col-span-3">
          {status === "ok" ? (
            <div className="py-16 text-center">
              <h3 className="h-serif text-4xl text-forest">¡Gracias!</h3>
              <p className="mt-4">Hemos recibido tu solicitud. Nos pondremos en contacto contigo muy pronto.</p>
            </div>
          ) : (
            <form ref={form} onSubmit={onSubmit}>
              <ol className="mb-10 flex gap-3">
                {stepNames.map((n, k) => (
                  <li key={n} className="flex-1">
                    <div className={`h-0.5 ${k <= step ? "bg-forest" : "bg-earth/25"}`} />
                    <span className={`eyebrow mt-2 block ${k === step ? "text-forest" : "text-earth/60"}`}>
                      {k + 1}. {n}
                    </span>
                  </li>
                ))}
              </ol>

              <div data-step="0" className={`${hide(0)} gap-8 md:grid-cols-2`}>
                <Field label="Nombre y apellidos *">
                  <input name="nombre" required autoComplete="name" className="field" />
                </Field>
                <Field label="Teléfono *">
                  <input name="telefono" type="tel" required autoComplete="tel" className="field" />
                </Field>
                <div className="md:col-span-2">
                  <Field label="Email *">
                    <input name="email" type="email" required autoComplete="email" className="field" />
                  </Field>
                </div>
              </div>

              <div data-step="1" className={`${hide(1)} gap-8 md:grid-cols-2`}>
                <Field label="Fecha del evento *">
                  <input name="fecha" type="date" required className="field" />
                </Field>
                <Field label="Tipo de evento *">
                  <select name="tipoEvento" required defaultValue="" className="field">
                    <option value="" disabled>Selecciona…</option>
                    {eventTypes.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </Field>
                <div className="md:col-span-2">
                  <Field label="Lugar del evento (finca, restaurante, ciudad) *">
                    <input name="lugar" required className="field" />
                  </Field>
                </div>
              </div>

              <div data-step="2" className={`${hide(2)} gap-8 md:grid-cols-2`}>
                <Field label="Nº aproximado de invitados *">
                  <input name="invitados" type="number" min={1} required className="field" />
                </Field>
                <Field label="Presupuesto aproximado *">
                  <select name="presupuesto" required defaultValue="" className="field">
                    <option value="" disabled>Selecciona…</option>
                    {budgets.map((b) => <option key={b}>{b}</option>)}
                  </select>
                </Field>
                <div className="md:col-span-2">
                  <Field label="Detalles adicionales">
                    <textarea name="detalles" rows={4} className="field resize-none" placeholder="Estilo, colores, flores favoritas, inspiración…" />
                  </Field>
                </div>
              </div>

              {status === "error" && <p className="mt-6 text-sm text-granate">No se pudo enviar. Inténtalo de nuevo o llámanos al 680 20 01 00.</p>}

              <div className="mt-10 flex justify-between">
                {step > 0 ? (
                  <button type="button" onClick={() => setStep(step - 1)} data-magnetic className="eyebrow border-b border-ink pb-1">← Atrás</button>
                ) : <span />}
                {step < 2 ? (
                  <button type="button" onClick={next} data-magnetic className="eyebrow bg-forest px-9 py-4 text-ivory transition-colors hover:bg-ink">Siguiente →</button>
                ) : (
                  <button disabled={status === "sending"} data-magnetic className="eyebrow bg-forest px-9 py-4 text-ivory transition-colors hover:bg-ink disabled:opacity-60">
                    {status === "sending" ? "Enviando…" : "Enviar solicitud"}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
