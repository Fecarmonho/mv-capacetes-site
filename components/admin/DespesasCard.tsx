"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function formatBRL(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function DespesasCard({ valorInicial }: { valorInicial: number }) {
  const router = useRouter();
  const [editando, setEditando] = useState(false);
  const [texto, setTexto] = useState(String(valorInicial));
  const [salvando, setSalvando] = useState(false);

  function abrirEdicao() {
    setTexto(String(valorInicial));
    setEditando(true);
  }

  async function salvar() {
    const valor = Number(texto.replace(",", "."));
    if (Number.isNaN(valor) || valor < 0) return;

    setSalvando(true);
    try {
      await fetch("/api/admin/despesas", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ valor }),
      });
      setEditando(false);
      router.refresh();
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 p-5 text-white shadow-card">
      <p className="text-xs font-semibold uppercase tracking-wide text-white/70">Despesas do mês</p>
      {editando ? (
        <div className="mt-2 flex items-center gap-2">
          <input
            type="text"
            inputMode="decimal"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            autoFocus
            className="w-full rounded-lg bg-white/20 px-2 py-1 font-display text-xl font-bold text-white placeholder-white/50 outline-none"
          />
          <button
            onClick={salvar}
            disabled={salvando}
            className="rounded-lg bg-white/25 px-3 py-1.5 text-xs font-bold hover:bg-white/35 disabled:opacity-50"
          >
            OK
          </button>
        </div>
      ) : (
        <button onClick={abrirEdicao} className="mt-2 block text-left">
          <span className="font-display text-3xl font-bold">{formatBRL(valorInicial)}</span>
          <span className="ml-2 text-xs text-white/70">editar</span>
        </button>
      )}
    </div>
  );
}
