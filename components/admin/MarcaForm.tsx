"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/slug";
import { processarFoto } from "@/lib/image-compress";

export default function MarcaForm() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [logo, setLogo] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setEnviando(true);
    try {
      const { mini } = await processarFoto(file);
      setLogo(mini);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao processar a logo.");
    } finally {
      setEnviando(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!nome.trim()) return;

    setSaving(true);
    try {
      const response = await fetch("/api/admin/marcas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: slugify(nome), nome: nome.trim(), logo: logo ?? undefined }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? "Não foi possível salvar a marca.");
      }
      setNome("");
      setLogo(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-2xl border border-ink/8 bg-white p-5 shadow-card sm:flex-row sm:items-end">
      <div className="flex items-center gap-3">
        {logo ? (
          <img src={logo} alt="" className="h-11 w-11 rounded-lg border border-ink/10 object-contain p-1" />
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-dashed border-ink/15 text-[9px] text-ink/30">Logo</div>
        )}
        <label className="cursor-pointer rounded-full border border-ink/15 px-3 py-1.5 text-xs font-semibold text-ink/70 hover:border-ink/30">
          {enviando ? "..." : "Escolher"}
          <input type="file" accept="image/*" onChange={handleLogoChange} disabled={enviando} className="hidden" />
        </label>
      </div>
      <label className="flex-1 text-sm font-medium text-ink/80">
        Nova marca
        <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: LS2" className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 text-sm focus:border-blue focus:outline-none" />
      </label>
      <button type="submit" disabled={saving || enviando} className="btn-blue rounded-full px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">
        {saving ? "Salvando..." : "Adicionar"}
      </button>
      {error && <p className="text-sm font-medium text-red-500 sm:ml-3">{error}</p>}
    </form>
  );
}
