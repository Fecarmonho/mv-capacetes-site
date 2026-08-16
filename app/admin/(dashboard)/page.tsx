import { getAllProdutos } from "@/lib/produtos-db";
import { contarInteresses } from "@/lib/interesses-db";
import { getDespesas } from "@/lib/despesas-db";
import DespesasCard from "@/components/admin/DespesasCard";

export const dynamic = "force-dynamic";

function formatBRL(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const CORES = {
  blue: "from-blue to-blue-light",
  emerald: "from-emerald-500 to-teal-400",
  amber: "from-amber-500 to-orange-400",
  red: "from-red-500 to-rose-500",
  indigo: "from-indigo-500 to-violet-500",
  pink: "from-pink-500 to-fuchsia-500",
} as const;

function StatCard({
  label,
  value,
  hint,
  cor,
}: {
  label: string;
  value: string | number;
  hint?: string;
  cor: keyof typeof CORES;
}) {
  return (
    <div className={`rounded-2xl bg-gradient-to-br ${CORES[cor]} p-5 text-white shadow-card`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-white/70">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold">{value}</p>
      {hint && <p className="mt-1 text-xs text-white/70">{hint}</p>}
    </div>
  );
}

export default async function AdminDashboardPage() {
  const [produtos, interesses, despesas] = await Promise.all([
    getAllProdutos(),
    contarInteresses(),
    getDespesas(),
  ]);

  const novos = produtos.filter((p) => p.tipo === "novo").length;
  const usados = produtos.filter((p) => p.tipo === "usado").length;
  const semEstoque = produtos.filter((p) => p.quantidadeEstoque === 0).length;
  const valorEstoque = produtos.reduce((soma, p) => soma + p.quantidadeEstoque * (p.precoPromocional ?? p.preco), 0);

  const recentes = [...produtos].sort((a, b) => b.dataCadastro.localeCompare(a.dataCadastro)).slice(0, 5);

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-ink">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard label="Total de produtos" value={produtos.length} cor="blue" />
        <StatCard label="Novos" value={novos} cor="emerald" />
        <StatCard label="Usados" value={usados} cor="amber" />
        <StatCard label="Sem estoque" value={semEstoque} hint="🔴" cor="red" />
        <StatCard label="Valor em estoque" value={formatBRL(valorEstoque)} cor="indigo" />
        <StatCard label="Interesses recebidos" value={interesses} hint="cliques em 'Tenho interesse'" cor="pink" />
        <DespesasCard valorInicial={despesas} />
      </div>
      <div className="mt-8 grid grid-cols-1 gap-6">
        <div className="rounded-2xl border border-ink/8 bg-white p-5 shadow-card">
          <h2 className="mb-4 font-display text-lg font-bold text-ink">Cadastrados recentemente</h2>
          {recentes.length === 0 ? (
            <p className="text-sm text-ink/40">Nenhum produto cadastrado ainda.</p>
          ) : (
            <ul className="divide-y divide-ink/5">
              {recentes.map((p) => (
                <li key={p.slug} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-ink">{p.nome}</p>
                    <p className="text-xs text-ink/40">{p.marca}</p>
                  </div>
                  <span className="text-sm font-semibold text-ink">{formatBRL(p.precoPromocional ?? p.preco)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
