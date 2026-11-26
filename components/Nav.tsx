"use client";
import { useEffect, useState } from "react";

const links = [
  ["Servicios", "#servicios"],
  ["Portafolio", "#portafolio"],
  ["Navidad", "#navidad"],
  ["Reseñas", "#resenas"],
  ["Curso", "#curso"],
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  // con el menú abierto no se desplaza la página de fondo
  useEffect(() => {
    if (open) window.__lenis?.stop();
    else window.__lenis?.start();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-ink/45 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 text-ivory">
        <a href="#top" className="h-serif whitespace-nowrap py-2 text-lg tracking-wide drop-shadow md:text-xl">
          Anxo Domínguez
        </a>
        <nav className="hidden gap-8 lg:flex">
          {links.map(([l, h]) => (
            <a key={h} href={h} data-magnetic className="eyebrow drop-shadow transition-opacity hover:opacity-70">
              {l}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a href="#contacto" data-magnetic className="eyebrow glass hidden px-4 py-2 sm:inline-block md:px-5 md:py-2.5">
            Presupuesto
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            className="relative h-10 w-10 lg:hidden"
          >
            <span className={`absolute left-2 right-2 top-1/2 h-px bg-ivory transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-1.5"}`} />
            <span className={`absolute left-2 right-2 top-1/2 h-px bg-ivory transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-1.5"}`} />
          </button>
        </div>
      </div>
      <nav
        id="menu-movil"
        className={`fixed inset-x-0 top-[72px] bottom-0 flex flex-col items-center justify-center gap-8 bg-ink/90 backdrop-blur-xl transition-opacity duration-300 lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        aria-hidden={!open}
      >
        {[...links, ["Contacto", "#contacto"]].map(([l, h]) => (
          <a key={h} href={h} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)} className="h-serif text-4xl text-ivory transition-colors hover:text-gold">
            {l}
          </a>
        ))}
      </nav>
    </header>
  );
}
