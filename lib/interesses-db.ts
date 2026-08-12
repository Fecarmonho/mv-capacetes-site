/**
 * Log leve de cliques em "Tenho interesse" — não é um sistema de pedidos
 * com checkout (o fluxo real é o cliente falar com a loja pelo WhatsApp).
 * Serve só pra dar um número no dashboard e, no futuro, medir origem de
 * tráfego, no mesmo espírito do /api/go do Radar de Ofertas.
 */
import "server-only";
import { adminDb } from "@/lib/firebase-admin";
import { uid } from "@/lib/uid";

const COLLECTION = "interesses";

export async function registrarInteresse(produtoSlug: string, produtoNome: string): Promise<void> {
  const id = uid();
  await adminDb
    .collection(COLLECTION)
    .doc(id)
    .set({ id, produtoSlug, produtoNome, data: new Date().toISOString() });
}

export async function contarInteresses(): Promise<number> {
  const snapshot = await adminDb.collection(COLLECTION).count().get();
  return snapshot.data().count;
}
