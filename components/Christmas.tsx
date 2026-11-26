import { PetalSVG } from "./flowerArt";
import { asset } from "./asset";

const items = [
  ["Centros de mesa", "Composiciones en oxblood, verde bosque y dorado antiguo con velas y terciopelo."],
  ["Coronas de adviento", "Coronas artesanales con follaje natural, frutos y detalles dorados."],
  ["Decoración navideña", "Árboles, lazos y rincones con carácter para casas, tiendas y empresas."],
];

export default function Christmas() {
  return (
    <section id="navidad" className="relative overflow-hidden bg-oxblood px-6 py-28 text-ivory md:py-40">
      <div data-speed="-1.2" className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-gold/15 blur-3xl" />
      <div data-speed="1" className="pointer-events-none absolute -bottom-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-forest/40 blur-3xl" />
      <span data-x="20" className="pointer-events-none absolute left-0 top-4 select-none whitespace-nowrap font-[family-name:var(--font-serif)] text-[22vw] italic leading-none text-ivory/[0.05]">Navidad</span>
      <PetalSVG data-speed="-1" data-rot="120" fill="#b8975a" className="pointer-events-none absolute left-[46%] top-20 w-10" />
      <PetalSVG data-speed="0.8" data-rot="-90" fill="#8f2540" className="pointer-events-none absolute right-[6%] bottom-24 w-12" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
        <div data-speed="0.3">
          <p className="eyebrow mb-4 text-gold">Colección especial</p>
          <h2 data-mask className="h-serif text-5xl md:text-7xl">
            Floral <em className="text-gold">navideño</em>
          </h2>
          <p className="mt-6 max-w-lg text-ivory/80">
            Esta Navidad, calidez y elegancia en tonos granate, verde bosque, crema y oro suave. Encargos
            personalizados para tu mesa, tu hogar o tu negocio.
          </p>
          <ul className="mt-12 divide-y divide-ivory/20 border-y border-ivory/20">
            {items.map(([t, d]) => (
              <li key={t} className="py-6">
                <h3 className="h-serif text-3xl">{t}</h3>
                <p className="mt-1 text-sm text-ivory/70">{d}</p>
              </li>
            ))}
          </ul>
          <a href="#contacto" data-magnetic className="eyebrow mt-10 inline-block glass px-9 py-4">
            Reservar mi decoración
          </a>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div data-speed="-0.5" className="col-span-1 row-span-2 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img decoding="async" data-pimg src={asset("/img/navidad-tendencias.jpg")} alt="Tendencias de color navideño: oxblood, verde bosque y dorado" className="h-full w-full object-cover" />
          </div>
          <div data-speed="0.4" className="aspect-square overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img decoding="async" data-pimg src={asset("/img/arbol-burdeos.jpg")} alt="Árbol de Navidad nevado con lazos y bolas en burdeos" className="h-full w-full object-cover" />
          </div>
          <div data-speed="0.7" className="flex aspect-square items-center justify-center border border-gold/50 p-6 text-center">
            <p className="h-serif text-2xl italic text-gold">Pedidos de Navidad abiertos</p>
          </div>
        </div>
      </div>
    </section>
  );
}
