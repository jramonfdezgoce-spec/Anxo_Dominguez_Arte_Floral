const services = [
  {
    n: "01",
    title: "Bodas",
    text: "Decoración floral integral para tu día: ceremonia, banquete y cada rincón, con coordinación de principio a fin.",
    img: asset("/img/pasillo-a.jpg"),
  },
  {
    n: "02",
    title: "Ramos de novia",
    text: "Ramos artesanales y únicos, diseñados según tu vestido, tu paleta y tu personalidad.",
    img: asset("/img/ramo-novia.jpg"),
  },
  {
    n: "03",
    title: "Arcos florales",
    text: "Arcos y fondos de ceremonia que convierten un jardín o una finca en un escenario inolvidable.",
    img: asset("/img/arco-otono.jpg"),
  },
  {
    n: "04",
    title: "Eventos corporativos",
    text: "Ambientación floral para presentaciones, cenas de empresa y espacios de marca con elegancia.",
    img: asset("/img/pampa-suelo.jpg"),
  },
];

import { PetalSVG } from "./flowerArt";
import { asset } from "./asset";

const speeds = [0.35, -0.15, 0.5, 0];

export default function Services() {
  return (
    <section id="servicios" className="relative overflow-hidden bg-cream px-6 py-28 md:py-40">
      <span data-x="22" className="pointer-events-none absolute left-0 top-6 select-none whitespace-nowrap font-[family-name:var(--font-serif)] text-[22vw] italic leading-none text-forest/[0.06]">Servicios</span>
      <PetalSVG data-speed="-0.9" data-rot="90" fill="#e8a0b2" className="pointer-events-none absolute right-[8%] top-24 w-14" />
      <PetalSVG data-speed="0.7" data-rot="-120" fill="#f4c9d2" className="pointer-events-none absolute left-[4%] bottom-40 w-10" />
      <div className="relative mx-auto max-w-7xl">
        <div data-speed="0.25" className="mb-16 max-w-2xl">
          <p className="eyebrow mb-4 text-sage">Servicios</p>
          <h2 data-mask className="h-serif text-5xl md:text-6xl">
            Diseño floral a medida para <em className="text-forest">cada ocasión</em>
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <article key={s.n} data-speed={speeds[i]} data-cursor="view" className="group relative aspect-[3/4] overflow-hidden bg-forest text-ivory">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.img}
                alt={s.title}
                data-pimg
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <span className="eyebrow text-gold">{s.n}</span>
                <h3 className="h-serif mt-2 text-3xl">{s.title}</h3>
                <p className="mt-3 max-h-0 overflow-hidden text-sm opacity-0 transition-all duration-500 group-hover:max-h-40 group-hover:opacity-100 max-lg:max-h-none max-lg:opacity-100">
                  {s.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
