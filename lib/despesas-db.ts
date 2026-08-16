/**
 * Despesas do mês — um único número editado à mão no Dashboard, sem
 * histórico nem CRUD (o dono só quer bater o olho no lucro aproximado).
 */
import "server-only";
import { adminDb } from "@/lib/firebase-admin";

const DOC_PATH = ["despesas", "geral"] as const;

export async function getDespesas(): Promise<number> {
  const doc = await adminDb.collection(DOC_PATH[0]).doc(DOC_PATH[1]).get();
  if (!doc.exists) return 0;
  return (doc.data()?.valor as number) ?? 0;
}

export async function updateDespesas(valor: number): Promise<void> {
  await adminDb.collection(DOC_PATH[0]).doc(DOC_PATH[1]).set({ valor });
}
