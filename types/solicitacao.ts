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
