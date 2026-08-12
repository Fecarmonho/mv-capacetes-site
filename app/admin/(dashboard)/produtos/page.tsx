import Link from "next/link";
import { getAllProdutos } from "@/lib/produtos-db";
import { getVariantesByProdutos } from "@/lib/variantes-db";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import StatusEstoqueBadge from "@/components/admin/StatusEstoqueBadge";
import VenderButton from "@/components/admin/VenderButton";

export const dynamic = "force-dynamic";

function formatBRL(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function AdminProdutosPage() {
  const produtos = await getAllProdutos();
  const variantesPorProduto = await getVariantesByProdutos(produtos.map((p) => p.slug));

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-2xl font-bold text-ink">Produtos</h1>
        <Link href="/admin/produtos/novo" className="btn-blue rounded-full px-5 py-2.5 text-center text-sm font-bold text-white">
          + Adicionar produto
        </Link>
      </div>

      {produtos.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-ink/15 bg-white p-8 text-center text-sm text-ink/50">
          Nenhum produto ainda. Clique em &quot;Adicionar produto&quot; pra começar.
        </p>
      ) : (
        <>
          {/* Celular: lista de cartões */}
          <div className="flex flex-col gap-3 sm:hidden">
            {produtos.map((p) => (
              <div key={p.slug} className="rounded-2xl border border-ink/8 bg-white p-4 shadow-card">
                <div className="flex items-center justify-between">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${p.tipo === "novo" ? "badge-novo" : "badge-usado"}`}>
                    {p.tipo}
                  </span>
                  <StatusEstoqueBadge estoque={p.quantidadeEstoque} minimo={p.quantidadeMinima} />
                </div>
                <p className="mt-2 font-medium text-ink">{p.nome}</p>
                <p className="mt-1 text-sm text-ink/50">{p.marca} · {formatBRL(p.precoPromocional ?? p.preco)}</p>
                <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-ink/5 pt-3">
                  <Link href={`/admin/produtos/${p.slug}`} className="text-sm font-semibold text-blue">Editar</Link>
                  <DeleteProductButton slug={p.slug} nome={p.nome} />
                  <div className="ml-auto">
                    <VenderButton
                      produtoSlug={p.slug}
                      produtoNome={p.nome}
                      quantidadeEstoque={p.quantidadeEstoque}
                      variantes={variantesPorProduto.get(p.slug)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: tabela */}
          <div className="hidden overflow-x-auto rounded-2xl border border-ink/8 bg-white shadow-card sm:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-ink/8 bg-paper text-xs uppercase tracking-wide text-ink/50">
                <tr>
                  <th className="px-4 py-3">Produto</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Marca</th>
                  <th className="px-4 py-3">Preço</th>
                  <th className="px-4 py-3">Estoque</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map((p) => (
                  <tr key={p.slug} className="border-b border-ink/5 last:border-0">
                    <td className="px-4 py-3 font-medium text-ink">{p.nome}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${p.tipo === "novo" ? "badge-novo" : "badge-usado"}`}>
                        {p.tipo}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink/60">{p.marca}</td>
                    <td className="px-4 py-3 text-ink/60">{formatBRL(p.precoPromocional ?? p.preco)}</td>
                    <td className="px-4 py-3">
                      <StatusEstoqueBadge estoque={p.quantidadeEstoque} minimo={p.quantidadeMinima} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <VenderButton
                          produtoSlug={p.slug}
                          produtoNome={p.nome}
                          quantidadeEstoque={p.quantidadeEstoque}
                          variantes={variantesPorProduto.get(p.slug)}
                        />
                        <Link href={`/admin/produtos/${p.slug}`} className="font-semibold text-blue hover:underline">Editar</Link>
                        <DeleteProductButton slug={p.slug} nome={p.nome} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
