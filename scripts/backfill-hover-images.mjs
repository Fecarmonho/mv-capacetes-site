// Preenche imagemHoverUrl nos produtos cadastrados antes desse campo
// existir — sem isso, a foto que "gira" no hover do card não aparece
// mesmo que o produto já tenha fotos extras salvas. Só precisa rodar uma
// vez; produtos novos/editados depois já recebem o campo automaticamente
// (ver components/admin/ProductForm.tsx).
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
  const produtosSnap = await db.collection("produtos").get();
  let atualizados = 0;

  for (const doc of produtosSnap.docs) {
    const produto = doc.data();
    if (produto.imagemHoverUrl) continue;

    const fotosDoc = await db.collection("produtoFotos").doc(doc.id).get();
    if (!fotosDoc.exists) continue;

    const fotos = fotosDoc.data()?.fotos ?? [];
    const primeiraExtra = fotos.find((f) => f.fid !== "capa");
    if (!primeiraExtra?.mini) continue;

    await doc.ref.update({ imagemHoverUrl: primeiraExtra.mini });
    console.log(`✓ ${produto.nome} (${doc.id})`);
    atualizados++;
  }

  console.log(`\nConcluído: ${atualizados} produto(s) atualizado(s) de ${produtosSnap.size} no total.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
