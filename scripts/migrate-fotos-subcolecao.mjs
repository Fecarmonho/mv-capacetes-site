// Migra as fotos extras da estrutura antiga (um doc "produtoFotos/{id}"
// com todas as fotos num array — estourava o limite de 1MB do Firestore
// com poucas fotos) pra nova (subcoleção "produtos/{id}/fotos", um
// documento por foto). Só precisa rodar uma vez.
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  console.error("Faltam variáveis do Firebase Admin no .env.local.");
  process.exit(1);
}

const app = initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
const db = getFirestore(app);

async function run() {
  const antigos = await db.collection("produtoFotos").get();
  if (antigos.empty) {
    console.log("Nada pra migrar — coleção 'produtoFotos' está vazia.");
    return;
  }

  for (const doc of antigos.docs) {
    const produtoId = doc.id;
    const fotos = doc.data()?.fotos ?? [];
    if (fotos.length === 0) continue;

    const batch = db.batch();
    const subcolecao = db.collection("produtos").doc(produtoId).collection("fotos");
    for (const foto of fotos) {
      batch.set(subcolecao.doc(foto.fid), foto);
    }
    await batch.commit();
    console.log(`✓ ${produtoId}: ${fotos.length} foto(s) migrada(s)`);
  }

  // Limpa a estrutura antiga depois de confirmar que tudo foi copiado.
  const batchDelete = db.batch();
  for (const doc of antigos.docs) batchDelete.delete(doc.ref);
  await batchDelete.commit();

  console.log(`\nConcluído: ${antigos.size} produto(s) migrado(s).`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
