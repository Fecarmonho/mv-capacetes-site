"use client";

import { useState } from "react";
import Link from "next/link";

export default function MobileNav({ links }: { links: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button onClick={() => setOpen(true)} aria-label="Abrir menu" className="rounded-lg border border-white/15 px-3 py-1.5 text-white/80">
        ☰
      </button>
      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="hero-night absolute inset-y-0 right-0 flex w-64 flex-col gap-1 p-5">
            <button onClick={() => setOpen(false)} aria-label="Fechar menu" className="mb-4 self-end rounded-lg border border-white/15 px-2.5 py-1 text-white/80">
              ✕
            </button>
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/5">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
