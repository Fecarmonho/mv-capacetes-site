"use client";

import { useState } from "react";
import Link from "next/link";
import { Produto, VarianteProduto } from "@/lib/types";
import StatusEstoqueBadge from "@/components/admin/StatusEstoqueBadge";
import MovimentacaoModal, { AlvoMovimentacao } from "@/components/admin/MovimentacaoModal";

export default function EstoqueTable({
  produtos,
  variantesPorProduto,
}: {
  produtos: Produto[];
  variantesPorProduto: Record<string, VarianteProduto[]>;
}) {
  const [expandido, setExpandido] = useState<Record<string, boolean>>({});
  const [alvo, setAlvo] = useState<AlvoMovimentacao | null>(null);

  return (
    <div className="flex flex-col gap-3">
      {produtos.map((p) => {
        const variantes = variantesPorProduto[p.slug] ?? [];
        const temVariantes = variantes.length > 0;

        return (
          <div key={p.slug} className="rounded-2xl border border-ink/8 bg-white shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="flex items-center gap-3">
                {temVariantes && (
                  <button
                    onClick={() => setExpandido((prev) => ({ ...prev, [p.slug]: !prev[p.slug] }))}
                    className="text-sm text-ink/40"
                    aria-label="Expandir tamanhos"
                  >
                    {expandido[p.slug] ? "▾" : "▸"}
                  </button>
                )}
                <div>
                  <p className="font-medium text-ink">{p.nome}</p>
                  <p className="text-xs text-ink/40">{p.marca} · SKU {p.sku}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <StatusEstoqueBadge estoque={p.quantidadeEstoque} minimo={p.quantidadeMinima} />
                <span className="text-sm font-semibold text-ink">{p.quantidadeEstoque} un.</span>
                <Link href={`/admin/estoque/historico?produto=${p.slug}`} className="text-xs font-semibold text-ink/40 hover:text-ink/70">
                  Histórico
                </Link>
                {!temVariantes && (
                  <button
                    onClick={() => setAlvo({ produtoPaiId: p.slug, produtoNome: p.nome, saldoAtual: p.quantidadeEstoque })}
                    className="rounded-full border border-blue/30 px-3 py-1.5 text-xs font-bold text-blue hover:bg-blue/5"
                  >
                    Movimentar
                  </button>
                )}
              </div>
            </div>

            {temVariantes && expandido[p.slug] && (
              <div className="divide-y divide-ink/5 border-t border-ink/5">
                {variantes.map((v) => (
                  <div key={v.id} className="flex items-center justify-between gap-3 px-4 py-3 pl-10">
                    <span className="text-sm text-ink/70">Tamanho {v.tamanho}</span>
                    <div className="flex items-center gap-3">
                      <StatusEstoqueBadge estoque={v.estoque} minimo={p.quantidadeMinima} />
                      <span className="text-sm font-semibold text-ink">{v.estoque} un.</span>
                      <button
                        onClick={() =>
                          setAlvo({
                            produtoPaiId: p.slug,
                            produtoNome: p.nome,
                            varianteId: v.id,
                            tamanhoLabel: v.tamanho,
                            saldoAtual: v.estoque,
                          })
                        }
                        className="rounded-full border border-blue/30 px-3 py-1.5 text-xs font-bold text-blue hover:bg-blue/5"
                      >
                        Movimentar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {alvo && <MovimentacaoModal alvo={alvo} onClose={() => setAlvo(null)} />}
    </div>
  );
}
