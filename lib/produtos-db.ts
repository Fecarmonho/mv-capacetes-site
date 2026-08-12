/**
 * Fonte de dados dos produtos — Firestore, coleção "produtos". Usa o slug
 * como ID do documento. Só roda no servidor (Server Components, rotas de
 * API) — nunca importe isto de um componente "use client".
 */
import "server-only";
import { adminDb } from "@/lib/firebase-admin";
import { Produto } from "@/lib/types";

const COLLECTION = "produtos";

export async function getAllProdutos(): Promise<Produto[]> {
  const snapshot = await adminDb.collection(COLLECTION).orderBy("nome").get();
  return snapshot.docs.map((doc) => doc.data() as Produto);
}

export async function getProdutoBySlug(slug: string): Promise<Produto | undefined> {
  const doc = await adminDb.collection(COLLECTION).doc(slug).get();
  return doc.exists ? (doc.data() as Produto) : undefined;
}

/** Cria um produto novo. Lança erro se o slug já existir. */
export async function createProduto(produto: Produto): Promise<void> {
  const ref = adminDb.collection(COLLECTION).doc(produto.slug);
  const existing = await ref.get();
  if (existing.exists) {
    throw new Error(`Já existe um produto com o SKU/slug "${produto.slug}".`);
  }
  await ref.set(produto);
}

/** Atualiza um produto existente pelo slug atual. */
export async function updateProduto(currentSlug: string, produto: Produto): Promise<void> {
  if (produto.slug !== currentSlug) {
    // Firestore não permite renomear o ID de um doc existente — precisa
    // mover pra um novo documento.
    const oldRef = adminDb.collection(COLLECTION).doc(currentSlug);
    const newRef = adminDb.collection(COLLECTION).doc(produto.slug);
    const newExists = await newRef.get();
    if (newExists.exists) {
      throw new Error(`Já existe um produto com o SKU/slug "${produto.slug}".`);
    }
    await newRef.set(produto);
    await oldRef.delete();
    return;
  }
  await adminDb.collection(COLLECTION).doc(currentSlug).set(produto);
}

export async function deleteProduto(slug: string): Promise<void> {
  await adminDb.collection(COLLECTION).doc(slug).delete();
}
