export interface ServicoAcao {
  rotulo: string;
  tipo: "emitir_dam" | "abrir_processo" | string;
}

export interface ServicoLink {
  texto: string;
  url: string;
}

export interface ServicoAbas {
  descricao?: string;
  "documentacao-exigida"?: string;
  informacoes?: string;
  taxas?: string;
  prazo?: string;
  local?: string;
}

export interface Servico {
  id: string;
  nome: string;
  categoria_id: string;
  categoria: string;
  url_ficha_atual: string;
  acoes: ServicoAcao[];
  abas: ServicoAbas;
  links_nas_abas?: Record<string, ServicoLink[]>;
}

export interface CategoriaServico {
  id: string;
  nome: string;
  url_atual: string;
  total: number;
  servicos: string[];
}

export interface ServicosData {
  fonte: string;
  coletado_em: string;
  observacao?: string;
  categorias: CategoriaServico[];
  servicos: Servico[];
}
