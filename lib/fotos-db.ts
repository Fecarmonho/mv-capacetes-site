/**
 * Fotos de um produto além da capa (que viaja dentro do próprio doc de
 * produto, em `imagemUrl`). Guardadas à parte porque a listagem/catálogo
 * baixa todos os produtos de uma vez — não faz sentido carregar todas as
 * fotos extras junto; elas só são buscadas quando alguém abre a página do
 * produto.
 *
 * Cada foto é o SEU PRÓPRIO documento (subcoleção "fotos" dentro do
 * produto, id = fid) em vez de um doc só com todas as fotos num array —
 * um documento do Firestore não passa de 1MB, e capa + várias fotos
 * extras (mini + grande cada) juntas num doc só estouram esse limite
 * rápido. Documento por foto nunca chega perto disso.
 */
import "server-only";
import { adminDb } from "@/lib/firebase-admin";
import { FotoProduto } from "@/lib/types";

function subcolecaoFotos(produtoId: string) {
  return adminDb.collection("produtos").doc(produtoId).collection("fotos");
}

export async function getFotosExtras(produtoId: string): Promise<FotoProduto[]> {
  const snapshot = await subcolecaoFotos(produtoId).get();
  return snapshot.docs.map((doc) => doc.data() as FotoProduto);
}

export async function setFotosExtras(produtoId: string, fotos: FotoProduto[]): Promise<void> {
  const ref = subcolecaoFotos(produtoId);
  const existentes = await ref.get();
  const idsNovos = new Set(fotos.map((f) => f.fid));

  const batch = adminDb.batch();
  for (const doc of existentes.docs) {
    if (!idsNovos.has(doc.id)) batch.delete(doc.ref);
  }
  for (const foto of fotos) {
    batch.set(ref.doc(foto.fid), foto);
  }
  await batch.commit();
}
