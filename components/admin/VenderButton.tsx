"use client";

import { useState } from "react";
import { VarianteProduto } from "@/lib/types";
import MovimentacaoModal, { AlvoMovimentacao } from "@/components/admin/MovimentacaoModal";

export default function VenderButton({
  produtoSlug,
  produtoNome,
  quantidadeEstoque,
  variantes = [],
}: {
  produtoSlug: string;
  produtoNome: string;
  quantidadeEstoque: number;
  variantes?: VarianteProduto[];
}) {
  const [varianteId, setVarianteId] = useState(variantes[0]?.id ?? "");
  const [alvo, setAlvo] = useState<AlvoMovimentacao | null>(null);

  const temVariantes = variantes.length > 0;
  const varianteSelecionada = variantes.find((v) => v.id === varianteId);
  const semEstoque = temVariantes ? variantes.every((v) => v.estoque === 0) : quantidadeEstoque === 0;

  function abrir() {
    if (temVariantes) {
      if (!varianteSelecionada) return;
      setAlvo({
        produtoPaiId: produtoSlug,
        produtoNome,
        varianteId: varianteSelecionada.id,
        tamanhoLabel: varianteSelecionada.tamanho,
        saldoAtual: varianteSelecionada.estoque,
      });
    } else {
      setAlvo({ produtoPaiId: produtoSlug, produtoNome, saldoAtual: quantidadeEstoque });
    }
  }

  return (
    <>
      <div className="flex items-center gap-1.5">
        {temVariantes && (
          <select
            value={varianteId}
            onChange={(e) => setVarianteId(e.target.value)}
            className="rounded-lg border border-ink/15 px-1.5 py-1 text-xs"
          >
            {variantes.map((v) => (
              <option key={v.id} value={v.id} disabled={v.estoque === 0}>
                {v.tamanho} ({v.estoque})
              </option>
            ))}
          </select>
        )}
        <button
          type="button"
          onClick={abrir}
          disabled={semEstoque}
          title={semEstoque ? "Sem estoque" : "Registrar venda"}
          className="rounded-full border border-emerald-500/30 px-3 py-1.5 text-xs font-bold text-emerald-600 hover:bg-emerald-500/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Vender
        </button>
      </div>

      {alvo && (
        <MovimentacaoModal
          alvo={alvo}
          onClose={() => setAlvo(null)}
          titulo="Registrar venda"
          tipoInicial="saida"
          motivoInicial="Venda"
        />
      )}
    </>
  );
}
