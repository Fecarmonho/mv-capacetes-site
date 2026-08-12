import Link from "next/link";
import { getAllProdutos } from "@/lib/produtos-db";
import { contarInteresses } from "@/lib/interesses-db";
import StatusEstoqueBadge from "@/components/admin/StatusEstoqueBadge";

export const dynamic = "force-dynamic";

function formatBRL(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-2xl border border-ink/8 bg-white p-5 shadow-card">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold text-ink">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink/40">{hint}</p>}
    </div>
  );
}

export default async function AdminDashboardPage() {
  const [produtos, interesses] = await Promise.all([getAllProdutos(), contarInteresses()]);

  const novos = produtos.filter((p) => p.tipo === "novo").length;
  const usados = produtos.filter((p) => p.tipo === "usado").length;
  const disponiveis = produtos.filter((p) => p.status === "ativo" && p.quantidadeEstoque > 0).length;
  const semEstoque = produtos.filter((p) => p.quantidadeEstoque === 0).length;
  const estoqueBaixo = produtos.filter((p) => p.quantidadeEstoque > 0 && p.quantidadeEstoque <= p.quantidadeMinima).length;
  const valorEstoque = produtos.reduce((soma, p) => soma + p.quantidadeEstoque * (p.precoPromocional ?? p.preco), 0);

  const recentes = [...produtos].sort((a, b) => b.dataCadastro.localeCompare(a.dataCadastro)).slice(0, 5);
  const alertaEstoque = produtos.filter((p) => p.quantidadeEstoque <= p.quantidadeMinima).slice(0, 5);

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-ink">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard label="Total de produtos" value={produtos.length} />
        <StatCard label="Novos" value={novos} />
        <StatCard label="Usados" value={usados} />
        <StatCard label="Disponíveis" value={disponiveis} />
        <StatCard label="Sem estoque" value={semEstoque} hint="🔴" />
        <StatCard label="Estoque baixo" value={estoqueBaixo} hint="🟡" />
        <StatCard label="Valor em estoque" value={formatBRL(valorEstoque)} />
        <StatCard label="Interesses recebidos" value={interesses} hint="cliques em 'Tenho interesse'" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-ink/8 bg-white p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-display text-base font-bold text-ink">Cadastrados recentemente</p>
            <Link href="/admin/produtos" className="text-xs font-semibold text-blue">Ver todos</Link>
          </div>
          {recentes.length === 0 ? (
            <p className="text-sm text-ink/40">Nenhum produto cadastrado ainda.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {recentes.map((p) => (
                <li key={p.slug} className="flex items-center justify-between text-sm">
                  <Link href={`/admin/produtos/${p.slug}`} className="font-medium text-ink hover:text-blue">{p.nome}</Link>
                  <span className="text-ink/40">{new Date(p.dataCadastro).toLocaleDateString("pt-BR")}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-ink/8 bg-white p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-display text-base font-bold text-ink">Alertas de estoque</p>
            <Link href="/admin/estoque" className="text-xs font-semibold text-blue">Gerenciar</Link>
          </div>
          {alertaEstoque.length === 0 ? (
            <p className="text-sm text-ink/40">Tudo certo — nenhum produto com estoque baixo.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {alertaEstoque.map((p) => (
                <li key={p.slug} className="flex items-center justify-between text-sm">
                  <Link href={`/admin/produtos/${p.slug}`} className="font-medium text-ink hover:text-blue">{p.nome}</Link>
                  <StatusEstoqueBadge estoque={p.quantidadeEstoque} minimo={p.quantidadeMinima} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
