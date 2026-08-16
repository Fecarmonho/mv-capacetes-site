"use client";

import { useRef, useState } from "react";
import { FotoProduto } from "@/lib/types";

interface EstadoZoom {
  scale: number;
  x: number;
  y: number;
  originX: number;
  originY: number;
}

const ZOOM_PADRAO: EstadoZoom = { scale: 1, x: 0, y: 0, originX: 50, originY: 50 };
const ZOOM_TOQUE_DUPLO = 2.4;
const ZOOM_MAX = 4;

export default function ProductGallery({
  fotos,
  capaFallback,
  nome,
}: {
  /** Capa (fid "capa") + fotos extras, nessa ordem. */
  fotos: FotoProduto[];
  /** Usado só se `fotos` não tiver a capa (produto de seed antigo, por exemplo). */
  capaFallback: string;
  nome: string;
}) {
  const todas = fotos.some((f) => f.fid === "capa")
    ? fotos
    : [{ fid: "capa", mini: capaFallback, grande: capaFallback }, ...fotos];
  const [ativa, setAtiva] = useState(0);
  const [zoom, setZoom] = useState<EstadoZoom>(ZOOM_PADRAO);

  const pinchRef = useRef<{ dist: number; scale: number } | null>(null);
  const panRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const ultimoTapRef = useRef(0);

  // ── PC: passa o mouse e amplia seguindo o cursor (lupa de e-commerce). ──
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    setZoom({
      scale: 2.2,
      x: 0,
      y: 0,
      originX: ((e.clientX - rect.left) / rect.width) * 100,
      originY: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }

  // ── Celular: pinça com dois dedos pra ampliar, um dedo pra arrastar
  //     quando já tiver ampliado, toque duplo pra alternar rápido. Mouse
  //     não tem pinça, então os dois modos não se atrapalham. ──
  function distanciaToques(touches: React.TouchList) {
    const [a, b] = [touches[0], touches[1]];
    return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  }

  function handleTouchStart(e: React.TouchEvent<HTMLDivElement>) {
    if (e.touches.length === 2) {
      pinchRef.current = { dist: distanciaToques(e.touches), scale: zoom.scale };
      return;
    }
    if (e.touches.length !== 1) return;

    if (zoom.scale > 1) {
      panRef.current = { startX: e.touches[0].clientX, startY: e.touches[0].clientY, origX: zoom.x, origY: zoom.y };
      return;
    }

    const agora = Date.now();
    if (agora - ultimoTapRef.current < 300) {
      const rect = e.currentTarget.getBoundingClientRect();
      setZoom({
        scale: ZOOM_TOQUE_DUPLO,
        x: 0,
        y: 0,
        originX: ((e.touches[0].clientX - rect.left) / rect.width) * 100,
        originY: ((e.touches[0].clientY - rect.top) / rect.height) * 100,
      });
    }
    ultimoTapRef.current = agora;
  }

  function handleTouchMove(e: React.TouchEvent<HTMLDivElement>) {
    if (e.touches.length === 2 && pinchRef.current) {
      e.preventDefault();
      const nova = distanciaToques(e.touches);
      const escala = Math.min(ZOOM_MAX, Math.max(1, pinchRef.current.scale * (nova / pinchRef.current.dist)));
      setZoom((z) => ({ ...z, scale: escala }));
      return;
    }
    if (e.touches.length === 1 && panRef.current) {
      e.preventDefault();
      const dx = e.touches[0].clientX - panRef.current.startX;
      const dy = e.touches[0].clientY - panRef.current.startY;
      setZoom((z) => ({ ...z, x: panRef.current!.origX + dx, y: panRef.current!.origY + dy }));
    }
  }

  function handleTouchEnd(e: React.TouchEvent<HTMLDivElement>) {
    pinchRef.current = null;
    panRef.current = null;
    if (e.touches.length === 0) {
      setZoom((z) => (z.scale <= 1.02 ? ZOOM_PADRAO : z));
    }
  }

  function selecionarFoto(i: number) {
    setAtiva(i);
    setZoom(ZOOM_PADRAO);
  }

  return (
    <div>
      <div
        className="aspect-square touch-none select-none overflow-hidden rounded-2xl border border-ink/8 bg-gradient-to-br from-paper to-ink/5"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setZoom(ZOOM_PADRAO)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={todas[ativa]?.grande ?? capaFallback}
          alt={nome}
          className="h-full w-full object-contain p-3 transition-transform duration-150 ease-out sm:p-4"
          style={{
            transform: `translate(${zoom.x}px, ${zoom.y}px) scale(${zoom.scale})`,
            transformOrigin: `${zoom.originX}% ${zoom.originY}%`,
          }}
        />
      </div>
      {todas.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto">
          {todas.map((foto, i) => (
            <button
              key={foto.fid}
              onClick={() => selecionarFoto(i)}
              className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 ${i === ativa ? "border-blue" : "border-ink/10"}`}
            >
              <img src={foto.mini} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
