import Link from "next/link";
import { getAllProdutos } from "@/lib/produtos-db";
import { getVariantesByProdutos } from "@/lib/variantes-db";
import { getAllMarcas } from "@/lib/marcas-db";
import { getBannersAtivos } from "@/lib/banners-db";
import { getConfiguracoes } from "@/lib/config-db";
import ProductCarousel from "@/components/ProductCarousel";
import BannerCarousel from "@/components/BannerCarousel";
import MarqueeStrip from "@/components/MarqueeStrip";
import CompreMarca from "@/components/CompreMarca";
import { Produto } from "@/lib/types";

export const revalidate = 60;

export default async function HomePage() {
  const [todosProdutos, marcas, banners, config] = await Promise.all([
    getAllProdutos(),
    getAllMarcas(),
    getBannersAtivos(),
    getConfiguracoes(),
  ]);

  const produtos = todosProdutos.filter((p) => p.status === "ativo" || p.status === "esgotado");
  const variantesPorProduto = await getVariantesByProdutos(produtos.map((p) => p.slug));

  const destaques = produtos.filter((p) => p.destaque).slice(0, 10);
  const novos = produtos.filter((p) => p.tipo === "novo").slice(0, 10);
  const usados = produtos.filter((p) => p.tipo === "usado").slice(0, 10);

  function comVariantes(lista: Produto[]) {
    return lista.map((produto) => ({ produto, variantes: variantesPorProduto.get(produto.slug) }));
  }

  // Marcas separadas por condição — o toggle "Compre por marca" só mostra
  // quem realmente tem capacete daquele tipo disponível agora (se não tiver
  // nenhum usado cadastrado, por exemplo, a lista de "Usados" fica vazia).
  const marcasPorTipo = {
    novo: marcas.filter((m) => produtos.some((p) => p.marca === m.nome && p.tipo === "novo" && p.quantidadeEstoque > 0 && p.status === "ativo")),
    usado: marcas.filter((m) => produtos.some((p) => p.marca === m.nome && p.tipo === "usado" && p.quantidadeEstoque > 0 && p.status === "ativo")),
  };

  return (
    <main>
      {/* ── CARROSSEL (a 1ª tela é a marca; as demais são os banners
          cadastrados no admin) ──────────────────────────────────── */}
      <BannerCarousel banners={banners} />
      <MarqueeStrip />

      {/* ── COMPRE POR MARCA (logo abaixo do carrossel: escolhe novo/usado
          e a marca, direto pro catálogo já filtrado) ────────────────── */}
      <CompreMarca marcasPorTipo={marcasPorTipo} />

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

      {/* ── QUEM SOMOS ───────────────────────────────────── */}
      {config.quemSomosHistoria && (
        <section className="mx-auto max-w-6xl px-4 py-14">
          <p className="text-xs font-bold uppercase tracking-widest text-blue">Quem somos</p>
          <div className="mt-6 flex flex-col items-center gap-6 rounded-3xl border border-ink/8 bg-white p-8 text-center shadow-card sm:flex-row sm:gap-10 sm:p-12 sm:text-left">
            {config.quemSomosFoto ? (
              <img
                src={config.quemSomosFoto}
                alt={config.quemSomosNome}
                className="h-36 w-36 shrink-0 rounded-full object-cover shadow-glow sm:h-48 sm:w-48"
              />
            ) : (
              <div className="flex h-36 w-36 shrink-0 items-center justify-center rounded-full border border-dashed border-ink/15 text-xs text-ink/30 sm:h-48 sm:w-48">
                Foto em breve
              </div>
            )}
            <div>
              <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">{config.quemSomosNome}</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink/60 sm:text-base">
                {config.quemSomosHistoria}
              </p>
            </div>
          </div>
        </section>
      )}

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
