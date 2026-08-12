// Popula o Firestore com categorias, marcas e produtos fictícios pra
// visualizar o site/admin durante o desenvolvimento. Troque por produtos
// reais direto pelo painel quando for pra produção — nada aqui inventa
// dados da empresa (WhatsApp, endereço etc.), só catálogo de exemplo.
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  console.error("Faltam variáveis do Firebase Admin no .env.local. Veja .env.example.");
  process.exit(1);
}

const app = initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
const db = getFirestore(app);
db.settings({ ignoreUndefinedProperties: true });

const agora = new Date().toISOString();

const categorias = [
  { slug: "fechados", nome: "Fechados", ordem: 1 },
  { slug: "escamoteaveis", nome: "Escamoteáveis", ordem: 2 },
  { slug: "abertos", nome: "Abertos", ordem: 3 },
  { slug: "off-road", nome: "Off-road", ordem: 4 },
];

const marcas = [
  { slug: "ls2", nome: "LS2" },
  { slug: "pro-tork", nome: "Pro Tork" },
  { slug: "norisk", nome: "Norisk" },
  { slug: "texx", nome: "Texx" },
];

const produtos = [
  {
    slug: "ls2-ff353-rapid-preto-fosco",
    nome: "LS2 FF353 Rapid",
    sku: "LS2-353-RPD",
    tipo: "novo",
    marca: "LS2",
    modelo: "FF353 Rapid",
    categoria: "fechados",
    cor: "Preto fosco",
    preco: 499.9,
    precoPromocional: 429.9,
    quantidadeEstoque: 0, // soma das variantes
    quantidadeMinima: 3,
    status: "ativo",
    descricao:
      "Capacete fechado esportivo, viseira anti-risco e ventilação frontal/traseira.",
    caracteristicas: ["Viseira anti-risco", "Forro removível e lavável", "Certificado INMETRO"],
    imagemUrl: "",
    totalFotos: 1,
    destaque: true,
    dataCadastro: agora,
    dataAtualizacao: agora,
    variantes: [
      { tamanho: "58", estoque: 4 },
      { tamanho: "60", estoque: 6 },
      { tamanho: "62", estoque: 2 },
    ],
  },
  {
    slug: "norisk-atomic-escamoteavel-grafite",
    nome: "Norisk Atomic",
    sku: "NRK-ATM-GRF",
    tipo: "novo",
    marca: "Norisk",
    modelo: "Atomic",
    categoria: "escamoteaveis",
    cor: "Grafite",
    preco: 649.9,
    quantidadeEstoque: 0,
    quantidadeMinima: 2,
    status: "ativo",
    descricao: "Escamoteável com óculos solar interno e viseira selada contra vento.",
    caracteristicas: ["Óculos solar interno", "Viseira selada", "Certificado INMETRO"],
    imagemUrl: "",
    totalFotos: 1,
    destaque: true,
    dataCadastro: agora,
    dataAtualizacao: agora,
    variantes: [
      { tamanho: "58", estoque: 1 },
      { tamanho: "60", estoque: 3 },
    ],
  },
  {
    slug: "pro-tork-evolution-usado-58",
    nome: "Pro Tork Evolution",
    sku: "PTK-EVO-USD-01",
    tipo: "usado",
    marca: "Pro Tork",
    modelo: "Evolution",
    categoria: "abertos",
    cor: "Vermelho",
    preco: 189.9,
    quantidadeEstoque: 1,
    quantidadeMinima: 1,
    status: "ativo",
    descricao: "Capacete aberto usado, revisado, sem trincas ou reparos.",
    caracteristicas: ["Viseira de brinde", "Sem odor", "Revisado antes da venda"],
    imagemUrl: "",
    totalFotos: 1,
    dataCadastro: agora,
    dataAtualizacao: agora,
    estadoConservacao: "Muito bom",
    tempoUso: "8 meses",
    observacoesUsado: "Pequenos riscos superficiais na parte traseira, sem afetar a proteção.",
    acessoriosInclusos: "Viseira solar extra",
    variantes: [],
  },
];

async function seed() {
  const batch = db.batch();

  for (const categoria of categorias) {
    batch.set(db.collection("categorias").doc(categoria.slug), categoria);
  }
  for (const marca of marcas) {
    batch.set(db.collection("marcas").doc(marca.slug), marca);
  }

  for (const { variantes, ...produto } of produtos) {
    batch.set(db.collection("produtos").doc(produto.slug), produto);
    for (const variante of variantes) {
      const id = `${produto.slug}-${variante.tamanho}`;
      batch.set(db.collection("variantesProduto").doc(id), {
        id,
        produtoPaiId: produto.slug,
        tamanho: variante.tamanho,
        estoque: variante.estoque,
      });
    }
  }

  await batch.commit();
  console.log(`Seed concluído: ${categorias.length} categorias, ${marcas.length} marcas, ${produtos.length} produtos.`);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
