import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-session";
import { registrarMovimentacao } from "@/lib/movimentacoes-db";

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const { produtoPaiId, varianteId, tipo, quantidade, motivo, observacao } = await request.json();

  if (!produtoPaiId || !tipo || !quantidade || !motivo) {
    return NextResponse.json({ error: "Preencha tipo, quantidade e motivo." }, { status: 400 });
  }

  try {
    await registrarMovimentacao({
      produtoPaiId,
      varianteId: varianteId || undefined,
      tipo,
      quantidade: Number(quantidade),
      motivo,
      observacao: observacao || undefined,
      usuarioEmail: session.email ?? "desconhecido",
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro ao registrar movimentação." },
      { status: 400 }
    );
  }
}
