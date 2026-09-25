export interface Projeto {
  slug: string;
  nome: string;
  rotulo_na_home?: string;
  url: string;
  titulo_na_pagina?: string;
  texto: string;
  links?: { texto: string; url: string; url_original?: string; arquivo_status_http?: number }[];
}

export interface InstitucionalData {
  fonte: string;
  coletado_em: string;
  texto_integral: string;
  introducao?: string;
  areas: string[];
}

export interface Dirigente {
  cargo: string;
  nomes: string[];
}

export interface DirigentesData {
  fonte: string;
  coletado_em: string;
  observacoes?: string;
  foto_secretario?: {
    tipo?: string;
    dimensao?: string;
    peso_aprox?: string;
    alt?: string | null;
  };
  dirigentes: Dirigente[];
}

export interface UnidadeOrganizacional {
  nome: string;
  filhos?: UnidadeOrganizacional[];
  setores?: string[];
}

export interface OrganogramaData {
  fonte: string;
  titulo_na_imagem?: string;
  base_legal_na_imagem?: string;
  coletado_em: string;
  aviso?: string;
  legenda_da_imagem?: string[];
  gabinete_do_secretario: {
    colegiados_de_deliberacao_superior: string[];
    administracao_indireta: string[];
    assessorias: string[];
    subordinadas: UnidadeOrganizacional[];
  };
}

export interface ArquivoProcessoTransparencia {
  nome: string;
  arquivo: string;
  arquivo_status_http?: number;
}

export interface ProcessoTransparencia {
  ano: number;
  texto_do_link: string;
  url: string;
  titulo_da_pagina?: string;
  arquivos: ArquivoProcessoTransparencia[];
}

export interface ItemMenuTransparencia {
  nome: string;
  url: string;
  colunas?: string[];
  itens?: {
    arquivo_bytes?: number;
    data: string;
    numero: string;
    descricao: string;
    arquivo?: string;
    arquivo_status_http?: number;
    problemas?: string[];
  }[];
  observacao?: string;
  processos?: ProcessoTransparencia[];
}

export interface TransparenciaSiteData {
  fonte: string;
  coletado_em: string;
  itens_do_menu: ItemMenuTransparencia[];
}

export interface Formulario {
  titulo: string;
  url: string;
}

export interface FormulariosData {
  fonte: string;
  coletado_em: string;
  formularios: Formulario[];
}

/** Um trecho de página informativa: título, texto, lista de itens e fecho. Tudo é opcional, menos o título. */
export interface BlocoDePagina {
  titulo: string;
  paragrafos?: string[];
  subtitulo?: string;
  itens?: string[];
  fecho?: string;
}

/** Página com conteúdo estruturado (ex.: IPTU Verde, Revisão do PDDU), de `data/paginas-informativas.json`. */
export interface PaginaInformativa {
  slug: string;
  nome: string;
  resumo: string;
  blocos: BlocoDePagina[];
  links: { texto: string; url: string }[];
}
