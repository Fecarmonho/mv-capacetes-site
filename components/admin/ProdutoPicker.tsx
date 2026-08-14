"use client";

import { useState } from "react";
import { Produto } from "@/lib/types";

export default function ProdutoPicker({
  produtos,
  selecionados,
  onChange,
}: {
  produtos: Produto[];
  selecionados: string[];
  onChange: (slugs: string[]) => void;
}) {
  const [busca, setBusca] = useState("");
  const filtrados = produtos.filter((p) => `${p.nome} ${p.marca}`.toLowerCase().includes(busca.toLowerCase()));

  function toggle(slug: string) {
    onChange(selecionados.includes(slug) ? selecionados.filter((s) => s !== slug) : [...selecionados, slug]);
  }

  return (
    <div>
      <input
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder="Buscar por nome ou marca..."
        className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm focus:border-blue focus:outline-none"
      />
      <div className="mt-2 max-h-64 overflow-y-auto rounded-lg border border-ink/10">
        {filtrados.length === 0 ? (
          <p className="p-3 text-center text-xs text-ink/40">Nenhum produto encontrado.</p>
        ) : (
          filtrados.map((p) => (
            <label key={p.slug} className="flex cursor-pointer items-center gap-3 border-b border-ink/5 px-3 py-2 last:border-0 hover:bg-paper">
              <input type="checkbox" checked={selecionados.includes(p.slug)} onChange={() => toggle(p.slug)} />
              {p.imagemUrl ? (
                <img src={p.imagemUrl} alt="" className="h-8 w-8 shrink-0 rounded object-contain" />
              ) : (
                <div className="h-8 w-8 shrink-0 rounded bg-paper" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-ink">{p.nome}</p>
                <p className="text-[10px] text-ink/40">{p.marca} · {p.tipo}</p>
              </div>
            </label>
          ))
        )}
      </div>
      <p className="mt-1 text-xs text-ink/40">{selecionados.length} selecionado(s)</p>
    </div>
  );
}
