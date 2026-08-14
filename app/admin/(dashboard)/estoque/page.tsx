import Link from "next/link";
import { getAllProdutos } from "@/lib/produtos-db";
import { getVariantesByProdutos } from "@/lib/variantes-db";
import EstoqueTable from "@/components/admin/EstoqueTable";

export const dynamic = "force-dynamic";

export default async function AdminEstoquePage() {
  const produtos = await getAllProdutos();
  const variantesMap = await getVariantesByProdutos(produtos.map((p) => p.slug));
  const variantesPorProduto = Object.fromEntries(variantesMap);

  const semEstoque = produtos.filter((p) => p.quantidadeEstoque === 0).length;
  const estoqueBaixo = produtos.filter((p) => p.quantidadeEstoque > 0 && p.quantidadeEstoque <= p.quantidadeMinima).length;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Estoque</h1>
          <p className="mt-1 text-sm text-ink/50">
            🟡 {estoqueBaixo} com estoque baixo · 🔴 {semEstoque} sem estoque
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/estoque/historico" className="rounded-full border border-ink/15 px-5 py-2.5 text-center text-sm font-semibold text-ink/70 hover:border-ink/30">
            Ver histórico
          </Link>
          <Link href="/admin/produtos/novo" className="btn-blue rounded-full px-5 py-2.5 text-center text-sm font-bold text-white">
            + Adicionar produto
          </Link>
        </div>
      </div>

      {produtos.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-ink/15 bg-white p-8 text-center text-sm text-ink/50">
          Nenhum produto ainda. Clique em &quot;Adicionar produto&quot; pra começar.
        </p>
      ) : (
        <EstoqueTable produtos={produtos} variantesPorProduto={variantesPorProduto} />
      )}
    </div>
  );
}
