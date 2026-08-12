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

  return (
    <div>
      <div className="aspect-square overflow-hidden rounded-2xl border border-ink/8 bg-gradient-to-br from-paper to-ink/5">
        <img src={todas[ativa]?.grande ?? capaFallback} alt={nome} className="h-full w-full object-contain p-6" />
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
