import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-session";
import { updateCategoria, deleteCategoria } from "@/lib/categorias-db";
import { Categoria } from "@/lib/types";

export async function PUT(request: NextRequest, { params }: { params: { slug: string } }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const categoria = (await request.json()) as Categoria;
  if (!categoria.nome) return NextResponse.json({ error: "Nome é obrigatório." }, { status: 400 });

  await updateCategoria(params.slug, categoria);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: NextRequest, { params }: { params: { slug: string } }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  await deleteCategoria(params.slug);
  return NextResponse.json({ ok: true });
}
