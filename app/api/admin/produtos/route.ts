import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-session";
import { createProduto } from "@/lib/produtos-db";
import { createVariante } from "@/lib/variantes-db";
import { setFotosExtras } from "@/lib/fotos-db";
import { Produto, FotoProduto } from "@/lib/types";

interface Payload {
  produto: Produto;
  variantes: { tamanho: string; estoque: number }[];
  /** Capa (fid "capa", com a versão em alta) + fotos extras, nessa ordem. */
  fotos: FotoProduto[];
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const { produto, variantes, fotos } = (await request.json()) as Payload;

  if (!produto.slug || !produto.nome || !produto.preco) {
    return NextResponse.json({ error: "Campos obrigatórios faltando." }, { status: 400 });
  }

  try {
    const quantidadeEstoque =
      variantes.length > 0
        ? variantes.reduce((soma, v) => soma + v.estoque, 0)
        : produto.quantidadeEstoque;

    await createProduto({
      ...produto,
      quantidadeEstoque,
      totalFotos: fotos.length,
    });

    for (const variante of variantes) {
      await createVariante(produto.slug, variante.tamanho, variante.estoque);
    }
    await setFotosExtras(produto.slug, fotos);

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro ao criar produto." },
      { status: 400 }
    );
  }
}
