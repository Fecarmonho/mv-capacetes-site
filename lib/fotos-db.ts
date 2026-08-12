/**
 * Fotos de um produto além da capa (que viaja dentro do próprio doc de
 * produto, em `imagemUrl`). Guardadas à parte porque a listagem/catálogo
 * baixa todos os produtos de uma vez — não faz sentido carregar todas as
 * fotos extras junto; elas só são buscadas quando alguém abre a página do
 * produto.
 */
import "server-only";
import { adminDb } from "@/lib/firebase-admin";
import { FotoProduto } from "@/lib/types";

const COLLECTION = "produtoFotos";

export async function getFotosExtras(produtoId: string): Promise<FotoProduto[]> {
  const doc = await adminDb.collection(COLLECTION).doc(produtoId).get();
  if (!doc.exists) return [];
  return (doc.data()?.fotos as FotoProduto[]) ?? [];
}

export async function setFotosExtras(produtoId: string, fotos: FotoProduto[]): Promise<void> {
  if (fotos.length === 0) {
    await adminDb.collection(COLLECTION).doc(produtoId).delete();
    return;
  }
  await adminDb.collection(COLLECTION).doc(produtoId).set({ fotos });
}
