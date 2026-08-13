const ITEMS = [
  { texto: "MV CAPACETES", destaque: true },
  { texto: "✦ PROTEÇÃO DE VERDADE ✦", destaque: false },
  { texto: "ESTILO E ATITUDE", destaque: true },
  { texto: "✦ NOVOS E USADOS ✦", destaque: false },
  { texto: "CURADORIA TÉCNICA", destaque: true },
  { texto: "✦ CAPACETES PRA TODA MOTO ✦", destaque: false },
];

/** Faixa de texto rolando infinito, no mesmo estilo do "marquee" do
 * fitmgwear-site: duas cópias da mesma lista lado a lado, animação
 * translateX de 0 a -50% em loop — como as duas metades são idênticas, a
 * transição do fim pro começo é invisível. */
export default function MarqueeStrip() {
  return (
    <div className="hero-night overflow-hidden py-3.5">
      <div className="flex w-max animate-marquee">
        {[0, 1].map((copia) => (
          <div key={copia} className="flex shrink-0">
            {ITEMS.map((item, i) => (
              <span
                key={`${copia}-${i}`}
                className={`whitespace-nowrap px-7 font-impact text-sm uppercase tracking-[0.2em] ${
                  item.destaque ? "text-blue-light" : "text-white/45"
                }`}
              >
                {item.texto}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
