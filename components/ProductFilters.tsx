"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Marca } from "@/lib/types";

const ORDENACOES = [
  { value: "recentes", label: "Mais recentes" },
  { value: "menor-preco", label: "Menor preço" },
  { value: "maior-preco", label: "Maior preço" },
];

export default function ProductFilters({
  marcas,
  tamanhos,
  cores,
}: {
  marcas: Marca[];
  tamanhos: string[];
  cores: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  function valor(chave: string) {
    return searchParams.get(chave) ?? "";
  }

  function aplicar(form: HTMLFormElement) {
    const dados = new FormData(form);
    const params = new URLSearchParams();
    for (const [chave, val] of dados.entries()) {
      if (val && val !== "todos") params.set(chave, String(val));
    }
    router.push(`${pathname}?${params.toString()}`);
    setOpen(false);
  }

  const conteudo = (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        aplicar(e.currentTarget);
      }}
      className="flex flex-col gap-5"
    >
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink/50">Condição</p>
        <div className="flex gap-2">
          {[
            { value: "todos", label: "Todos" },
            { value: "novo", label: "Novos" },
            { value: "usado", label: "Usados" },
          ].map((opt) => (
            <label key={opt.value} className="flex-1">
              <input type="radio" name="tipo" value={opt.value} defaultChecked={valor("tipo") === opt.value || (!valor("tipo") && opt.value === "todos")} className="peer sr-only" />
              <span className="block cursor-pointer rounded-full border border-ink/15 px-3 py-1.5 text-center text-xs font-semibold text-ink/60 peer-checked:border-blue peer-checked:bg-blue/10 peer-checked:text-blue">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <label className="text-sm">
        <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink/50">Marca</span>
        <select name="marca" defaultValue={valor("marca")} className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm">
          <option value="">Todas</option>
          {marcas.map((m) => (
            <option key={m.slug} value={m.nome}>{m.nome}</option>
          ))}
        </select>
      </label>

      {tamanhos.length > 0 && (
        <label className="text-sm">
          <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink/50">Tamanho</span>
          <select name="tamanho" defaultValue={valor("tamanho")} className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm">
            <option value="">Todos</option>
            {tamanhos.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>
      )}

      {cores.length > 0 && (
        <label className="text-sm">
          <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink/50">Cor</span>
          <select name="cor" defaultValue={valor("cor")} className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm">
            <option value="">Todas</option>
            {cores.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
      )}

      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm">
          <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink/50">Preço mín.</span>
          <input type="number" name="precoMin" min={0} defaultValue={valor("precoMin")} className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm" />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink/50">Preço máx.</span>
          <input type="number" name="precoMax" min={0} defaultValue={valor("precoMax")} className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm" />
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm font-medium text-ink/70">
        <input type="checkbox" name="disponivel" value="1" defaultChecked={valor("disponivel") === "1"} />
        Só disponíveis em estoque
      </label>

      <label className="text-sm">
        <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink/50">Ordenar por</span>
        <select name="ordenar" defaultValue={valor("ordenar") || "recentes"} className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm">
          {ORDENACOES.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </label>

      <button type="submit" className="btn-blue rounded-full px-5 py-2.5 text-sm font-bold text-white">
        Aplicar filtros
      </button>
      {searchParams.toString() && (
        <button type="button" onClick={() => router.push(pathname)} className="text-sm font-semibold text-ink/50 hover:text-ink">
          Limpar filtros
        </button>
      )}
    </form>
  );

  return (
    <>
      <div className="mb-4 md:hidden">
        <button onClick={() => setOpen(true)} className="flex w-full items-center justify-center gap-2 rounded-full border border-ink/15 bg-white px-5 py-2.5 text-sm font-semibold text-ink/70 shadow-card">
          🎚️ Filtros e ordenação
        </button>
      </div>

      <aside className="hidden w-64 shrink-0 rounded-2xl border border-ink/8 bg-white p-5 shadow-card md:block">
        {conteudo}
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-5 pb-8">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-display text-lg font-bold text-ink">Filtros</p>
              <button onClick={() => setOpen(false)} aria-label="Fechar" className="rounded-lg border border-ink/15 px-2.5 py-1 text-ink/60">✕</button>
            </div>
            {conteudo}
          </div>
        </div>
      )}
    </>
  );
}
