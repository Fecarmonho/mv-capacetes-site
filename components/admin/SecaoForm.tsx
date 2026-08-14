"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Produto } from "@/lib/types";
import ProdutoPicker from "@/components/admin/ProdutoPicker";

export default function SecaoForm({ produtos }: { produtos: Produto[] }) {
  const router = useRouter();
  const [titulo, setTitulo] = useState("");
  const [slugs, setSlugs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!titulo.trim()) {
      setError("Dê um nome pra seção.");
      return;
    }
    if (slugs.length === 0) {
      setError("Escolha pelo menos um produto.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/admin/secoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo: titulo.trim(), produtoSlugs: slugs, ativo: true }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? "Não foi possível criar a seção.");
      }
      setTitulo("");
      setSlugs([]);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-ink/8 bg-white p-5 shadow-card sm:p-6">
      <h2 className="font-display text-base font-bold text-ink">Nova seção</h2>
      <label className="mt-4 block text-sm font-medium text-ink/80">
        Nome (aparece como título na home)
        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ex: Ofertas da semana"
          className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 text-sm focus:border-blue focus:outline-none"
        />
      </label>
      <div className="mt-4">
        <span className="block text-sm font-medium text-ink/80">Produtos</span>
        <div className="mt-1">
          <ProdutoPicker produtos={produtos} selecionados={slugs} onChange={setSlugs} />
        </div>
      </div>
      {error && <p className="mt-3 text-sm font-medium text-red-500">{error}</p>}
      <button type="submit" disabled={saving} className="btn-blue mt-4 rounded-full px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">
        {saving ? "Criando..." : "Criar seção"}
      </button>
    </form>
  );
}
