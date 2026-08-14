function IconeCapacete({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 14c0-5 3.5-9 8-9s8 4 8 9" />
      <path d="M4 14h16v1a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-1Z" />
      <path d="M14.5 10.3c1.4.4 2.4 1.3 2.9 2.4" />
    </svg>
  );
}

function IconeMoto({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="5" cy="18" r="3" />
      <circle cx="19" cy="18" r="3" />
      <path d="M5 18h5l4-7h6" />
      <path d="M11 11l3 7h5" />
      <path d="M16 7h3l1.5 4" />
    </svg>
  );
}

const ITEMS = [
  { texto: "MV CAPACETES", Icone: IconeCapacete, cor: "text-blue-light" },
  { texto: "PROTEÇÃO DE VERDADE", Icone: IconeMoto, cor: "text-spark" },
  { texto: "ESTILO E ATITUDE", Icone: IconeCapacete, cor: "text-blue-light" },
  { texto: "NOVOS E USADOS", Icone: IconeMoto, cor: "text-spark" },
  { texto: "CURADORIA TÉCNICA", Icone: IconeCapacete, cor: "text-blue-light" },
  { texto: "CAPACETES PRA TODA MOTO", Icone: IconeMoto, cor: "text-spark" },
];

/** Faixa de texto rolando infinito, no mesmo estilo do "marquee" do
 * fitmgwear-site: duas cópias da mesma lista lado a lado, animação
 * translateX de 0 a -50% em loop — como as duas metades são idênticas, a
 * transição do fim pro começo é invisível. Ícone de capacete/moto alterna
 * junto com a cor (azul/ciano) em vez das estrelinhas antigas. */
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
                <item.Icone className="h-4 w-4 shrink-0 opacity-80" />
                {item.texto}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
