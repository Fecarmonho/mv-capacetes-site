import { GiFullMotorcycleHelmet } from "react-icons/gi";
import { FaMotorcycle } from "react-icons/fa";

const ITEMS = [
  { texto: "MV CAPACETES", Icone: GiFullMotorcycleHelmet, cor: "text-blue-light" },
  { texto: "PROTEÇÃO DE VERDADE", Icone: FaMotorcycle, cor: "text-spark" },
  { texto: "ESTILO E ATITUDE", Icone: GiFullMotorcycleHelmet, cor: "text-blue-light" },
  { texto: "NOVOS E USADOS", Icone: FaMotorcycle, cor: "text-spark" },
  { texto: "CURADORIA TÉCNICA", Icone: GiFullMotorcycleHelmet, cor: "text-blue-light" },
  { texto: "CAPACETES PRA TODA MOTO", Icone: FaMotorcycle, cor: "text-spark" },
];

/** Faixa de texto rolando infinito, no mesmo estilo do "marquee" do
 * fitmgwear-site: duas cópias da mesma lista lado a lado, animação
 * translateX de 0 a -50% em loop — como as duas metades são idênticas, a
 * transição do fim pro começo é invisível. Ícones de verdade (react-icons:
 * Game Icons pro capacete, Font Awesome pra moto) em vez de SVG desenhado
 * na mão, que ficou ambíguo nas duas tentativas anteriores. */
export default function MarqueeStrip() {
  return (
    <div className="hero-night hero-grid relative overflow-hidden py-3.5">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-spark/60 to-transparent" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-light/60 to-transparent" aria-hidden="true" />

      <div className="relative flex w-max animate-marquee">
        {[0, 1].map((copia) => (
          <div key={copia} className="flex shrink-0">
            {ITEMS.map((item, i) => (
              <span key={`${copia}-${i}`} className={`flex items-center gap-2.5 whitespace-nowrap px-7 font-impact text-sm uppercase tracking-[0.2em] ${item.cor}`}>
                <item.Icone className="h-4 w-4 shrink-0" />
                {item.texto}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
