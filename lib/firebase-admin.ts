/**
 * Firebase no lado do servidor — NUNCA importe este arquivo de um
 * componente cliente ("use client"). Usa a chave da conta de serviço pra
 * ler/escrever no Firestore e validar sessões de login, ignorando as
 * regras de segurança do Firestore (por isso é o próprio código do
 * servidor que decide quem pode ler/escrever, checando o cookie de sessão
 * antes de cada operação administrativa).
 */
import { initializeApp, getApps, getApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function initAdmin() {
  if (getApps().length) return getApp();

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // No painel da Vercel a quebra de linha da chave privada vira "\n"
  // literal — precisamos converter de volta para quebra de linha real.
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Variáveis do Firebase Admin não configuradas. Confira FIREBASE_PROJECT_ID, " +
        "FIREBASE_CLIENT_EMAIL e FIREBASE_PRIVATE_KEY no seu .env.local (veja SETUP-FIREBASE.md)."
    );
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

const adminApp = initAdmin();
export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
try {
  // Vários campos opcionais do domínio (precoPromocional, varianteId de
  // uma movimentação sem variante etc.) chegam como `undefined` — sem
  // isso o Admin SDK rejeita o `set`/`update` inteiro em vez de só omitir
  // o campo. `settings()` só pode ser chamado uma vez por processo, mas
  // em dev o Next.js recarrega este módulo por rota — a segunda chamada
  // lançaria "Firestore has already been initialized", então ignoramos
  // esse erro específico (o app já está com as settings certas).
  adminDb.settings({ ignoreUndefinedProperties: true });
} catch (err) {
  const jaInicializado = err instanceof Error && err.message.includes("already been initialized");
  if (!jaInicializado) throw err;
}
