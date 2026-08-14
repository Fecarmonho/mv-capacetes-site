"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Produto, SecaoHome } from "@/lib/types";
import ProdutoPicker from "@/components/admin/ProdutoPicker";
import DeleteButton from "@/components/admin/DeleteButton";

async function salvarSecao(id: string, dados: Partial<SecaoHome>) {
  const response = await fetch(`/api/admin/secoes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  if (!response.ok) throw new Error("Não foi possível salvar a seção.");
}

export default function SecaoCard({
  secao,
  produtos,
  vizinhoAnterior,
  vizinhoSeguinte,
}: {
  secao: SecaoHome;
  produtos: Produto[];
  vizinhoAnterior?: SecaoHome;
  vizinhoSeguinte?: SecaoHome;
}) {
  const router = useRouter();
  const [editando, setEditando] = useState(false);
  const [titulo, setTitulo] = useState(secao.titulo);
  const [slugs, setSlugs] = useState(secao.produtoSlugs);
  const [salvando, setSalvando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAction(fn: () => Promise<void>) {
    setSalvando(true);
    setError(null);
    try {
      await fn();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setSalvando(false);
    }
  }

  function toggleAtivo() {
    handleAction(() => salvarSecao(secao.id, { ativo: !secao.ativo }));
  }

  function mover(direcao: "cima" | "baixo") {
    const vizinho = direcao === "cima" ? vizinhoAnterior : vizinhoSeguinte;
    if (!vizinho) return;
    handleAction(async () => {
      await Promise.all([
        salvarSecao(secao.id, { ordem: vizinho.ordem }),
        salvarSecao(vizinho.id, { ordem: secao.ordem }),
      ]);
    });
  }

  async function salvarEdicao() {
    if (!titulo.trim() || slugs.length === 0) {
      setError("Preencha o nome e escolha pelo menos um produto.");
      return;
    }
    await handleAction(() => salvarSecao(secao.id, { titulo: titulo.trim(), produtoSlugs: slugs }));
    setEditando(false);
  }

  return (
    <div className="rounded-2xl border border-ink/8 bg-white p-4 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-medium text-ink">{secao.titulo}</p>
          <p className="text-xs text-ink/40">{secao.produtoSlugs.length} produto(s)</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-semibold text-ink/70">
            <input type="checkbox" checked={secao.ativo} onChange={toggleAtivo} disabled={salvando} />
            Ativa
          </label>
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => mover("cima")} disabled={!vizinhoAnterior || salvando} aria-label="Mover para cima" className="rounded-lg border border-ink/15 px-2 py-1 text-xs text-ink/60 disabled:opacity-30">
              ↑
            </button>
            <button type="button" onClick={() => mover("baixo")} disabled={!vizinhoSeguinte || salvando} aria-label="Mover para baixo" className="rounded-lg border border-ink/15 px-2 py-1 text-xs text-ink/60 disabled:opacity-30">
              ↓
            </button>
          </div>
          <button type="button" onClick={() => setEditando((v) => !v)} className="text-xs font-semibold text-blue">
            {editando ? "Cancelar" : "Editar"}
          </button>
          <DeleteButton url={`/api/admin/secoes/${secao.id}`} confirmMessage={`Remover a seção "${secao.titulo}"?`} />
        </div>
      </div>

      {editando && (
        <div className="mt-4 border-t border-ink/8 pt-4">
          <label className="block text-sm font-medium text-ink/80">
            Nome
            <input value={titulo} onChange={(e) => setTitulo(e.target.value)} className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 text-sm focus:border-blue focus:outline-none" />
          </label>
          <div className="mt-3">
            <ProdutoPicker produtos={produtos} selecionados={slugs} onChange={setSlugs} />
          </div>
          <button type="button" onClick={salvarEdicao} disabled={salvando} className="btn-blue mt-3 rounded-full px-5 py-2 text-sm font-bold text-white disabled:opacity-60">
            {salvando ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      )}
      {error && <p className="mt-2 text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}
