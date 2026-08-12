/**
 * Toda alteração de estoque (entrada ou saída) passa por aqui — é o que dá
 * o histórico auditável que nenhum dos dois projetos de referência tinha.
 * A atualização do saldo (no produto ou na variante) e o registro do log
 * acontecem na mesma transação do Firestore, pra nunca ficar um sem o
 * outro.
 */
import "server-only";
import { adminDb } from "@/lib/firebase-admin";
import { MovimentacaoEstoque, TipoMovimentacao } from "@/lib/types";
import { uid } from "@/lib/uid";

const COLLECTION = "movimentacoesEstoque";
const PRODUTOS = "produtos";
const VARIANTES = "variantesProduto";

interface RegistrarParams {
  produtoPaiId: string;
  varianteId?: string;
  tipo: TipoMovimentacao;
  quantidade: number;
  motivo: string;
  observacao?: string;
  usuarioEmail: string;
}

export async function registrarMovimentacao(params: RegistrarParams): Promise<void> {
  const { produtoPaiId, varianteId, tipo, quantidade, motivo, observacao, usuarioEmail } = params;
  if (quantidade <= 0) throw new Error("A quantidade precisa ser maior que zero.");

  const produtoRef = adminDb.collection(PRODUTOS).doc(produtoPaiId);
  const varianteRef = varianteId ? adminDb.collection(VARIANTES).doc(varianteId) : null;

  await adminDb.runTransaction(async (tx) => {
    const produtoSnap = await tx.get(produtoRef);
    if (!produtoSnap.exists) throw new Error("Produto não encontrado.");
    const produto = produtoSnap.data()!;

    const varianteSnap = varianteRef ? await tx.get(varianteRef) : null;
    if (varianteRef && !varianteSnap?.exists) throw new Error("Variante não encontrada.");

    const saldoAnterior = varianteSnap ? (varianteSnap.data()!.estoque as number) : (produto.quantidadeEstoque as number);
    const delta = tipo === "entrada" ? quantidade : -quantidade;
    const saldoNovo = saldoAnterior + delta;
    if (saldoNovo < 0) {
      throw new Error(`Estoque insuficiente: saldo atual é ${saldoAnterior}.`);
    }

    const agora = new Date().toISOString();
    if (varianteRef) {
      tx.update(varianteRef, { estoque: saldoNovo });
      tx.update(produtoRef, { dataAtualizacao: agora });
    } else {
      const atualizacaoProduto: Record<string, unknown> = {
        quantidadeEstoque: saldoNovo,
        dataAtualizacao: agora,
      };
      // Capacete usado é unidade única por natureza: ao zerar o estoque
      // numa saída, marca como vendido pra nunca continuar aparecendo
      // como disponível no site (ver regra de negócio do produto usado).
      if (produto.tipo === "usado" && saldoNovo === 0 && tipo === "saida") {
        atualizacaoProduto.status = "vendido";
      }
      tx.update(produtoRef, atualizacaoProduto);
    }

    const movimentacao: MovimentacaoEstoque = {
      id: uid(),
      produtoPaiId,
      produtoNome: produto.nome as string,
      varianteId,
      tamanhoLabel: varianteSnap ? (varianteSnap.data()!.tamanho as string) : undefined,
      tipo,
      quantidade,
      motivo,
      observacao,
      data: agora,
      usuarioEmail,
      saldoAnterior,
      saldoNovo,
    };
    tx.set(adminDb.collection(COLLECTION).doc(movimentacao.id), movimentacao);
  });
}

export async function getHistoricoMovimentacoes(produtoPaiId?: string): Promise<MovimentacaoEstoque[]> {
  let query = adminDb.collection(COLLECTION).orderBy("data", "desc").limit(200) as FirebaseFirestore.Query;
  if (produtoPaiId) {
    query = adminDb
      .collection(COLLECTION)
      .where("produtoPaiId", "==", produtoPaiId)
      .orderBy("data", "desc")
      .limit(200);
  }
  const snapshot = await query.get();
  return snapshot.docs.map((doc) => doc.data() as MovimentacaoEstoque);
}
