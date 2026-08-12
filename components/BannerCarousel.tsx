"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Banner } from "@/lib/types";

export default function BannerCarousel({ banners }: { banners: Banner[] }) {
  const [ativo, setAtivo] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const id = setInterval(() => setAtivo((i) => (i + 1) % banners.length), 5000);
    return () => clearInterval(id);
  }, [banners.length]);

  if (banners.length === 0) return null;

  const banner = banners[ativo];
  const Wrapper = banner.link ? Link : "div";

  return (
    <div className="relative aspect-[16/7] w-full overflow-hidden sm:aspect-[21/7]">
      <Wrapper href={banner.link ?? "#"} className="block h-full w-full">
        <img src={banner.imagem} alt={banner.titulo ?? ""} className="h-full w-full object-cover" />
        {banner.titulo && (
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-night/70 to-transparent p-6">
            <p className="font-display text-xl font-bold text-white sm:text-2xl">{banner.titulo}</p>
          </div>
        )}
      </Wrapper>

      {banners.length > 1 && (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setAtivo(i)}
              aria-label={`Banner ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === ativo ? "w-6 bg-white" : "w-1.5 bg-white/50"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
