export interface Licitacao {
  arquivo_bytes?: number;
  data: string;
  data_original?: string;
  titulo: string;
  descricao: string;
  arquivo?: string;
  arquivo_status_http?: number;
  problemas: string[];
}

export interface LicitacoesData {
  fonte: string;
  coletado_em: string;
  observacao?: string;
  total: number;
  itens: Licitacao[];
}
