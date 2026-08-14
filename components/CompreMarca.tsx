"use client";

import { useState } from "react";
import Link from "next/link";
import { Marca } from "@/lib/types";

const TIPOS = [
  { value: "novo", label: "Novos" },
  { value: "usado", label: "Usados" },
] as const;

type Tipo = (typeof TIPOS)[number]["value"];

/** Primeira seção da home: escolhe a condição (novo/usado) e clica na
 * marca — os dois filtros vão juntos pro catálogo. Só mostra marca que
 * realmente tem capacete daquela condição cadastrado agora (troca a
 * lista inteira ao alternar Novos/Usados). */
export default function CompreMarca({ marcasPorTipo }: { marcasPorTipo: Record<Tipo, Marca[]> }) {
  const [tipo, setTipo] = useState<Tipo>("novo");
  const marcas = marcasPorTipo[tipo];

  if (marcasPorTipo.novo.length === 0 && marcasPorTipo.usado.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-xs font-bold uppercase tracking-widest text-blue">Compre por marca</p>
      <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">Escolha a marca e a condição</h2>
        <div className="inline-flex w-fit rounded-full border border-ink/10 bg-white p-1 shadow-card">
          {TIPOS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setTipo(opt.value)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                tipo === opt.value ? "bg-blue text-white" : "text-ink/60 hover:text-ink"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {marcas.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-ink/15 bg-white p-8 text-center text-sm text-ink/50">
          Nenhum capacete {tipo === "novo" ? "novo" : "usado"} cadastrado no momento.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {marcas.map((m) => (
            <Link
              key={m.slug}
              href={`/capacetes?marca=${encodeURIComponent(m.nome)}&tipo=${tipo}`}
              className="group flex flex-col items-center gap-2 rounded-2xl border border-ink/8 bg-white p-4 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover sm:p-5"
            >
              <div className="flex h-12 w-full items-center justify-center sm:h-14">
                {m.logo ? (
                  <img src={m.logo} alt={m.nome} className="h-full w-full object-contain opacity-90 transition-opacity group-hover:opacity-100" />
                ) : (
                  <span className="font-display text-xl font-bold text-ink/20">{m.nome[0]}</span>
                )}
              </div>
              <span className="text-center text-xs font-semibold text-ink/70 transition-colors group-hover:text-blue sm:text-sm">
                {m.nome}
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
