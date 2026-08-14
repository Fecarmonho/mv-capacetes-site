export type TipoProduto = "novo" | "usado";
export type StatusProduto = "ativo" | "inativo" | "esgotado" | "vendido";

/** Produto "pai". Quando não há variantes, quantidadeEstoque é a fonte de
 * verdade do saldo (caso normal de capacete usado: unidade única). */
export interface Produto {
  slug: string;
  nome: string;
  tipo: TipoProduto;
  marca: string;
  modelo: string;
  cor: string;
  /** Só usado quando o produto não tem variantes de tamanho (ex: usado,
   * unidade única) — quando há variantes, cada uma carrega o seu tamanho. */
  tamanho?: string;
  /** Quanto custou pra loja — só serve pra calcular a margem no admin,
   * nunca aparece pro cliente no site. */
  precoCompra?: number;
  /** Preço de venda "de tabela". */
  preco: number;
  precoPromocional?: number;
  quantidadeEstoque: number;
  quantidadeMinima: number;
  status: StatusProduto;
  descricao: string;
  caracteristicas: string[];
  imagemUrl: string;
  /** Segunda foto (mini) — mostrada no lugar da capa quando o mouse passa
   * em cima do card, dando a impressão do capacete "girando". Vem
   * automaticamente da 1ª foto extra cadastrada, se tiver. */
  imagemHoverUrl?: string;
  totalFotos: number;
  dataCadastro: string;
  dataAtualizacao: string;
  // Exclusivos de capacete usado
  estadoConservacao?: string;
  tempoUso?: string;
  observacoesUsado?: string;
  acessoriosInclusos?: string;
}

/** Variante de tamanho de um produto "pai" (normalmente só em capacetes
 * novos — um usado costuma ser unidade única, sem variante). */
export interface VarianteProduto {
  id: string;
  produtoPaiId: string;
  tamanho: string;
  estoque: number;
}

export interface FotoProduto {
  fid: string;
  mini: string;
  grande: string;
}

export type TipoMovimentacao = "entrada" | "saida";

export interface MovimentacaoEstoque {
  id: string;
  produtoPaiId: string;
  produtoNome: string;
  varianteId?: string;
  tamanhoLabel?: string;
  tipo: TipoMovimentacao;
  quantidade: number;
  motivo: string;
  observacao?: string;
  data: string;
  usuarioEmail: string;
  saldoAnterior: number;
  saldoNovo: number;
}

export interface Marca {
  slug: string;
  nome: string;
  /** Logo da marca (base64), usado nos cards de "marcas em destaque" do site. */
  logo?: string;
}

/** Vitrine de produtos escolhida à mão pelo admin (ex: "Ofertas da
 * semana") — guarda só os slugs, então preço/foto/estoque exibidos na
 * home sempre vêm direto do cadastro atual do produto (nunca ficam
 * desatualizados). */
export interface SecaoHome {
  id: string;
  titulo: string;
  produtoSlugs: string[];
  ordem: number;
  ativo: boolean;
}

export interface Banner {
  id: string;
  /** Imagem do celular (proporção 3:4) — obrigatória. */
  imagem: string;
  /** Imagem alternativa pro desktop (formato paisagem). Se não tiver,
   * usa a mesma foto do celular, só que numa caixa mais baixa e larga. */
  imagemDesktop?: string;
  titulo?: string;
  /** Linha curta abaixo do título, no estilo dos carrosséis de vitrine. */
  descricao?: string;
  link?: string;
  ordem: number;
  ativo: boolean;
}

export interface ConfiguracoesLoja {
  nomeLoja: string;
  whatsapp: string;
  instagram: string;
  textoInstitucional: string;
  // Seção "Quem somos" do site — só aparece se tiver história cadastrada.
  quemSomosNome: string;
  quemSomosFoto?: string;
  quemSomosHistoria: string;
}

export const MOTIVOS_ENTRADA = ["Compra", "Reposição", "Cadastro inicial", "Outros"] as const;
export const MOTIVOS_SAIDA = ["Venda", "Reserva", "Perda", "Outro"] as const;
