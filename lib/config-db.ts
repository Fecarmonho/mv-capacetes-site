import "server-only";
import { adminDb } from "@/lib/firebase-admin";
import { ConfiguracoesLoja } from "@/lib/types";

const DOC_PATH = ["configuracoes", "loja"] as const;

const PADRAO: ConfiguracoesLoja = {
  nomeLoja: "MV Capacetes",
  whatsapp: "",
  instagram: "",
  textoInstitucional: "",
  quemSomosNome: "Mateus",
  quemSomosFoto: undefined,
  quemSomosHistoria:
    "Mateus cresceu com moto na garagem de casa e nunca perdeu essa paixão. Hoje ele trabalha numa oficina de reparo de motos, lidando todo dia com peças, capacetes e detalhes que fazem a diferença entre proteção de verdade e enfeite. Foi ali, no dia a dia da oficina, que nasceu a MV Capacetes: a vontade de oferecer pra quem anda de moto o mesmo cuidado e olho técnico que ele usa em cada reparo — capacetes novos e usados escolhidos com a mesma exigência que ele teria pro seu próprio.",
};

export async function getConfiguracoes(): Promise<ConfiguracoesLoja> {
  const doc = await adminDb.collection(DOC_PATH[0]).doc(DOC_PATH[1]).get();
  if (!doc.exists) return PADRAO;
  return { ...PADRAO, ...(doc.data() as Partial<ConfiguracoesLoja>) };
}

export async function updateConfiguracoes(config: ConfiguracoesLoja): Promise<void> {
  await adminDb.collection(DOC_PATH[0]).doc(DOC_PATH[1]).set(config);
}
