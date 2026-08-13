"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { processarFoto } from "@/lib/image-compress";

export default function BannerForm() {
  const router = useRouter();
  const [imagem, setImagem] = useState<string | null>(null);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [link, setLink] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleImagemChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setEnviando(true);
    try {
      const { grande } = await processarFoto(file);
      setImagem(grande);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao processar a imagem.");
    } finally {
      setEnviando(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!imagem) {
      setError("Envie a imagem do banner.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/admin/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imagem,
          titulo: titulo || undefined,
          descricao: descricao || undefined,
          link: link || undefined,
          ativo: true,
        }),
      });
      if (!response.ok) throw new Error("Não foi possível salvar o banner.");
      setImagem(null);
      setTitulo("");
      setDescricao("");
      setLink("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 text-sm focus:border-blue focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-ink/8 bg-white p-6 shadow-card">
      <div>
        <span className="block text-sm font-medium text-ink/80">Imagem (recomendado: formato paisagem, 16:9 ou similar)</span>
        <div className="mt-1 flex items-center gap-4">
          {imagem ? (
            <img src={imagem} alt="Prévia do banner" className="h-20 w-36 rounded-lg border border-ink/10 object-cover" />
          ) : (
            <div className="flex h-20 w-36 items-center justify-center rounded-lg border border-dashed border-ink/15 text-[10px] text-ink/30">Sem imagem</div>
          )}
          <label className="cursor-pointer rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink/70 hover:border-ink/30">
            {enviando ? "Processando..." : imagem ? "Trocar imagem" : "Escolher imagem"}
            <input type="file" accept="image/*" onChange={handleImagemChange} disabled={enviando} className="hidden" />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-ink/80">
          Título (opcional)
          <input value={titulo} onChange={(e) => setTitulo(e.target.value)} className={inputClass} />
        </label>
        <label className="text-sm font-medium text-ink/80">
          Link (opcional)
          <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="/capacetes" className={inputClass} />
        </label>
      </div>

      <label className="block text-sm font-medium text-ink/80">
        Descrição (opcional — linha curta abaixo do título)
        <input value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Ex: Só até domingo, aproveite" className={inputClass} />
      </label>

      {error && <p className="text-sm font-medium text-red-500">{error}</p>}

      <button type="submit" disabled={saving || enviando} className="btn-blue rounded-full px-6 py-2.5 text-sm font-bold text-white disabled:opacity-60">
        {saving ? "Salvando..." : "Adicionar banner"}
      </button>
    </form>
  );
}
