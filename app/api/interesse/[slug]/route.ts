import { NextRequest, NextResponse } from "next/server";
import { getProdutoBySlug } from "@/lib/produtos-db";
import { getConfiguracoes } from "@/lib/config-db";
import { registrarInteresse } from "@/lib/interesses-db";
import { buildWhatsappUrl } from "@/lib/whatsapp";

/**
 * Ponte de contato: registra o clique (pra aparecer no dashboard) e só
 * depois redireciona pro WhatsApp da loja — assim o número real nunca
 * precisa estar espalhado feito link direto pelo site, e dá pra medir
 * quantos "tenho interesse" cada produto recebeu.
 */
export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const produto = await getProdutoBySlug(params.slug);
  if (!produto) return NextResponse.redirect(new URL("/capacetes", request.url));

  await registrarInteresse(produto.slug, produto.nome).catch(() => {});

  const config = await getConfiguracoes();
  if (!config.whatsapp) {
    // Loja ainda não configurou o WhatsApp — manda pra página do produto
    // em vez de quebrar o clique do cliente.
    return NextResponse.redirect(new URL(`/capacetes/${produto.slug}`, request.url));
  }

  const mensagem = `Olá! Tenho interesse no capacete ${produto.nome} (${produto.tipo === "usado" ? "usado" : "novo"}).`;
  return NextResponse.redirect(buildWhatsappUrl(config.whatsapp, mensagem));
}
