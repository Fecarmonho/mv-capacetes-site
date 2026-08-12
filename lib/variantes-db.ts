import "server-only";
import { adminDb } from "@/lib/firebase-admin";
import { VarianteProduto } from "@/lib/types";
import { uid } from "@/lib/uid";

const COLLECTION = "variantesProduto";

export async function getVariantesByProduto(produtoPaiId: string): Promise<VarianteProduto[]> {
  const snapshot = await adminDb
    .collection(COLLECTION)
    .where("produtoPaiId", "==", produtoPaiId)
    .get();
  return snapshot.docs.map((doc) => doc.data() as VarianteProduto);
}

export async function getVariantesByProdutos(
  produtoPaiIds: string[]
): Promise<Map<string, VarianteProduto[]>> {
  const mapa = new Map<string, VarianteProduto[]>();
  if (produtoPaiIds.length === 0) return mapa;

  // "in" do Firestore aceita até 30 valores por consulta.
  const lotes: string[][] = [];
  for (let i = 0; i < produtoPaiIds.length; i += 30) {
    lotes.push(produtoPaiIds.slice(i, i + 30));
  }
  for (const lote of lotes) {
    const snapshot = await adminDb.collection(COLLECTION).where("produtoPaiId", "in", lote).get();
    for (const doc of snapshot.docs) {
      const variante = doc.data() as VarianteProduto;
      const lista = mapa.get(variante.produtoPaiId) ?? [];
      lista.push(variante);
      mapa.set(variante.produtoPaiId, lista);
    }
  }
  return mapa;
}

export async function createVariante(
  produtoPaiId: string,
  tamanho: string,
  estoque: number
): Promise<VarianteProduto> {
  const variante: VarianteProduto = { id: uid(), produtoPaiId, tamanho, estoque };
  await adminDb.collection(COLLECTION).doc(variante.id).set(variante);
  return variante;
}

export async function updateVariante(
  id: string,
  dados: Partial<Pick<VarianteProduto, "tamanho" | "estoque">>
): Promise<void> {
  await adminDb.collection(COLLECTION).doc(id).update(dados);
}

export async function deleteVariante(id: string): Promise<void> {
  await adminDb.collection(COLLECTION).doc(id).delete();
}

export async function deleteVariantesByProduto(produtoPaiId: string): Promise<void> {
  const snapshot = await adminDb.collection(COLLECTION).where("produtoPaiId", "==", produtoPaiId).get();
  await Promise.all(snapshot.docs.map((doc) => doc.ref.delete()));
}
