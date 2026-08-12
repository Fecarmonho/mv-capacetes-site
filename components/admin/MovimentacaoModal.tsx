"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MOTIVOS_ENTRADA, MOTIVOS_SAIDA, TipoMovimentacao } from "@/lib/types";

export interface AlvoMovimentacao {
  produtoPaiId: string;
  produtoNome: string;
  varianteId?: string;
  tamanhoLabel?: string;
  saldoAtual: number;
}

export default function MovimentacaoModal({
  alvo,
  onClose,
  titulo = "Movimentar estoque",
  tipoInicial = "entrada",
  motivoInicial,
}: {
  alvo: AlvoMovimentacao;
  onClose: () => void;
  titulo?: string;
  tipoInicial?: TipoMovimentacao;
  motivoInicial?: string;
}) {
  const router = useRouter();
  const [tipo, setTipo] = useState<TipoMovimentacao>(tipoInicial);
  const [quantidade, setQuantidade] = useState(1);
  const [motivo, setMotivo] = useState<string>(
    motivoInicial ?? (tipoInicial === "entrada" ? MOTIVOS_ENTRADA[0] : MOTIVOS_SAIDA[0])
  );
  const [observacao, setObservacao] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const motivos = tipo === "entrada" ? MOTIVOS_ENTRADA : MOTIVOS_SAIDA;

  function trocarTipo(novoTipo: TipoMovimentacao) {
    setTipo(novoTipo);
    setMotivo(novoTipo === "entrada" ? MOTIVOS_ENTRADA[0] : MOTIVOS_SAIDA[0]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (quantidade <= 0) {
      setError("A quantidade precisa ser maior que zero.");
      return;
    }
    if (tipo === "saida" && quantidade > alvo.saldoAtual) {
      setError(`Saldo atual é ${alvo.saldoAtual}. Não é possível dar saída de ${quantidade}.`);
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/admin/estoque/movimentar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          produtoPaiId: alvo.produtoPaiId,
          varianteId: alvo.varianteId,
          tipo,
          quantidade,
          motivo,
          observacao: observacao || undefined,
        }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? "Não foi possível registrar a movimentação.");
      }
      router.refresh();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 text-sm focus:border-blue focus:outline-none";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <form onSubmit={handleSubmit} className="relative w-full max-w-sm rounded-t-3xl bg-white p-6 sm:rounded-2xl">
        <p className="font-display text-lg font-bold text-ink">{titulo}</p>
        <p className="mt-1 text-sm text-ink/50">
          {alvo.produtoNome}
          {alvo.tamanhoLabel && ` — Tamanho ${alvo.tamanhoLabel}`}
          {" · "}Saldo atual: <strong className="text-ink">{alvo.saldoAtual}</strong>
        </p>

        <div className="mt-4 flex gap-2">
          <button type="button" onClick={() => trocarTipo("entrada")} className={`flex-1 rounded-full border px-3 py-2 text-sm font-bold ${tipo === "entrada" ? "border-emerald-500 bg-emerald-500/10 text-emerald-600" : "border-ink/15 text-ink/50"}`}>
            + Entrada
          </button>
          <button type="button" onClick={() => trocarTipo("saida")} className={`flex-1 rounded-full border px-3 py-2 text-sm font-bold ${tipo === "saida" ? "border-red-500 bg-red-500/10 text-red-600" : "border-ink/15 text-ink/50"}`}>
            − Saída
          </button>
        </div>

        <label className="mt-4 block text-sm font-medium text-ink/80">
          Quantidade
          <input type="number" min={1} value={quantidade} onChange={(e) => setQuantidade(parseInt(e.target.value) || 0)} className={inputClass} />
        </label>

        <label className="mt-4 block text-sm font-medium text-ink/80">
          Motivo
          <select value={motivo} onChange={(e) => setMotivo(e.target.value)} className={inputClass}>
            {motivos.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </label>

        <label className="mt-4 block text-sm font-medium text-ink/80">
          Observação (opcional)
          <textarea rows={2} value={observacao} onChange={(e) => setObservacao(e.target.value)} className={inputClass} />
        </label>

        {error && <p className="mt-3 text-sm font-medium text-red-500">{error}</p>}

        <div className="mt-6 flex gap-3">
          <button type="submit" disabled={saving} className="btn-blue flex-1 rounded-full px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">
            {saving ? "Salvando..." : "Confirmar"}
          </button>
          <button type="button" onClick={onClose} className="rounded-full border border-ink/15 px-5 py-2.5 text-sm font-semibold text-ink/70">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
