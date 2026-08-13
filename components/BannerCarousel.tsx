"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Banner } from "@/lib/types";

const AUTOPLAY_MS = 5000;

/** Primeira tela do carrossel: a marca, com o mesmo tratamento visual
 * (anéis pulsantes, glow, badge) que o Radar de Ofertas usa na tela de
 * abertura — troca só o conteúdo/logo. As demais telas são os banners
 * promocionais cadastrados no admin. */
function TelaMarca() {
  return (
    <div className="hero-night hero-grid flex w-full shrink-0 flex-col-reverse items-center justify-center gap-6 px-6 py-10 pb-14 sm:min-h-[420px] sm:flex-row sm:justify-between sm:px-16 sm:py-16 sm:pb-16 lg:min-h-[480px] lg:px-24">
      <div className="max-w-lg text-center sm:text-left">
        <span className="inline-flex items-center gap-2 rounded-full border border-blue/40 bg-blue/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-light">
          <span className="h-2 w-2 animate-blink rounded-full bg-blue-light" />
          Loja de capacetes
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold leading-tight sm:mt-5 sm:text-5xl lg:text-6xl">
          Proteção, estilo e <span className="text-blue-light">atitude</span> pra sua moto
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-white/70 sm:mx-0 sm:mt-4 sm:text-base">
          Capacetes novos e usados, com procedência e curadoria.
        </p>
        <div className="mt-5 sm:mt-6">
          <Link href="/capacetes" className="btn-blue inline-block rounded-full px-7 py-3 font-display text-sm font-bold text-white sm:px-8 sm:py-3.5 sm:text-base">
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
          className="relative w-[150px] rounded-full shadow-glow sm:w-[200px] lg:w-[240px]"
        />
      </div>
    </div>
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

        {banners.map((banner) => {
          const Wrapper = banner.link ? Link : "div";
          return (
            <Wrapper
              key={banner.id}
              href={banner.link ?? "#"}
              className="relative flex w-full shrink-0 items-end sm:min-h-[420px] lg:min-h-[480px]"
            >
              <img src={banner.imagem} alt={banner.titulo ?? ""} className="absolute inset-0 h-full w-full object-cover" />
              {banner.titulo && (
                <div className="relative flex w-full items-end bg-gradient-to-t from-night/80 to-transparent p-6 sm:min-h-[420px] lg:min-h-[480px]">
                  <p className="font-display text-xl font-bold text-white sm:text-2xl">{banner.titulo}</p>
                </div>
              )}
            </Wrapper>
          );
        })}
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
