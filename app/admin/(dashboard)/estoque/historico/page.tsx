import Link from "next/link";
import { getHistoricoMovimentacoes } from "@/lib/movimentacoes-db";

export const dynamic = "force-dynamic";

function formatData(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

export default async function HistoricoEstoquePage({
  searchParams,
}: {
  searchParams: { produto?: string };
}) {
  const movimentacoes = await getHistoricoMovimentacoes(searchParams.produto);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Histórico de movimentações</h1>
          {searchParams.produto && (
            <p className="mt-1 text-sm text-ink/50">
              Filtrado por produto ·{" "}
              <Link href="/admin/estoque/historico" className="font-semibold text-blue">
                limpar filtro
              </Link>
            </p>
          )}
        </div>
        <Link href="/admin/estoque" className="rounded-full border border-ink/15 px-5 py-2.5 text-sm font-semibold text-ink/70 hover:border-ink/30">
          Voltar
        </Link>
      </div>

      {movimentacoes.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-ink/15 bg-white p-8 text-center text-sm text-ink/50">
          Nenhuma movimentação registrada ainda.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-ink/8 bg-white shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink/8 bg-paper text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Produto</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Qtd.</th>
                <th className="px-4 py-3">Motivo</th>
                <th className="px-4 py-3">Saldo</th>
                <th className="px-4 py-3">Usuário</th>
              </tr>
            </thead>
            <tbody>
              {movimentacoes.map((m) => (
                <tr key={m.id} className="border-b border-ink/5 last:border-0">
                  <td className="whitespace-nowrap px-4 py-3 text-ink/60">{formatData(m.data)}</td>
                  <td className="px-4 py-3 font-medium text-ink">
                    {m.produtoNome}
                    {m.tamanhoLabel && <span className="text-ink/40"> ({m.tamanhoLabel})</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${m.tipo === "entrada" ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"}`}>
                      {m.tipo}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-ink">{m.tipo === "entrada" ? "+" : "-"}{m.quantidade}</td>
                  <td className="px-4 py-3 text-ink/60">{m.motivo}{m.observacao && <span className="text-ink/40"> — {m.observacao}</span>}</td>
                  <td className="px-4 py-3 text-ink/60">{m.saldoAnterior} → {m.saldoNovo}</td>
                  <td className="px-4 py-3 text-ink/40">{m.usuarioEmail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
