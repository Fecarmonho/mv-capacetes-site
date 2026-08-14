import { NextRequest, NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getAdminSession } from "@/lib/admin-session";

/**
 * Upload de vídeo direto do navegador pro Vercel Blob — vídeo é grande
 * demais pra passar pelo corpo de uma rota de API normal (e não cabe no
 * Firestore como base64, diferente das fotos). Essa rota só autoriza o
 * upload; o arquivo em si vai direto do navegador pro Blob.
 */
export async function POST(request: NextRequest) {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        const session = await getAdminSession();
        if (!session) throw new Error("Não autenticado.");
        return {
          allowedContentTypes: ["video/mp4", "video/webm", "video/quicktime"],
          addRandomSuffix: true,
          maximumSizeInBytes: 50 * 1024 * 1024, // 50MB
        };
      },
      onUploadCompleted: async () => {},
    });

    return NextResponse.json(jsonResponse);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro ao autorizar upload." },
      { status: 400 }
    );
  }
}
