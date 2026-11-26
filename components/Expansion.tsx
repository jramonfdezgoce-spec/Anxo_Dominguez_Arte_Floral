import { asset } from "./asset";
export default function Expansion() {
  return (
    <section id="expansion" className="relative h-screen overflow-hidden bg-ivory">
      <div className="ex-title absolute inset-x-0 top-0 z-20 flex h-[38%] items-end justify-center px-6 pb-6 text-center">
        <p className="h-serif text-[clamp(2.25rem,6vw,5.5rem)] leading-[1.05] text-forest">
          Donde las flores <em>cobran vida</em>
        </p>
      </div>
      <div className="ex-frame ex-start absolute inset-0 z-10 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img decoding="async" src={asset("/img/sofa-pampa.jpg")} alt="Rincón floral con sofá chester, pampa y calabazas" className="ex-img h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
        <div className="ex-text absolute inset-x-0 bottom-0 p-8 text-ivory opacity-0 md:p-16">
          <p className="eyebrow text-gold">Atmósferas únicas</p>
          <p className="h-serif mt-3 max-w-3xl text-4xl md:text-6xl">Diseñamos el escenario de tus mejores momentos.</p>
        </div>
      </div>
    </section>
  );
}
