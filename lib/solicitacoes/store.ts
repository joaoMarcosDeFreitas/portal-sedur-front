import { useSyncExternalStore } from "react";
import { createLocalStore } from "@/lib/store/local-store";
import type { Dam, Solicitacao, TipoSolicitacao } from "@/types/solicitacao";

const VAZIO: Solicitacao[] = [];
const store = createLocalStore<Solicitacao[]>("portal-sedur:solicitacoes", VAZIO);

export function useSolicitacoes(): Solicitacao[] {
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
}

function atualizar(protocolo: string, alterar: (atual: Solicitacao) => Solicitacao) {
  store.set(store.getSnapshot().map((s) => (s.protocolo === protocolo ? alterar(s) : s)));
}

function agora() {
  return new Date().toISOString();
}

function digitos(quantidade: number) {
  return Array.from({ length: quantidade }, () => Math.floor(Math.random() * 10)).join("");
}

export interface NovaSolicitacao {
  /** "dam" = Emissão de DAM; "processo" = Abrir processo (ver `TipoSolicitacao`). */
  tipo: TipoSolicitacao;
  servicoId: string;
  servicoNome: string;
  categoria: string;
  requerente: string;
  /** Só na abertura de processo (a emissão de DAM não pede imóvel). */
  imovel?: string;
  bairro?: string;
  descricao?: string;
  area?: number;
  documentosAnexados?: string[];
  /** Valor do DAM; obrigatório (> 0) na emissão de DAM e ignorado na abertura de processo. */
  valorDam?: number;
}

/**
 * Cria a solicitação e devolve o protocolo.
 * - Emissão de DAM: gera o DAM fictício (`DAM-aaaa-nnnnnn`) e fica "aguardando pagamento"; pago, termina.
 * - Abertura de processo: gera o protocolo `SEDUR-aaaa-nnnnnn` e vai direto para "em análise" (sem DAM).
 */
export function criarSolicitacao(nova: NovaSolicitacao): string {
  const criadaEm = agora();
  const ehDam = nova.tipo === "dam";
  const protocolo = `${ehDam ? "DAM" : "SEDUR"}-${new Date().getFullYear()}-${digitos(6)}`;

  const vencimento = new Date();
  vencimento.setDate(vencimento.getDate() + 10);
  const dam: Dam | undefined =
    ehDam && nova.valorDam && nova.valorDam > 0
      ? {
          codigo: `${digitos(11)} ${digitos(11)} ${digitos(11)} ${digitos(11)}`,
          valor: nova.valorDam,
          vencimento: vencimento.toISOString(),
        }
      : undefined;

  const solicitacao: Solicitacao = {
    protocolo,
    tipo: nova.tipo,
    servicoId: nova.servicoId,
    servicoNome: nova.servicoNome,
    categoria: nova.categoria,
    criadaEm,
    requerente: nova.requerente,
    imovel: nova.imovel ?? "",
    bairro: nova.bairro ?? "",
    descricao: nova.descricao ?? "",
    area: nova.area,
    documentosAnexados: nova.documentosAnexados ?? [],
    dam,
    status: dam ? "aguardando_pagamento" : "em_analise",
    historico: [
      ehDam
        ? { titulo: "DAM emitido — aguardando pagamento", em: criadaEm }
        : { titulo: "Processo aberto", em: criadaEm },
      ...(ehDam ? [] : [{ titulo: "Processo em análise", em: criadaEm }]),
    ],
  };

  store.set([solicitacao, ...store.getSnapshot()]);
  return protocolo;
}

/**
 * Simula a confirmação do pagamento do DAM (PIX ou boleto). Numa emissão de DAM o pagamento encerra o
 * pedido (fica "pago", com comprovante); nas solicitações antigas (sem `tipo`) segue para análise.
 */
export function confirmarPagamento(protocolo: string) {
  atualizar(protocolo, (s) => {
    if (s.status !== "aguardando_pagamento" || !s.dam) return s;
    const em = agora();
    const soDam = s.tipo === "dam";
    return {
      ...s,
      dam: { ...s.dam, pagoEm: em },
      status: soDam ? "concluida" : "em_analise",
      historico: [
        ...s.historico,
        { titulo: "Pagamento confirmado", em },
        soDam ? { titulo: "DAM pago — comprovante disponível", em } : { titulo: "Solicitação em análise", em },
      ],
    };
  });
}

/** Só para a demonstração: conclui um processo que está em análise. */
export function concluirSolicitacao(protocolo: string) {
  atualizar(protocolo, (s) =>
    s.status !== "em_analise"
      ? s
      : {
          ...s,
          status: "concluida",
          historico: [...s.historico, { titulo: "Processo concluído — documento disponível", em: agora() }],
        },
  );
}
