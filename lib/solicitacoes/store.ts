import { useSyncExternalStore } from "react";
import { createLocalStore } from "@/lib/store/local-store";
import type { Dam, Solicitacao } from "@/types/solicitacao";

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
  servicoId: string;
  servicoNome: string;
  categoria: string;
  requerente: string;
  imovel: string;
  bairro: string;
  descricao: string;
  area?: number;
  documentosAnexados: string[];
  /** Valor da taxa (0 ou ausente = serviço sem cobrança, vai direto para análise). */
  valorDam?: number;
}

/** Cria a solicitação, gera protocolo e (se houver taxa) o DAM fictício. Devolve o protocolo. */
export function criarSolicitacao(nova: NovaSolicitacao): string {
  const criadaEm = agora();
  const protocolo = `SEDUR-${new Date().getFullYear()}-${digitos(6)}`;

  const vencimento = new Date();
  vencimento.setDate(vencimento.getDate() + 10);
  const dam: Dam | undefined =
    nova.valorDam && nova.valorDam > 0
      ? {
          codigo: `${digitos(11)} ${digitos(11)} ${digitos(11)} ${digitos(11)}`,
          valor: nova.valorDam,
          vencimento: vencimento.toISOString(),
        }
      : undefined;

  const solicitacao: Solicitacao = {
    protocolo,
    servicoId: nova.servicoId,
    servicoNome: nova.servicoNome,
    categoria: nova.categoria,
    criadaEm,
    requerente: nova.requerente,
    imovel: nova.imovel,
    bairro: nova.bairro,
    descricao: nova.descricao,
    area: nova.area,
    documentosAnexados: nova.documentosAnexados,
    dam,
    status: dam ? "aguardando_pagamento" : "em_analise",
    historico: [
      { titulo: "Solicitação protocolada", em: criadaEm },
      dam
        ? { titulo: "DAM emitido — aguardando pagamento", em: criadaEm }
        : { titulo: "Solicitação em análise", em: criadaEm },
    ],
  };

  store.set([solicitacao, ...store.getSnapshot()]);
  return protocolo;
}

/** Simula a confirmação do pagamento do DAM (PIX ou boleto) e manda para análise. */
export function confirmarPagamento(protocolo: string) {
  atualizar(protocolo, (s) => {
    if (s.status !== "aguardando_pagamento" || !s.dam) return s;
    const em = agora();
    return {
      ...s,
      dam: { ...s.dam, pagoEm: em },
      status: "em_analise",
      historico: [
        ...s.historico,
        { titulo: "Pagamento confirmado", em },
        { titulo: "Solicitação em análise", em },
      ],
    };
  });
}

/** Só para a demonstração: conclui uma solicitação que está em análise. */
export function concluirSolicitacao(protocolo: string) {
  atualizar(protocolo, (s) =>
    s.status !== "em_analise"
      ? s
      : {
          ...s,
          status: "concluida",
          historico: [...s.historico, { titulo: "Solicitação concluída — documento disponível", em: agora() }],
        },
  );
}
