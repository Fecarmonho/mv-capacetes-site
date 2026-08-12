import { Metadata } from "next";
import { getAllProdutos } from "@/lib/produtos-db";
import { getVariantesByProdutos } from "@/lib/variantes-db";
import { getAllCategorias } from "@/lib/categorias-db";
import { getAllMarcas } from "@/lib/marcas-db";
import ProductFilters from "@/components/ProductFilters";
import ProductCard from "@/components/ProductCard";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Capacetes novos e usados",
  description: "Catálogo completo de capacetes novos e usados da MV Capacetes.",
};

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const [todosProdutos, categorias, marcas] = await Promise.all([
    getAllProdutos(),
    getAllCategorias(),
    getAllMarcas(),
  ]);

  const produtosVisiveis = todosProdutos.filter((p) => p.status !== "inativo");
  const variantesPorProduto = await getVariantesByProdutos(produtosVisiveis.map((p) => p.slug));

  const tamanhos = Array.from(
    new Set(
      produtosVisiveis.flatMap((p) => {
        const vars = variantesPorProduto.get(p.slug) ?? [];
        return vars.length > 0 ? vars.map((v) => v.tamanho) : p.tamanho ? [p.tamanho] : [];
      })
    )
  ).sort();
  const cores = Array.from(new Set(produtosVisiveis.map((p) => p.cor).filter(Boolean))).sort();

  let produtos = produtosVisiveis;

  if (searchParams.tipo) produtos = produtos.filter((p) => p.tipo === searchParams.tipo);
  if (searchParams.marca) produtos = produtos.filter((p) => p.marca === searchParams.marca);
  if (searchParams.categoria) produtos = produtos.filter((p) => p.categoria === searchParams.categoria);
  if (searchParams.cor) produtos = produtos.filter((p) => p.cor === searchParams.cor);
  if (searchParams.tamanho) {
    produtos = produtos.filter((p) => {
      const vars = variantesPorProduto.get(p.slug) ?? [];
      return vars.length > 0 ? vars.some((v) => v.tamanho === searchParams.tamanho) : p.tamanho === searchParams.tamanho;
    });
  }
  if (searchParams.precoMin) {
    const min = parseFloat(searchParams.precoMin);
    produtos = produtos.filter((p) => (p.precoPromocional ?? p.preco) >= min);
  }
  if (searchParams.precoMax) {
    const max = parseFloat(searchParams.precoMax);
    produtos = produtos.filter((p) => (p.precoPromocional ?? p.preco) <= max);
  }
  if (searchParams.disponivel === "1") {
    produtos = produtos.filter((p) => p.quantidadeEstoque > 0 && p.status === "ativo");
  }

  switch (searchParams.ordenar) {
    case "menor-preco":
      produtos = [...produtos].sort((a, b) => (a.precoPromocional ?? a.preco) - (b.precoPromocional ?? b.preco));
      break;
    case "maior-preco":
      produtos = [...produtos].sort((a, b) => (b.precoPromocional ?? b.preco) - (a.precoPromocional ?? a.preco));
      break;
    case "destaques":
      produtos = [...produtos].sort((a, b) => Number(b.destaque ?? false) - Number(a.destaque ?? false));
      break;
    default:
      produtos = [...produtos].sort((a, b) => b.dataCadastro.localeCompare(a.dataCadastro));
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-blue">Catálogo</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">Capacetes</h1>
        <p className="mt-2 text-sm text-ink/50">{produtos.length} capacete(s) encontrado(s)</p>
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        <ProductFilters categorias={categorias} marcas={marcas} tamanhos={tamanhos} cores={cores} />

        <div className="flex-1">
          {produtos.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-ink/15 bg-white p-10 text-center text-sm text-ink/50">
              Nenhum capacete encontrado com esses filtros.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
              {produtos.map((p) => (
                <ProductCard key={p.slug} produto={p} variantes={variantesPorProduto.get(p.slug)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
