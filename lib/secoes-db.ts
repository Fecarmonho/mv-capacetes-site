import "server-only";
import { adminDb } from "@/lib/firebase-admin";
import { SecaoHome } from "@/lib/types";
import { uid } from "@/lib/uid";

const COLLECTION = "secoesHome";

export async function getAllSecoes(): Promise<SecaoHome[]> {
  const snapshot = await adminDb.collection(COLLECTION).orderBy("ordem").get();
  return snapshot.docs.map((doc) => doc.data() as SecaoHome);
}

export async function getSecoesAtivas(): Promise<SecaoHome[]> {
  const secoes = await getAllSecoes();
  return secoes.filter((s) => s.ativo);
}

export async function createSecao(secao: Omit<SecaoHome, "id" | "ordem">): Promise<void> {
  const id = uid();
  const existentes = await adminDb.collection(COLLECTION).get();
  await adminDb.collection(COLLECTION).doc(id).set({ ...secao, id, ordem: existentes.size });
}

export async function updateSecao(id: string, secao: Partial<SecaoHome>): Promise<void> {
  await adminDb.collection(COLLECTION).doc(id).update(secao);
}

export async function deleteSecao(id: string): Promise<void> {
  await adminDb.collection(COLLECTION).doc(id).delete();
}
