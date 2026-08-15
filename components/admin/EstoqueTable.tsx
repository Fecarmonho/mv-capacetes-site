"use client";

import { useState } from "react";
import Link from "next/link";
import { Produto, VarianteProduto } from "@/lib/types";
import StatusEstoqueBadge from "@/components/admin/StatusEstoqueBadge";
import MovimentacaoModal, { AlvoMovimentacao } from "@/components/admin/MovimentacaoModal";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

function formatBRL(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** Margem sobre o preço de venda — mesma regra do fitmgwear: sem preço de
 * compra cadastrado não dá pra calcular. */
function Margem({ produto }: { produto: Produto }) {
  if (!produto.precoCompra) return null;
  const margem = ((produto.preco - produto.precoCompra) / produto.precoCompra) * 100;
  const cor = margem > 30 ? "bg-emerald-100 text-emerald-700" : margem > 10 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600";
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${cor}`}>{margem.toFixed(0)}% margem</span>;
}

export default function EstoqueTable({
  produtos,
  variantesPorProduto,
}: {
  produtos: Produto[];
  variantesPorProduto: Record<string, VarianteProduto[]>;
}) {
  const [expandido, setExpandido] = useState<Record<string, boolean>>({});
  const [alvo, setAlvo] = useState<AlvoMovimentacao | null>(null);
  const [modo, setModo] = useState<"movimentar" | "vender">("movimentar");

  function abrirMovimentar(novoAlvo: AlvoMovimentacao) {
    setModo("movimentar");
    setAlvo(novoAlvo);
  }
  function abrirVender(novoAlvo: AlvoMovimentacao) {
    setModo("vender");
    setAlvo(novoAlvo);
  }

  return (
    <div className="flex flex-col gap-3">
      {produtos.map((p) => {
        const variantes = variantesPorProduto[p.slug] ?? [];
        const temVariantes = variantes.length > 0;

        return (
          <div key={p.slug} className="rounded-2xl border border-ink/8 bg-white shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="flex min-w-0 flex-wrap items-center gap-3">
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
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${p.tipo === "novo" ? "badge-novo" : "badge-usado"}`}>
                      {p.tipo}
                    </span>
                    <p className="font-medium text-ink">{p.nome}</p>
                    <Margem produto={p} />
                  </div>
                  <p className="text-xs text-ink/40">{p.marca} · {formatBRL(p.precoPromocional ?? p.preco)}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <StatusEstoqueBadge estoque={p.quantidadeEstoque} minimo={p.quantidadeMinima} />
                <span className="text-sm font-semibold text-ink">{p.quantidadeEstoque} un.</span>
                <Link href={`/admin/estoque/historico?produto=${p.slug}`} className="text-xs font-semibold text-ink/40 hover:text-ink/70">
                  Histórico
                </Link>
                {!temVariantes && (
                  <>
                    <button
                      onClick={() => abrirVender({ produtoPaiId: p.slug, produtoNome: p.nome, saldoAtual: p.quantidadeEstoque })}
                      disabled={p.quantidadeEstoque === 0}
                      className="rounded-full border border-emerald-500/30 px-3 py-1.5 text-xs font-bold text-emerald-600 hover:bg-emerald-500/5 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Vender
                    </button>
                    <button
                      onClick={() => abrirMovimentar({ produtoPaiId: p.slug, produtoNome: p.nome, saldoAtual: p.quantidadeEstoque })}
                      className="rounded-full border border-blue/30 px-3 py-1.5 text-xs font-bold text-blue hover:bg-blue/5"
                    >
                      Movimentar
                    </button>
                  </>
                )}
                <Link href={`/admin/produtos/${p.slug}`} className="text-xs font-semibold text-ink/60 hover:text-blue">
                  Editar
                </Link>
                <DeleteProductButton slug={p.slug} nome={p.nome} />
              </div>
            </div>

            {temVariantes && expandido[p.slug] && (
              <div className="divide-y divide-ink/5 border-t border-ink/5">
                {variantes.map((v) => (
                  <div key={v.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 pl-10">
                    <span className="text-sm text-ink/70">Tamanho {v.tamanho}</span>
                    <div className="flex flex-wrap items-center gap-3">
                      <StatusEstoqueBadge estoque={v.estoque} minimo={p.quantidadeMinima} />
                      <span className="text-sm font-semibold text-ink">{v.estoque} un.</span>
                      <button
                        onClick={() =>
                          abrirVender({
                            produtoPaiId: p.slug,
                            produtoNome: p.nome,
                            varianteId: v.id,
                            tamanhoLabel: v.tamanho,
                            saldoAtual: v.estoque,
                          })
                        }
                        disabled={v.estoque === 0}
                        className="rounded-full border border-emerald-500/30 px-3 py-1.5 text-xs font-bold text-emerald-600 hover:bg-emerald-500/5 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Vender
                      </button>
                      <button
                        onClick={() =>
                          abrirMovimentar({
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

      {alvo && (
        <MovimentacaoModal
          alvo={alvo}
          onClose={() => setAlvo(null)}
          titulo={modo === "vender" ? "Registrar venda" : "Movimentar estoque"}
          tipoInicial={modo === "vender" ? "saida" : "entrada"}
          motivoInicial={modo === "vender" ? "Venda" : undefined}
        />
      )}
    </div>
  );
}
