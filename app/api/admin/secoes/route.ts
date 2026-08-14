import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-session";
import { createSecao } from "@/lib/secoes-db";
import { SecaoHome } from "@/lib/types";

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const secao = (await request.json()) as Omit<SecaoHome, "id" | "ordem">;
  if (!secao.titulo?.trim()) return NextResponse.json({ error: "Dê um nome pra seção." }, { status: 400 });
  if (!secao.produtoSlugs || secao.produtoSlugs.length === 0) {
    return NextResponse.json({ error: "Escolha pelo menos um produto." }, { status: 400 });
  }

  await createSecao(secao);
  return NextResponse.json({ ok: true });
}
