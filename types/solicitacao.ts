/**
 * O que a pessoa pediu, conforme os botões reais das fichas do portal atual:
 * "dam" = Emissão de DAM (gera e paga a guia; termina no pagamento) e "processo" = Abrir processo (protocolo e
 * análise, sem DAM). Solicitações antigas guardadas no navegador não têm `tipo` (fluxo combinado anterior).
 */
export type TipoSolicitacao = "dam" | "processo";

export type StatusSolicitacao = "aguardando_pagamento" | "em_analise" | "concluida";

export interface Dam {
  /** Linha digitável fictícia. */
  codigo: string;
  valor: number;
  vencimento: string;
  pagoEm?: string;
}

export interface EventoHistorico {
  titulo: string;
  em: string;
}

export interface Solicitacao {
  protocolo: string;
  tipo?: TipoSolicitacao;
  servicoId: string;
  servicoNome: string;
  categoria: string;
  criadaEm: string;
  requerente: string;
  imovel: string;
  bairro: string;
  descricao: string;
  area?: number;
  documentosAnexados: string[];
  dam?: Dam;
  status: StatusSolicitacao;
  historico: EventoHistorico[];
}
