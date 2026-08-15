import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-session";
import { createBanner, getAllBanners } from "@/lib/banners-db";
import { Banner } from "@/lib/types";

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const banner = (await request.json()) as Omit<Banner, "id" | "ordem">;
  if (!banner.imagem && !banner.videoUrl) {
    return NextResponse.json({ error: "Envie uma imagem ou um vídeo." }, { status: 400 });
  }

  const existentes = await getAllBanners();
  await createBanner({ ...banner, ordem: existentes.length });
  return NextResponse.json({ ok: true });
}
