"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Banner } from "@/lib/types";
import DeleteButton from "@/components/admin/DeleteButton";

async function salvarBanner(id: string, dados: Partial<Banner>) {
  const response = await fetch(`/api/admin/banners/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  if (!response.ok) throw new Error("Não foi possível salvar o banner.");
}

export default function BannerCard({
  banner,
  vizinhoAnterior,
  vizinhoSeguinte,
}: {
  banner: Banner;
  vizinhoAnterior?: Banner;
  vizinhoSeguinte?: Banner;
}) {
  const router = useRouter();
  const [titulo, setTitulo] = useState(banner.titulo ?? "");
  const [link, setLink] = useState(banner.link ?? "");
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
    handleAction(() => salvarBanner(banner.id, { ativo: !banner.ativo }));
  }

  function salvarTextos() {
    handleAction(() => salvarBanner(banner.id, { titulo: titulo || undefined, link: link || undefined }));
  }

  function mover(direcao: "cima" | "baixo") {
    const vizinho = direcao === "cima" ? vizinhoAnterior : vizinhoSeguinte;
    if (!vizinho) return;
    handleAction(async () => {
      await Promise.all([
        salvarBanner(banner.id, { ordem: vizinho.ordem }),
        salvarBanner(vizinho.id, { ordem: banner.ordem }),
      ]);
    });
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-ink/8 bg-white p-4 shadow-card sm:flex-row sm:items-center">
      <img src={banner.imagem} alt={banner.titulo ?? ""} className="h-20 w-36 shrink-0 rounded-lg object-cover" />

      <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          onBlur={salvarTextos}
          placeholder="Título (opcional)"
          className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm focus:border-blue focus:outline-none sm:w-40"
        />
        <input
          value={link}
          onChange={(e) => setLink(e.target.value)}
          onBlur={salvarTextos}
          placeholder="Link (opcional)"
          className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm focus:border-blue focus:outline-none sm:w-40"
        />
      </div>

      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <label className="flex items-center gap-2 text-xs font-semibold text-ink/70">
          <input type="checkbox" checked={banner.ativo} onChange={toggleAtivo} disabled={salvando} />
          Ativo
        </label>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => mover("cima")}
            disabled={!vizinhoAnterior || salvando}
            aria-label="Mover para cima"
            className="rounded-lg border border-ink/15 px-2 py-1 text-xs text-ink/60 disabled:opacity-30"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => mover("baixo")}
            disabled={!vizinhoSeguinte || salvando}
            aria-label="Mover para baixo"
            className="rounded-lg border border-ink/15 px-2 py-1 text-xs text-ink/60 disabled:opacity-30"
          >
            ↓
          </button>
        </div>

        <DeleteButton url={`/api/admin/banners/${banner.id}`} confirmMessage="Remover este banner?" />
      </div>

      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}
