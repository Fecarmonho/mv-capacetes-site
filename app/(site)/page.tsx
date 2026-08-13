import Link from "next/link";
import { getAllProdutos } from "@/lib/produtos-db";
import { getVariantesByProdutos } from "@/lib/variantes-db";
import { getAllCategorias } from "@/lib/categorias-db";
import { getAllMarcas } from "@/lib/marcas-db";
import { getBannersAtivos } from "@/lib/banners-db";
import ProductCarousel from "@/components/ProductCarousel";
import BannerCarousel from "@/components/BannerCarousel";
import BrandCards from "@/components/BrandCards";
import { Produto } from "@/lib/types";

export const revalidate = 60;

export default async function HomePage() {
  const [todosProdutos, categorias, marcas, banners] = await Promise.all([
    getAllProdutos(),
    getAllCategorias(),
    getAllMarcas(),
    getBannersAtivos(),
  ]);

  const produtos = todosProdutos.filter((p) => p.status === "ativo" || p.status === "esgotado");
  const variantesPorProduto = await getVariantesByProdutos(produtos.map((p) => p.slug));

  const destaques = produtos.filter((p) => p.destaque).slice(0, 10);
  const novos = produtos.filter((p) => p.tipo === "novo").slice(0, 10);
  const usados = produtos.filter((p) => p.tipo === "usado").slice(0, 10);

  function comVariantes(lista: Produto[]) {
    return lista.map((produto) => ({ produto, variantes: variantesPorProduto.get(produto.slug) }));
  }

  const categoriasComEstoque = categorias
    .map((c) => ({ ...c, total: produtos.filter((p) => p.categoria === c.slug).length }))
    .filter((c) => c.total > 0);

  // Só entra no destaque de marcas quem realmente tem capacete disponível
  // agora — deixa de aparecer sozinho quando o estoque zera.
  const marcasComEstoque = marcas.filter((m) =>
    produtos.some((p) => p.marca === m.nome && p.quantidadeEstoque > 0 && p.status === "ativo")
  );

  return (
    <main>
      {/* ── CARROSSEL (a 1ª tela é a marca; as demais são os banners
          cadastrados no admin) ──────────────────────────────────── */}
      <BannerCarousel banners={banners} />

      {/* ── CATEGORIAS ───────────────────────────────────── */}
      {categoriasComEstoque.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">Categorias</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {categoriasComEstoque.map((c) => (
              <Link
                key={c.slug}
                href={`/capacetes?categoria=${c.slug}`}
                className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-ink/8 bg-white p-6 text-center shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
              >
                <span className="font-display text-base font-bold text-ink group-hover:text-blue">{c.nome}</span>
                <span className="text-xs text-ink/40">{c.total} capacete{c.total > 1 ? "s" : ""}</span>
              </Link>
            ))}
            <Link
              href="/capacetes?tipo=usado"
              className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-steel/30 bg-steel/10 p-6 text-center shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
            >
              <span className="font-display text-base font-bold text-ink">Usados</span>
              <span className="text-xs text-ink/40">{usados.length} capacete{usados.length !== 1 ? "s" : ""}</span>
            </Link>
          </div>
        </section>
      )}

      {/* ── DESTAQUES ────────────────────────────────────── */}
      {destaques.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-6">
          <p className="text-xs font-bold uppercase tracking-widest text-blue">Selecionados pra você</p>
          <h2 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">Capacetes em destaque</h2>
          <div className="mt-6">
            <ProductCarousel itens={comVariantes(destaques)} />
          </div>
        </section>
      )}

      {/* ── NOVOS ────────────────────────────────────────── */}
      {novos.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-10">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">Capacetes Novos</h2>
            <Link href="/capacetes?tipo=novo" className="text-sm font-semibold text-blue hover:underline">Ver todos</Link>
          </div>
          <ProductCarousel itens={comVariantes(novos)} />
        </section>
      )}

      {/* ── USADOS ───────────────────────────────────────── */}
      {usados.length > 0 && (
        <section className="border-y border-ink/5 bg-steel/[0.06] py-10">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-ink/40">Selecionados e revisados</p>
                <h2 className="mt-1 font-display text-2xl font-bold text-ink sm:text-3xl">Capacetes Usados</h2>
              </div>
              <Link href="/capacetes?tipo=usado" className="text-sm font-semibold text-blue hover:underline">Ver todos</Link>
            </div>
            <ProductCarousel itens={comVariantes(usados)} />
          </div>
        </section>
      )}

      {/* ── MARCAS ───────────────────────────────────────── */}
      <BrandCards marcas={marcasComEstoque} />

      {/* ── CTA FINAL ────────────────────────────────────── */}
      <section className="hero-night relative overflow-hidden py-16 text-center text-white">
        <div className="hero-grid absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-2xl px-4">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Encontre o capacete <span className="text-blue-light">certo</span> pra sua moto
          </h2>
          <p className="mt-3 text-white/70">Novos e usados, com curadoria de verdade. Fale com a gente.</p>
          <Link href="/capacetes" className="btn-blue mt-8 inline-block rounded-full px-8 py-4 font-display font-bold text-white">
            Explorar catálogo
          </Link>
        </div>
      </section>
    </main>
  );
}
