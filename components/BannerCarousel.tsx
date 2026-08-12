"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Banner } from "@/lib/types";

const AUTOPLAY_MS = 5000;

export default function BannerCarousel({ banners }: { banners: Banner[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback(
    (i: number) => setIndex(((i % banners.length) + banners.length) % banners.length),
    [banners.length]
  );
  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (paused || banners.length <= 1) return;
    timerRef.current = setInterval(next, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [next, paused, banners.length]);

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

  if (banners.length === 0) return null;

  return (
    <div
      className="relative aspect-[16/7] w-full overflow-hidden sm:aspect-[21/7]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Trilho que desliza — todos os banners ficam lado a lado, e a gente
          move o trilho inteiro com transform, criando o efeito de arraste. */}
      <div
        className="flex h-full transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {banners.map((banner, i) => {
          const Wrapper = banner.link ? Link : "div";
          return (
            <Wrapper key={banner.id} href={banner.link ?? "#"} className="relative block h-full w-full shrink-0">
              <img src={banner.imagem} alt={banner.titulo ?? ""} className="h-full w-full object-cover" />
              {banner.titulo && (
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-night/70 to-transparent p-6">
                  <p className="font-display text-xl font-bold text-white sm:text-2xl">{banner.titulo}</p>
                </div>
              )}
            </Wrapper>
          );
        })}
      </div>

      {banners.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Banner anterior"
            className="absolute left-2 top-1/2 z-20 flex -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20 active:bg-white/25 sm:left-3 sm:p-2.5"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="sm:h-[18px] sm:w-[18px]">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={next}
            aria-label="Próximo banner"
            className="absolute right-2 top-1/2 z-20 flex -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20 active:bg-white/25 sm:right-3 sm:p-2.5"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="sm:h-[18px] sm:w-[18px]">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1">
            {banners.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} aria-label={`Ir para o banner ${i + 1}`} className="p-2">
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
