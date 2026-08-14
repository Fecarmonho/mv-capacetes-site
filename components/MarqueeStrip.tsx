/* Ícones sólidos (preenchidos, não linha fina) — mais fácil de reconhecer
 * pequeno numa faixa rolando. O corte do visor usa a cor do fundo escuro
 * do próprio marquee (hero-night, #05070D) direto, já que esse ícone só
 * é usado em cima dessa faixa. */
function IconeCapacete({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path
        fill="currentColor"
        d="M12 3.5c-4.7 0-8.5 3.9-8.5 8.7v3.3c0 1.4 1.1 2.5 2.5 2.5h.5v-5.8c0-3 2.5-5.5 5.5-5.5s5.5 2.5 5.5 5.5v5.8h.5c1.4 0 2.5-1.1 2.5-2.5v-3.3c0-4.8-3.8-8.7-8.5-8.7Z"
      />
      <rect x="6.5" y="12.6" width="11" height="2.6" rx="1.3" fill="#05070D" />
    </svg>
  );
}

function IconeMoto({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <circle cx="5.5" cy="17.5" r="3" fill="currentColor" />
      <circle cx="18.5" cy="17.5" r="3" fill="currentColor" />
      <path
        fill="currentColor"
        d="M7 17.5a1.3 1.3 0 0 1 1.3-1.3h2.4l1.9-4.6a1.3 1.3 0 0 1 1.2-.8h3.1c.5 0 1 .3 1.2.8l1.4 3.3c.7.2 1.2.8 1.2 1.6a1.3 1.3 0 0 1-1.3 1.3H17a1.3 1.3 0 0 1-1.3-1.3H8.3A1.3 1.3 0 0 1 7 17.5Z"
      />
      <rect x="15.2" y="7.3" width="4.3" height="2.1" rx="1" fill="currentColor" />
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
