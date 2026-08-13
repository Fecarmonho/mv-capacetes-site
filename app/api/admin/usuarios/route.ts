import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { getAdminSession } from "@/lib/admin-session";
import { createAdminRecord, getAllAdmins } from "@/lib/admins-db";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const admins = await getAllAdmins();
  return NextResponse.json({ admins });
}

/** POST — adiciona mais um usuário com acesso ao painel. Diferente do
 * bootstrap (que só funciona sem nenhum admin cadastrado), essa rota
 * exige uma sessão de admin válida — qualquer um já logado pode convidar
 * outro. */
export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const { name, email, password } = await request.json();
  if (!name || !email || !password || password.length < 6) {
    return NextResponse.json(
      { error: "Preencha nome, email e uma senha com pelo menos 6 caracteres." },
      { status: 400 }
    );
  }

  try {
    let uid: string;
    try {
      const userRecord = await adminAuth.createUser({ email, password, displayName: name });
      uid = userRecord.uid;
    } catch (err: any) {
      if (err?.code !== "auth/email-already-exists") throw err;
      const existingUser = await adminAuth.getUserByEmail(email);
      uid = existingUser.uid;
    }

    await createAdminRecord({ uid, name, email, createdAt: new Date().toISOString() });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    const message = err instanceof Error ? err.message : "Não foi possível criar o usuário.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
