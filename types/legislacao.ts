export interface DocumentoLegislacao {
  arquivo_bytes?: number;
  data: string;
  numero: string;
  descricao: string;
  arquivo?: string;
  arquivo_status_http?: number;
  problemas: string[];
}

export interface SubsecaoLegislacao {
  id: string;
  nome: string;
  url: string;
  linhas_em_branco_na_tabela?: number;
  itens: DocumentoLegislacao[];
}

export interface SecaoLegislacao {
  id: string;
  nome: string;
  url: string;
  subsecoes?: SubsecaoLegislacao[];
  itens?: DocumentoLegislacao[];
}

export interface LegislacaoData {
  fonte: string;
  coletado_em: string;
  colunas_da_tabela_original: string[];
  secoes: SecaoLegislacao[];
}
