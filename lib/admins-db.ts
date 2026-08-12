/**
 * Usuários do painel — Firestore, coleção "admins" (id = uid do Firebase
 * Auth). Guarda só os metadados de quem pode logar; a senha de verdade
 * fica no Firebase Authentication, não aqui. Só quem tem um documento
 * nesta coleção consegue acessar o /admin (ver lib/admin-session.ts).
 */
import "server-only";
import { adminDb } from "@/lib/firebase-admin";

const COLLECTION = "admins";

export interface AdminUser {
  uid: string;
  name: string;
  email: string;
  createdAt: string;
}

export async function isAdmin(uid: string): Promise<boolean> {
  const doc = await adminDb.collection(COLLECTION).doc(uid).get();
  return doc.exists;
}

export async function getAllAdmins(): Promise<AdminUser[]> {
  const snapshot = await adminDb.collection(COLLECTION).orderBy("createdAt").get();
  return snapshot.docs.map((doc) => doc.data() as AdminUser);
}

export async function countAdmins(): Promise<number> {
  const snapshot = await adminDb.collection(COLLECTION).count().get();
  return snapshot.data().count;
}

export async function createAdminRecord(admin: AdminUser): Promise<void> {
  await adminDb.collection(COLLECTION).doc(admin.uid).set(admin);
}

export async function deleteAdminRecord(uid: string): Promise<void> {
  await adminDb.collection(COLLECTION).doc(uid).delete();
}
