import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-session";
import { updateDespesas } from "@/lib/despesas-db";

export async function PUT(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const { valor } = (await request.json()) as { valor: number };
  if (typeof valor !== "number" || valor < 0 || !Number.isFinite(valor)) {
    return NextResponse.json({ error: "Valor inválido." }, { status: 400 });
  }

  await updateDespesas(valor);
  return NextResponse.json({ ok: true });
}
