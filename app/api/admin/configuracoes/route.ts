import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-session";
import { updateConfiguracoes } from "@/lib/config-db";
import { ConfiguracoesLoja } from "@/lib/types";

export async function PUT(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const config = (await request.json()) as ConfiguracoesLoja;
  if (!config.nomeLoja) return NextResponse.json({ error: "Nome da loja é obrigatório." }, { status: 400 });

  await updateConfiguracoes(config);
  return NextResponse.json({ ok: true });
}
