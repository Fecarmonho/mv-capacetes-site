"use client";

import { useRef } from "react";
import { Marca } from "@/lib/types";

/** Faixa ilustrativa de marcas — inspirada na barra "Marcas em destaques"
 * da Sacramento Motos: título com friso diagonal dos dois lados, cartão
 * branco com os logos rolando e setas pra navegar. Só mostra (sem link,
 * sem filtro de estoque) — é vitrine de credibilidade, não navegação. */
export default function MarcasDestaque({ marcas }: { marcas: Marca[] }) {
  const trilhoRef = useRef<HTMLDivElement>(null);
  const comLogo = marcas.filter((m) => m.logo);

  function mover(direcao: 1 | -1) {
    const trilho = trilhoRef.current;
    if (!trilho) return;
    trilho.scrollBy({ left: direcao * 240, behavior: "smooth" });
  }

  if (comLogo.length === 0) return null;

  return (
    <section className="border-t-2 border-blue bg-paper py-10">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-center gap-4 sm:gap-8">
          <span
            className="hidden h-6 flex-1 sm:block"
            style={{
              backgroundImage: "repeating-linear-gradient(-45deg, currentColor 0, currentColor 1px, transparent 1px, transparent 8px)",
              color: "rgb(15 20 32 / 0.12)",
            }}
            aria-hidden="true"
          />
          <h2 className="shrink-0 font-display text-lg font-bold uppercase tracking-widest text-ink sm:text-xl">
            Marcas em destaque
          </h2>
          <span
            className="hidden h-6 flex-1 sm:block"
            style={{
              backgroundImage: "repeating-linear-gradient(-45deg, currentColor 0, currentColor 1px, transparent 1px, transparent 8px)",
              color: "rgb(15 20 32 / 0.12)",
            }}
            aria-hidden="true"
          />
        </div>

        <div className="relative mt-6">
          <div ref={trilhoRef} className="scrollbar-none flex gap-10 overflow-x-auto scroll-smooth rounded-2xl border border-ink/8 bg-white px-8 py-8 sm:gap-14 sm:px-14">
            {comLogo.map((m) => (
              <img key={m.slug} src={m.logo} alt={m.nome} className="h-9 w-auto shrink-0 object-contain sm:h-11" />
            ))}
          </div>

          {comLogo.length > 4 && (
            <>
              <button
                onClick={() => mover(-1)}
                aria-label="Ver marcas anteriores"
                className="absolute -left-3 top-1/2 hidden -translate-y-1/2 rounded-full border border-ink/10 bg-white p-2.5 text-ink/60 shadow-card hover:text-blue sm:flex"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={() => mover(1)}
                aria-label="Ver mais marcas"
                className="absolute -right-3 top-1/2 hidden -translate-y-1/2 rounded-full border border-ink/10 bg-white p-2.5 text-ink/60 shadow-card hover:text-blue sm:flex"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
