"use client";

import { useRef } from "react";
import { Produto, VarianteProduto } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

export default function ProductCarousel({
  itens,
}: {
  itens: { produto: Produto; variantes?: VarianteProduto[] }[];
}) {
  const trilhoRef = useRef<HTMLDivElement>(null);

  function mover(direcao: 1 | -1) {
    const trilho = trilhoRef.current;
    if (!trilho) return;
    const cardWidth = trilho.firstElementChild?.clientWidth ?? 280;
    trilho.scrollBy({ left: direcao * (cardWidth + 16) * 2, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div
        ref={trilhoRef}
        className="scrollbar-none flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2 sm:gap-6"
      >
        {itens.map(({ produto, variantes }) => (
          <div key={produto.slug} className="w-[46%] shrink-0 snap-start sm:w-[280px]">
            <ProductCard produto={produto} variantes={variantes} />
          </div>
        ))}
      </div>

      {itens.length > 2 && (
        <>
          <button
            onClick={() => mover(-1)}
            aria-label="Ver anteriores"
            className="absolute -left-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-ink/10 bg-white p-2.5 text-ink/60 shadow-card hover:text-blue sm:flex"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={() => mover(1)}
            aria-label="Ver próximos"
            className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-ink/10 bg-white p-2.5 text-ink/60 shadow-card hover:text-blue sm:flex"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
