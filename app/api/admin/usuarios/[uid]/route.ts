import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-session";
import { countAdmins, deleteAdminRecord } from "@/lib/admins-db";

/** DELETE — remove o acesso de um usuário ao painel (não apaga a conta do
 * Firebase Auth, só o documento em `admins`; ver lib/admins-db.ts). Nunca
 * pode remover a si mesmo nem o último admin restante — senão ninguém
 * mais consegue entrar no painel. */
export async function DELETE(_request: NextRequest, { params }: { params: { uid: string } }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  if (params.uid === session.uid) {
    return NextResponse.json({ error: "Você não pode remover seu próprio acesso." }, { status: 400 });
  }

  const total = await countAdmins();
  if (total <= 1) {
    return NextResponse.json({ error: "Não é possível remover o único usuário do painel." }, { status: 400 });
  }

  await deleteAdminRecord(params.uid);
  return NextResponse.json({ ok: true });
}
