import "server-only";
import { adminDb } from "@/lib/firebase-admin";
import { Categoria } from "@/lib/types";

const COLLECTION = "categorias";

export async function getAllCategorias(): Promise<Categoria[]> {
  const snapshot = await adminDb.collection(COLLECTION).orderBy("ordem").get();
  return snapshot.docs.map((doc) => doc.data() as Categoria);
}

export async function getCategoriaBySlug(slug: string): Promise<Categoria | undefined> {
  const doc = await adminDb.collection(COLLECTION).doc(slug).get();
  return doc.exists ? (doc.data() as Categoria) : undefined;
}

/** Cria uma categoria nova, sempre no final da lista. */
export async function createCategoria(categoria: Omit<Categoria, "ordem">): Promise<void> {
  const ref = adminDb.collection(COLLECTION).doc(categoria.slug);
  const existing = await ref.get();
  if (existing.exists) throw new Error(`Já existe uma categoria com o slug "${categoria.slug}".`);

  const snapshot = await adminDb.collection(COLLECTION).get();
  await ref.set({ ...categoria, ordem: snapshot.size });
}

export async function updateCategoria(slug: string, categoria: Categoria): Promise<void> {
  await adminDb.collection(COLLECTION).doc(slug).set(categoria);
}

export async function deleteCategoria(slug: string): Promise<void> {
  await adminDb.collection(COLLECTION).doc(slug).delete();
}
