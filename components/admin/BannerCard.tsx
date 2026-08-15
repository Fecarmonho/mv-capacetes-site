"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import { Banner } from "@/lib/types";
import DeleteButton from "@/components/admin/DeleteButton";
import { processarFoto } from "@/lib/image-compress";

const VIDEO_MAX_MB = 50;

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
  const [descricao, setDescricao] = useState(banner.descricao ?? "");
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

  async function trocarImagem(e: React.ChangeEvent<HTMLInputElement>, campo: "imagem" | "imagemDesktop") {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    handleAction(async () => {
      const { grande } = await processarFoto(file);
      await salvarBanner(banner.id, { [campo]: grande });
    });
  }

  function removerImagemDesktop() {
    handleAction(() => salvarBanner(banner.id, { imagemDesktop: "" }));
  }

  function trocarVideo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > VIDEO_MAX_MB * 1024 * 1024) {
      setError(`Vídeo muito grande — o máximo é ${VIDEO_MAX_MB}MB.`);
      return;
    }
    handleAction(async () => {
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/admin/banners/upload-video",
      });
      await salvarBanner(banner.id, { videoUrl: blob.url });
    });
  }

  function removerVideo() {
    handleAction(() => salvarBanner(banner.id, { videoUrl: "" }));
  }

  function toggleAtivo() {
    handleAction(() => salvarBanner(banner.id, { ativo: !banner.ativo }));
  }

  function salvarTextos() {
    handleAction(() =>
      salvarBanner(banner.id, {
        titulo: titulo || undefined,
        descricao: descricao || undefined,
        link: link || undefined,
      })
    );
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
      <div className="flex shrink-0 gap-2">
        <div className="flex flex-col items-center gap-1">
          {banner.imagem ? (
            <img src={banner.imagem} alt={banner.titulo ?? ""} className="h-20 w-[60px] rounded-lg object-cover" />
          ) : (
            <div className="flex h-20 w-[60px] items-center justify-center rounded-lg border border-dashed border-ink/15 text-center text-[9px] text-ink/30">
              Sem foto
            </div>
          )}
          <label className="cursor-pointer text-[10px] font-semibold text-blue hover:underline">
            Celular
            <input type="file" accept="image/*" onChange={(e) => trocarImagem(e, "imagem")} disabled={salvando} className="hidden" />
          </label>
        </div>
        <div className="flex flex-col items-center gap-1">
          {banner.imagemDesktop ? (
            <img src={banner.imagemDesktop} alt="" className="h-20 w-28 rounded-lg object-cover" />
          ) : (
            <div className="flex h-20 w-28 items-center justify-center rounded-lg border border-dashed border-ink/15 text-center text-[9px] text-ink/30">
              Sem foto
            </div>
          )}
          <div className="flex items-center gap-2">
            <label className="cursor-pointer text-[10px] font-semibold text-blue hover:underline">
              Desktop
              <input type="file" accept="image/*" onChange={(e) => trocarImagem(e, "imagemDesktop")} disabled={salvando} className="hidden" />
            </label>
            {banner.imagemDesktop && (
              <button type="button" onClick={removerImagemDesktop} disabled={salvando} className="text-[10px] font-semibold text-ink/40 hover:text-red-500">
                Remover
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          {banner.videoUrl ? (
            <video src={banner.videoUrl} muted loop autoPlay playsInline className="h-20 w-28 rounded-lg object-cover" />
          ) : (
            <div className="flex h-20 w-28 items-center justify-center rounded-lg border border-dashed border-ink/15 text-center text-[9px] text-ink/30">
              Sem vídeo
            </div>
          )}
          <div className="flex items-center gap-2">
            <label className="cursor-pointer text-[10px] font-semibold text-blue hover:underline">
              Vídeo
              <input type="file" accept="video/mp4,video/webm,video/quicktime" onChange={trocarVideo} disabled={salvando} className="hidden" />
            </label>
            {banner.videoUrl && (
              <button type="button" onClick={removerVideo} disabled={salvando} className="text-[10px] font-semibold text-ink/40 hover:text-red-500">
                Remover
              </button>
            )}
          </div>
        </div>
      </div>

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
        <input
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          onBlur={salvarTextos}
          placeholder="Descrição (opcional)"
          className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm focus:border-blue focus:outline-none sm:w-48"
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
