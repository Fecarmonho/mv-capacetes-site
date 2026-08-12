import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-session";
import { updateProduto, deleteProduto, getProdutoBySlug } from "@/lib/produtos-db";
import {
  getVariantesByProduto,
  createVariante,
  updateVariante,
  deleteVariante,
} from "@/lib/variantes-db";
import { setFotosExtras } from "@/lib/fotos-db";
import { Produto, FotoProduto } from "@/lib/types";

interface Payload {
  produto: Produto;
  /** Variantes existentes (com id) continuam com o mesmo id — o saldo de
   * estoque delas NÃO é alterado aqui, só tamanho/remoção. Ajuste de
   * quantidade é sempre feito em /admin/estoque, pra ficar no histórico. */
  variantes: { id?: string; tamanho: string; estoque: number }[];
  /** Capa (fid "capa", com a versão em alta) + fotos extras, nessa ordem. */
  fotos: FotoProduto[];
}

export async function PUT(request: NextRequest, { params }: { params: { slug: string } }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const { produto, variantes, fotos } = (await request.json()) as Payload;

  if (!produto.nome || !produto.sku || !produto.preco) {
    return NextResponse.json({ error: "Campos obrigatórios faltando." }, { status: 400 });
  }

  try {
    const existentes = await getVariantesByProduto(params.slug);
    const idsRecebidos = new Set(variantes.filter((v) => v.id).map((v) => v.id));

    // Remove variantes que não vieram mais no payload.
    for (const existente of existentes) {
      if (!idsRecebidos.has(existente.id)) await deleteVariante(existente.id);
    }
    // Atualiza tamanho das que continuam, cria as novas (com estoque
    // inicial só quando realmente é nova — variante existente nunca tem o
    // estoque sobrescrito por aqui).
    for (const variante of variantes) {
      if (variante.id) {
        await updateVariante(variante.id, { tamanho: variante.tamanho });
      } else {
        await createVariante(params.slug, variante.tamanho, variante.estoque);
      }
    }

    const quantidadeEstoque =
      variantes.length > 0
        ? (await getVariantesByProduto(params.slug)).reduce((s, v) => s + v.estoque, 0)
        : produto.quantidadeEstoque;

    await updateProduto(params.slug, {
      ...produto,
      slug: params.slug,
      quantidadeEstoque,
      totalFotos: fotos.length,
      dataAtualizacao: new Date().toISOString(),
    });

    await setFotosExtras(params.slug, fotos);

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro ao salvar produto." },
      { status: 400 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { slug: string } }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const produto = await getProdutoBySlug(params.slug);
  if (!produto) return NextResponse.json({ error: "Produto não encontrado." }, { status: 404 });

  const variantes = await getVariantesByProduto(params.slug);
  for (const variante of variantes) await deleteVariante(variante.id);
  await setFotosExtras(params.slug, []);
  await deleteProduto(params.slug);

  return NextResponse.json({ ok: true });
}
