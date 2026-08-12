import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-session";
import { deleteMarca } from "@/lib/marcas-db";

export async function DELETE(_request: NextRequest, { params }: { params: { slug: string } }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  await deleteMarca(params.slug);
  return NextResponse.json({ ok: true });
}
