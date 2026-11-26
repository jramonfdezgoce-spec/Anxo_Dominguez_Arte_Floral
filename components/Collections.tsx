import { asset } from "./asset";
const panels = [
  { n: "01", t: "Pasillos de pétalos", d: "Caminos de pétalos y marcos florales que conducen a la ceremonia.", img: asset("/img/petalos.jpg"), pos: "60% 50%" },
  { n: "02", t: "Ceremonias al aire libre", d: "Sillas, arcos y ambientes pensados para vivir el «sí, quiero» entre árboles.", img: asset("/img/sillas.jpg"), pos: "50% 50%" },
  { n: "03", t: "Rincones con alma", d: "Sofás, photocalls y esquinas florales para recordar la fiesta.", img: asset("/img/rincon.jpg"), pos: "70% 50%" },
];

export default function Collections() {
  return (
    <section id="colecciones" className="relative overflow-hidden bg-ink text-ivory md:h-screen">
      <div className="flex h-full flex-col justify-center py-24 md:py-0">
        <div className="px-6 md:absolute md:left-12 md:top-24 md:z-10 md:px-0">
          <p className="eyebrow text-sage">Colecciones</p>
          <h2 data-mask className="h-serif mt-2 text-4xl md:text-6xl">Un recorrido <em className="text-sage">floral</em></h2>
        </div>
        <div className="h-track flex flex-col gap-10 px-6 pt-10 md:w-max md:flex-row md:items-center md:gap-0 md:px-0 md:pl-[34vw] md:pr-[10vw] md:pt-20">
          {panels.map((p) => (
            <article key={p.n} data-cursor="view" className="flex shrink-0 flex-col gap-6 md:w-[62vw] md:flex-row md:items-center md:pr-24">
              <div className="relative aspect-[4/5] overflow-hidden md:h-[62vh] md:w-[26vw]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img decoding="async" src={p.img} alt={p.t} style={{ objectPosition: p.pos }} className="h-img absolute inset-0 h-full w-full scale-125 object-cover md:w-[130%] md:max-w-none" />
              </div>
              <div className="md:w-[24vw]">
                <span className="h-serif text-7xl italic text-gold/70 md:text-8xl">{p.n}</span>
                <h3 className="h-serif mt-2 text-3xl md:text-4xl">{p.t}</h3>
                <p className="mt-3 text-sm text-ivory/70">{p.d}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="absolute bottom-10 left-12 right-12 hidden h-px bg-ivory/20 md:block">
          <div className="h-bar h-full origin-left scale-x-0 bg-gold" />
        </div>
      </div>
    </section>
  );
}
