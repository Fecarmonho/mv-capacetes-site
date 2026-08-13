"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Banner } from "@/lib/types";

const AUTOPLAY_MS = 5000;
// Mesma altura em todas as telas (marca e banners), pra não pular de
// tamanho ao deslizar — e com um valor definido também no mobile (antes
// só existia a partir do sm:, então o banner ficava sem altura no celular).
const SLIDE_HEIGHT = "min-h-[380px] sm:min-h-[440px] lg:min-h-[500px]";

/** Primeira tela do carrossel: a marca, com o mesmo tratamento visual
 * (anéis pulsantes, glow, badge) que o Radar de Ofertas usa na tela de
 * abertura, e o título grande no estilo "pôster de vitrine" do fitmgwear. */
function TelaMarca() {
  return (
    <div className={`hero-night hero-grid relative flex w-full shrink-0 items-center overflow-hidden ${SLIDE_HEIGHT}`}>
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col-reverse items-center gap-8 px-6 py-10 sm:flex-row sm:justify-between sm:px-12 lg:px-20">
        <div className="max-w-xl text-center sm:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue/40 bg-blue/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-light">
            <span className="h-2 w-2 animate-blink rounded-full bg-blue-light" />
            Loja de capacetes
          </span>
          <h1 className="mt-4 font-impact text-5xl uppercase leading-[0.9] tracking-wide sm:text-6xl lg:text-7xl">
            Proteção,
            <br />
            <span className="text-blue-light">estilo</span> e atitude
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm text-white/70 sm:mx-0 sm:text-base">
            Capacetes novos e usados, com procedência e curadoria.
          </p>
          <div className="mt-6">
            <Link href="/capacetes" className="btn-blue inline-block rounded-full px-8 py-3.5 font-display text-sm font-bold uppercase tracking-wide text-white">
              Ver capacetes
            </Link>
          </div>
        </div>

        <div className="animate-float-slow relative shrink-0">
          <span className="absolute inset-0 animate-pulse-ring rounded-full border-2 border-blue-light/50" aria-hidden="true" />
          <span
            className="absolute inset-0 animate-pulse-ring rounded-full border-2 border-spark/40"
            style={{ animationDelay: "1.2s" }}
            aria-hidden="true"
          />
          <span className="absolute inset-[-10%] rounded-full bg-blue/25 blur-3xl" aria-hidden="true" />
          <img
            src="/brand/logo.jpg"
            alt="MV Capacetes"
            className="relative w-[140px] rounded-full shadow-glow sm:w-[190px] lg:w-[230px]"
          />
        </div>
      </div>
    </div>
  );
}

/** Tela de banner promocional — foto de fundo em tela cheia (cover) com
 * texto grande sobreposto no estilo das vitrines de moda/moto, no mesmo
 * canto/alinhamento em qualquer tamanho de tela. */
function TelaBanner({ banner }: { banner: Banner }) {
  const Wrapper = banner.link ? Link : "div";
  const temTexto = Boolean(banner.titulo);

  return (
    <Wrapper href={banner.link ?? "#"} className={`relative flex w-full shrink-0 overflow-hidden bg-night ${SLIDE_HEIGHT}`}>
      <img src={banner.imagem} alt={banner.titulo ?? ""} className="absolute inset-0 h-full w-full object-cover" />
      {/* Gradiente da esquerda pro centro — mesmo recurso do fitmgwear pra
          o texto ficar legível em cima de qualquer foto. */}
      <div className="absolute inset-0 bg-gradient-to-t from-night/90 via-night/20 to-transparent sm:bg-gradient-to-r" />

      {temTexto && (
        <div className="relative z-10 flex w-full max-w-6xl flex-col justify-end px-6 pb-8 sm:mx-auto sm:justify-center sm:pb-0 sm:pl-12 lg:pl-20">
          <h2 className="max-w-md font-impact text-4xl uppercase leading-[0.9] tracking-wide text-white sm:text-6xl">
            {banner.titulo}
          </h2>
          {banner.descricao && (
            <p className="mt-3 max-w-sm text-sm text-white/75 sm:text-base">{banner.descricao}</p>
          )}
          {banner.link && (
            <span className="btn-blue mt-5 inline-block w-fit rounded-full px-7 py-3 font-display text-sm font-bold uppercase tracking-wide text-white">
              Ver oferta
            </span>
          )}
        </div>
      )}
    </Wrapper>
  );
}

export default function BannerCarousel({ banners }: { banners: Banner[] }) {
  const totalSlides = 1 + banners.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback((i: number) => setIndex(((i % totalSlides) + totalSlides) % totalSlides), [totalSlides]);
  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (paused || totalSlides <= 1) return;
    timerRef.current = setInterval(next, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [next, paused, totalSlides]);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    const SWIPE_THRESHOLD = 45;
    if (delta > SWIPE_THRESHOLD) prev();
    else if (delta < -SWIPE_THRESHOLD) next();
    touchStartX.current = null;
  }

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Trilho que desliza — todas as telas ficam lado a lado, e a gente
          move o trilho inteiro com transform, criando o efeito de arraste. */}
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        <TelaMarca />
        {banners.map((banner) => (
          <TelaBanner key={banner.id} banner={banner} />
        ))}
      </div>

      {totalSlides > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Tela anterior"
            className="absolute left-2 top-1/2 z-20 flex -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20 active:bg-white/25 sm:left-3 sm:p-2.5"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="sm:h-[18px] sm:w-[18px]">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={next}
            aria-label="Próxima tela"
            className="absolute right-2 top-1/2 z-20 flex -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20 active:bg-white/25 sm:right-3 sm:p-2.5"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="sm:h-[18px] sm:w-[18px]">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1">
            {Array.from({ length: totalSlides }, (_, i) => (
              <button key={i} onClick={() => goTo(i)} aria-label={`Ir para a tela ${i + 1}`} className="p-2">
                <span className={`block h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-white" : "w-1.5 bg-white/50"}`} />
              </button>
            ))}
          </div>

          {!paused && (
            <div className="absolute inset-x-0 bottom-0 z-20 h-0.5 bg-white/10">
              <div
                key={index}
                className="h-full origin-left animate-shrink-x bg-blue-light"
                style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
