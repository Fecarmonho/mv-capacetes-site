import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-session";
import { deleteMarca, updateMarca } from "@/lib/marcas-db";

export async function PUT(request: NextRequest, { params }: { params: { slug: string } }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const dados = await request.json();
  await updateMarca(params.slug, dados);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: NextRequest, { params }: { params: { slug: string } }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  await deleteMarca(params.slug);
  return NextResponse.json({ ok: true });
}
