"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/slug";

export default function MarcaForm() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!nome.trim()) return;

    setSaving(true);
    try {
      const response = await fetch("/api/admin/marcas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: slugify(nome), nome: nome.trim() }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? "Não foi possível salvar a marca.");
      }
      setNome("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-2xl border border-ink/8 bg-white p-5 shadow-card sm:flex-row sm:items-end">
      <label className="flex-1 text-sm font-medium text-ink/80">
        Nova marca
        <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: LS2" className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 text-sm focus:border-blue focus:outline-none" />
      </label>
      <button type="submit" disabled={saving} className="btn-blue rounded-full px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">
        {saving ? "Salvando..." : "Adicionar"}
      </button>
      {error && <p className="text-sm font-medium text-red-500 sm:ml-3">{error}</p>}
    </form>
  );
}
