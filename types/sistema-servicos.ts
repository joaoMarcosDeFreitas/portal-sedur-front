/**
 * Tipos para servicos-sistema.json — o "resto" do Portal de Serviços (fora da Carta de
 * Serviços em si). Muitos campos vêm como texto bruto lido da página antiga (`texto_lido`,
 * `blocos`, iframes com base64) porque esse conteúdo é curado manualmente ao escrever as
 * páginas novas, não renderizado campo a campo — por isso vários tipos ficam propositalmente
 * amplos aqui.
 */

export interface CampoFormularioLegado {
  tag?: string;
  tipo?: string;
  nome?: string;
  rotulo?: string | null;
  placeholder?: string | null;
  texto?: string | null;
}

export interface Consulta {
  nome: string;
  tecnologia?: string;
  url: string;
  url_do_sistema_antigo?: string;
  url_voltar?: string;
  titulo_dentro_da_janela?: string;
  campos?: CampoFormularioLegado[];
}

export interface ItemTransparenciaPortal {
  nome: string;
  tipo?: string;
  url: string;
  observacao?: string;
  url_do_sistema_antigo?: string;
  campos?: CampoFormularioLegado[];
}

export interface CardPaginaInicial {
  nome: string;
  url?: string;
  destino?: string;
}

export interface BannerPaginaInicial {
  nome: string;
  url: string;
  situacao?: string;
}

export interface PaginaInicialSistema {
  url: string;
  frase: string;
  busca: string;
  cards: CardPaginaInicial[];
  banners_de_imagem: BannerPaginaInicial[];
  carrossel_fique_por_dentro?: { descricao_da_imagem: string; url: string; observacao?: string }[];
  texto_lido?: string[];
}

export interface CamadaGeoservico {
  nome: string;
  descricao?: string;
}

export interface SistemaParceiro {
  nome: string;
  url: string;
  situacao?: string;
}

export interface PaginaComTextoLido {
  url: string;
  sem_link_visivel?: boolean;
  texto_lido: string[];
}

export interface SistemaServicosData {
  fonte: string;
  coletado_em: string;
  observacao?: string;
  titulo_da_aba_em_todas_as_paginas: string;
  menu_topo: string[];
  rodape: {
    endereco: string;
    horarios: string;
    copyright: string;
  };
  acessibilidade: {
    barra: string[];
    vlibras: boolean;
  };
  pagina_inicial: PaginaInicialSistema;
  carta_de_servicos: {
    url: string;
    grupos: string[];
  };
  servicos_dispensados_de_licenca: {
    url: string;
    texto_lido: string[];
  };
  consultas: Consulta[];
  formularios: {
    url: string;
    dados?: string;
  };
  geoservicos: {
    url: string;
    texto_lido: string[];
    camadas?: CamadaGeoservico[];
  };
  transparencia_do_portal: {
    url: string;
    itens: ItemTransparenciaPortal[];
  };
  fiscalizacao_carnaval_2026?: PaginaComTextoLido;
  iptu_verde?: PaginaComTextoLido;
  canais_de_atendimento: {
    url: string;
    blocos: Record<string, string>;
  };
  paginas_de_erro?: Record<string, string>;
  login?: {
    "gov.br"?: string;
    tela_demo_aberta?: string;
  };
  sistemas_parceiros: SistemaParceiro[];
}
