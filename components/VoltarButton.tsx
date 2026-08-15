"use client";

import { useRouter } from "next/navigation";

/** Volta pra tela anterior de verdade (histórico do navegador) — se a
 * pessoa chegou aqui direto de um link compartilhado, sem histórico pra
 * voltar, cai no catálogo em vez de travar num botão que não faz nada. */
export default function VoltarButton() {
  const router = useRouter();

  function handleClick() {
    if (window.history.length > 1) router.back();
    else router.push("/capacetes");
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="mb-6 flex items-center gap-1.5 text-sm font-semibold text-ink/60 hover:text-blue"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 18l-6-6 6-6" />
      </svg>
      Voltar
    </button>
  );
}
