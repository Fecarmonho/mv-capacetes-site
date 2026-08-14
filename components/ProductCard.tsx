import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { Produto, VarianteProduto } from "@/lib/types";

function formatBRL(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function ProductCard({ produto, variantes = [] }: { produto: Produto; variantes?: VarianteProduto[] }) {
  const semEstoque = produto.status === "vendido" || produto.status === "esgotado" || produto.quantidadeEstoque === 0;
  const tamanhoLabel =
    variantes.length > 0
      ? `Tamanhos: ${variantes.map((v) => v.tamanho).join(", ")}`
      : produto.tamanho
        ? `Tamanho: ${produto.tamanho}`
        : null;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-ink/8 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      <span className="absolute inset-x-0 top-0 z-10 h-1 bg-gradient-to-r from-spark via-blue to-blue-deep opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <Link href={`/capacetes/${produto.slug}`} className="block">
        <div className="relative aspect-square bg-gradient-to-br from-paper to-ink/5">
          {produto.imagemUrl ? (
            <>
              <img
                src={produto.imagemUrl}
                alt={produto.nome}
                className="h-full w-full object-contain p-4 transition-opacity duration-300 sm:p-6"
              />
              {/* Segunda foto por cima, escondida — aparece com o mouse em
                  cima do card, dando a impressão do capacete girando (mesmo
                  recurso de vitrine online que a Adrenalina Motos usa). */}
              {produto.imagemHoverUrl && (
                <img
                  src={produto.imagemHoverUrl}
                  alt=""
                  className="absolute inset-0 h-full w-full object-contain p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:p-6"
                />
              )}
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-ink/30">Foto em breve</div>
          )}

          <span
            className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide sm:left-3 sm:top-3 sm:px-3 sm:py-1 sm:text-[11px] ${
              produto.tipo === "novo" ? "bg-blue text-white" : "bg-steel text-ink"
            }`}
          >
            {produto.tipo}
          </span>

          {semEstoque && (
            <span className="absolute inset-0 flex items-center justify-center bg-night/60">
              <span className="rounded-full bg-night px-3 py-1 text-[11px] font-bold uppercase text-white">
                {produto.status === "vendido" ? "Vendido" : "Indisponível"}
              </span>
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-3 sm:gap-2.5 sm:p-5">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-ink/40 sm:text-xs">{produto.marca}</span>

        <Link href={`/capacetes/${produto.slug}`}>
          <h3 className="font-display text-sm font-bold leading-snug text-ink transition-colors group-hover:text-blue sm:text-lg">
            {produto.nome}
          </h3>
        </Link>

        {tamanhoLabel && <p className="text-xs text-ink/50">{tamanhoLabel}</p>}

        {/* Preço sempre numa linha própria, botões embaixo — com preço +
            2 botões (WhatsApp + Ver produto), colocar tudo lado a lado
            ficava apertado nos cards mais estreitos (carrossel de 280px),
            mesmo em telas largas. */}
        <div className="mt-auto flex flex-col gap-2 pt-2 sm:gap-2.5 sm:pt-4">
          <div className="leading-tight">
            {produto.precoPromocional ? (
              <>
                <span className="block text-[10px] text-ink/40 line-through">{formatBRL(produto.preco)}</span>
                <span className="font-display text-lg font-extrabold text-blue sm:text-2xl">{formatBRL(produto.precoPromocional)}</span>
              </>
            ) : (
              <span className="font-display text-lg font-extrabold text-ink sm:text-2xl">{formatBRL(produto.preco)}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!semEstoque && (
              <a
                href={`/api/interesse/${produto.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Comprar no WhatsApp"
                title="Comprar no WhatsApp"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white transition-transform hover:scale-105 sm:h-10 sm:w-10"
              >
                <FaWhatsapp className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
            )}
            <Link
              href={`/capacetes/${produto.slug}`}
              className="btn-blue flex flex-1 items-center justify-center whitespace-nowrap rounded-full px-3 py-2 text-xs font-bold text-white sm:py-2.5 sm:text-sm"
            >
              Ver produto
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
