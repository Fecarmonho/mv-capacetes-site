import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProdutoBySlug } from "@/lib/produtos-db";
import { getVariantesByProduto } from "@/lib/variantes-db";
import { getFotosExtras } from "@/lib/fotos-db";
import ProductGallery from "@/components/ProductGallery";

export const revalidate = 60;

function formatBRL(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const produto = await getProdutoBySlug(params.slug);
  if (!produto) return {};
  return {
    title: produto.nome,
    description: produto.descricao.slice(0, 155),
  };
}

export default async function ProdutoPage({ params }: { params: { slug: string } }) {
  const produto = await getProdutoBySlug(params.slug);
  if (!produto) notFound();

  const [variantes, fotos] = await Promise.all([
    getVariantesByProduto(produto.slug),
    getFotosExtras(produto.slug),
  ]);

  const semEstoque = produto.status === "vendido" || produto.status === "esgotado" || produto.quantidadeEstoque === 0;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ProductGallery fotos={fotos} capaFallback={produto.imagemUrl} nome={produto.nome} />

        <div>
          <span className={`inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${produto.tipo === "novo" ? "badge-novo" : "badge-usado"}`}>
            {produto.tipo}
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold text-ink">{produto.nome}</h1>
          <p className="mt-1 text-sm font-medium text-ink/50">{produto.marca} · {produto.modelo}</p>

          <div className="mt-5">
            {produto.precoPromocional ? (
              <>
                <span className="block text-sm text-ink/40 line-through">{formatBRL(produto.preco)}</span>
                <span className="font-display text-4xl font-extrabold text-blue">{formatBRL(produto.precoPromocional)}</span>
              </>
            ) : (
              <span className="font-display text-4xl font-extrabold text-ink">{formatBRL(produto.preco)}</span>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-2 text-sm">
            {produto.cor && <span className="rounded-full bg-paper px-3 py-1 text-ink/70">Cor: {produto.cor}</span>}
            {variantes.length === 0 && produto.tamanho && (
              <span className="rounded-full bg-paper px-3 py-1 text-ink/70">Tamanho: {produto.tamanho}</span>
            )}
          </div>

          {variantes.length > 0 && (
            <div className="mt-5">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink/50">Tamanhos disponíveis</p>
              <div className="flex flex-wrap gap-2">
                {variantes.map((v) => (
                  <span
                    key={v.id}
                    className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${
                      v.estoque > 0 ? "border-ink/15 text-ink/80" : "border-ink/10 text-ink/30 line-through"
                    }`}
                  >
                    {v.tamanho}
                  </span>
                ))}
              </div>
            </div>
          )}

          <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-ink/70">{produto.descricao}</p>

          {produto.caracteristicas.length > 0 && (
            <ul className="mt-5 grid grid-cols-1 gap-2 text-sm text-ink/70 sm:grid-cols-2">
              {produto.caracteristicas.map((c, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-blue">✓</span> {c}
                </li>
              ))}
            </ul>
          )}

          {produto.tipo === "usado" && (
            <div className="mt-6 rounded-2xl border border-blue/20 bg-blue/[0.04] p-5">
              <p className="font-display text-sm font-bold text-ink">Sobre a conservação</p>
              <dl className="mt-3 space-y-2 text-sm text-ink/70">
                {produto.estadoConservacao && (
                  <div className="flex justify-between"><dt>Estado</dt><dd className="font-semibold text-ink">{produto.estadoConservacao}</dd></div>
                )}
                {produto.tempoUso && (
                  <div className="flex justify-between"><dt>Tempo de uso</dt><dd className="font-semibold text-ink">{produto.tempoUso}</dd></div>
                )}
                {produto.acessoriosInclusos && (
                  <div className="flex justify-between"><dt>Acessórios</dt><dd className="font-semibold text-ink">{produto.acessoriosInclusos}</dd></div>
                )}
              </dl>
              {produto.observacoesUsado && <p className="mt-3 text-sm text-ink/60">{produto.observacoesUsado}</p>}
            </div>
          )}

          <div className="mt-8">
            {semEstoque ? (
              <span className="block rounded-full bg-ink/5 px-6 py-3 text-center text-sm font-bold text-ink/40">
                {produto.status === "vendido" ? "Produto vendido" : "Indisponível no momento"}
              </span>
            ) : (
              <a
                href={`/api/interesse/${produto.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-blue block rounded-full px-6 py-3.5 text-center font-display font-bold text-white"
              >
                Tenho interesse — falar no WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
