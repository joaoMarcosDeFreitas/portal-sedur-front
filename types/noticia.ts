export interface LinkNoCorpo {
  texto: string;
  url: string;
}

export interface Noticia {
  id: number;
  url: string;
  titulo: string;
  data: string;
  data_na_lista?: string;
  imagem_miniatura?: string;
  pagina_da_lista?: number;
  texto_baixado: boolean;
  publicado_na_pagina?: string;
  paragrafos?: string[];
  imagens_no_corpo?: string[];
  links_no_corpo?: LinkNoCorpo[];
}

export interface NoticiasData {
  fonte: string;
  coletado_em: string;
  total_na_lista: number;
  com_texto_baixado: number;
  noticias: Noticia[];
}
