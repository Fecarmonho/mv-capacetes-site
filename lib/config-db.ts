import "server-only";
import { adminDb } from "@/lib/firebase-admin";
import { ConfiguracoesLoja } from "@/lib/types";

const DOC_PATH = ["configuracoes", "loja"] as const;

const PADRAO: ConfiguracoesLoja = {
  nomeLoja: "MV Capacetes",
  whatsapp: "",
  instagram: "",
  email: "",
  endereco: "",
  horarioAtendimento: "",
  textoInstitucional: "",
};

export async function getConfiguracoes(): Promise<ConfiguracoesLoja> {
  const doc = await adminDb.collection(DOC_PATH[0]).doc(DOC_PATH[1]).get();
  if (!doc.exists) return PADRAO;
  return { ...PADRAO, ...(doc.data() as Partial<ConfiguracoesLoja>) };
}

export async function updateConfiguracoes(config: ConfiguracoesLoja): Promise<void> {
  await adminDb.collection(DOC_PATH[0]).doc(DOC_PATH[1]).set(config);
}
