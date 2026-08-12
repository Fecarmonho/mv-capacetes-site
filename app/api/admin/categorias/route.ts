import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-session";
import { createCategoria } from "@/lib/categorias-db";
import { Categoria } from "@/lib/types";

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const categoria = (await request.json()) as Omit<Categoria, "ordem">;
  if (!categoria.slug || !categoria.nome) {
    return NextResponse.json({ error: "Nome é obrigatório." }, { status: 400 });
  }

  try {
    await createCategoria(categoria);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro ao criar categoria." },
      { status: 400 }
    );
  }
}
