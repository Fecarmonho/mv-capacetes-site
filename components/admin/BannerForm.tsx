"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { processarFoto } from "@/lib/image-compress";

export default function BannerForm() {
  const router = useRouter();
  const [imagem, setImagem] = useState<string | null>(null);
  const [imagemDesktop, setImagemDesktop] = useState<string | null>(null);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [link, setLink] = useState("");
  const [enviando, setEnviando] = useState<"celular" | "desktop" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleImagemChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setEnviando("celular");
    try {
      const { grande } = await processarFoto(file);
      setImagem(grande);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao processar a imagem.");
    } finally {
      setEnviando(null);
    }
  }

  async function handleImagemDesktopChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setEnviando("desktop");
    try {
      const { grande } = await processarFoto(file);
      setImagemDesktop(grande);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao processar a imagem.");
    } finally {
      setEnviando(null);
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
          imagemDesktop: imagemDesktop || undefined,
          titulo: titulo || undefined,
          descricao: descricao || undefined,
          link: link || undefined,
          ativo: true,
        }),
      });
      if (!response.ok) throw new Error("Não foi possível salvar o banner.");
      setImagem(null);
      setImagemDesktop(null);
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <span className="block text-sm font-medium text-ink/80">Imagem do celular (proporção 3:4)</span>
          <div className="mt-1 flex items-center gap-4">
            {imagem ? (
              <img src={imagem} alt="Prévia do banner (celular)" className="h-24 w-[72px] rounded-lg border border-ink/10 object-cover" />
            ) : (
              <div className="flex h-24 w-[72px] items-center justify-center rounded-lg border border-dashed border-ink/15 text-center text-[10px] text-ink/30">Sem imagem</div>
            )}
            <label className="cursor-pointer rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink/70 hover:border-ink/30">
              {enviando === "celular" ? "Processando..." : imagem ? "Trocar" : "Escolher"}
              <input type="file" accept="image/*" onChange={handleImagemChange} disabled={enviando !== null} className="hidden" />
            </label>
          </div>
        </div>

        <div>
          <span className="block text-sm font-medium text-ink/80">Imagem do computador (opcional, formato paisagem)</span>
          <p className="text-[11px] text-ink/40">Sem essa foto, o desktop mostra só o fundo escuro (não usa a do celular).</p>
          <div className="mt-1 flex items-center gap-4">
            {imagemDesktop ? (
              <img src={imagemDesktop} alt="Prévia do banner (desktop)" className="h-20 w-36 rounded-lg border border-ink/10 object-cover" />
            ) : (
              <div className="flex h-20 w-36 items-center justify-center rounded-lg border border-dashed border-ink/15 text-[10px] text-ink/30">Sem imagem</div>
            )}
            <div className="flex flex-col items-start gap-1.5">
              <label className="cursor-pointer rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink/70 hover:border-ink/30">
                {enviando === "desktop" ? "Processando..." : imagemDesktop ? "Trocar" : "Escolher"}
                <input type="file" accept="image/*" onChange={handleImagemDesktopChange} disabled={enviando !== null} className="hidden" />
              </label>
              {imagemDesktop && (
                <button type="button" onClick={() => setImagemDesktop(null)} className="text-xs font-semibold text-ink/40 hover:text-red-500">
                  Remover
                </button>
              )}
            </div>
          </div>
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

      <button type="submit" disabled={saving || enviando !== null} className="btn-blue rounded-full px-6 py-2.5 text-sm font-bold text-white disabled:opacity-60">
        {saving ? "Salvando..." : "Adicionar banner"}
      </button>
    </form>
  );
}
