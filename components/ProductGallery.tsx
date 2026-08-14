"use client";

import { useState } from "react";
import { FotoProduto } from "@/lib/types";

export default function ProductGallery({
  fotos,
  capaFallback,
  nome,
}: {
  /** Capa (fid "capa") + fotos extras, nessa ordem. */
  fotos: FotoProduto[];
  /** Usado só se `fotos` não tiver a capa (produto de seed antigo, por exemplo). */
  capaFallback: string;
  nome: string;
}) {
  const todas = fotos.some((f) => f.fid === "capa")
    ? fotos
    : [{ fid: "capa", mini: capaFallback, grande: capaFallback }, ...fotos];
  const [ativa, setAtiva] = useState(0);
  // Zoom que segue o mouse — passa o cursor por cima da foto e ela amplia
  // exatamente onde você está olhando (mesmo efeito de lupa de e-commerce).
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    setZoom({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }

  return (
    <div>
      <div
        className="aspect-square cursor-zoom-in overflow-hidden rounded-2xl border border-ink/8 bg-gradient-to-br from-paper to-ink/5"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setZoom(null)}
      >
        <img
          src={todas[ativa]?.grande ?? capaFallback}
          alt={nome}
          className="h-full w-full object-contain p-6 transition-transform duration-150 ease-out"
          style={zoom ? { transform: "scale(2.2)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
        />
      </div>
      {todas.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto">
          {todas.map((foto, i) => (
            <button
              key={foto.fid}
              onClick={() => setAtiva(i)}
              className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 ${i === ativa ? "border-blue" : "border-ink/10"}`}
            >
              <img src={foto.mini} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
