import "server-only";
import { adminDb } from "@/lib/firebase-admin";
import { Marca } from "@/lib/types";

const COLLECTION = "marcas";

export async function getAllMarcas(): Promise<Marca[]> {
  const snapshot = await adminDb.collection(COLLECTION).orderBy("nome").get();
  return snapshot.docs.map((doc) => doc.data() as Marca);
}

export async function createMarca(marca: Marca): Promise<void> {
  const ref = adminDb.collection(COLLECTION).doc(marca.slug);
  const existing = await ref.get();
  if (existing.exists) throw new Error(`Já existe uma marca com o slug "${marca.slug}".`);
  await ref.set(marca);
}

export async function updateMarca(slug: string, dados: Partial<Pick<Marca, "nome" | "logo">>): Promise<void> {
  await adminDb.collection(COLLECTION).doc(slug).update(dados);
}

export async function deleteMarca(slug: string): Promise<void> {
  await adminDb.collection(COLLECTION).doc(slug).delete();
}
