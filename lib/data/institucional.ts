import paginasRaw from "@/data/paginas-informativas.json";
import dirigentesRaw from "@/data/dirigentes.json";
import institucionalRaw from "@/data/institucional.json";
import organogramaRaw from "@/data/organograma.json";
import projetosRaw from "@/data/projetos.json";
import type {
  DirigentesData,
  InstitucionalData,
  OrganogramaData,
  PaginaInformativa,
  Projeto,
  BlocoDePagina,
} from "@/types/institucional";
import { parseAreas, parseProjeto, type AreaDeAtuacao } from "@/lib/normalize/institucional";
import { getServicoPorId, slugDaCategoria, slugDoServico } from "@/lib/data/servicos";
import { sleep } from "@/lib/utils/sleep";

const dirigentes = dirigentesRaw as unknown as DirigentesData;
const institucional = institucionalRaw as unknown as InstitucionalData;
const organograma = organogramaRaw as unknown as OrganogramaData;
const paginasInformativas = (paginasRaw as unknown as { paginas: PaginaInformativa[] }).paginas;
const projetos = projetosRaw as unknown as { fonte: string; coletado_em: string; projetos: Projeto[] };

export async function getDirigentes() {
  await sleep();
  return dirigentes.dirigentes;
}

// Cada área de atuação da SEDUR corresponde a uma categoria da Carta de Serviços.
const DADOS_DA_AREA: Record<string, { slug: string; titulo: string; categoria: string }> = {
  EMPREENDIMENTOS: { slug: "empreendimentos", titulo: "Empreendimentos", categoria: "Empreendimento" },
  "ATIVIDADES ECONÔMICAS": { slug: "atividades-economicas", titulo: "Atividades econômicas", categoria: "Viabilidade de Localização" },
  PUBLICIDADE: { slug: "publicidade", titulo: "Publicidade", categoria: "Publicidade" },
  EVENTOS: { slug: "eventos", titulo: "Eventos", categoria: "Eventos" },
  URBANISMO: { slug: "urbanismo", titulo: "Urbanismo", categoria: "Urbanismo" },
  AMBIENTAL: { slug: "ambiental", titulo: "Ambiental", categoria: "Ambiental" },
  "DESENVOLVIMENTO URBANO": { slug: "desenvolvimento-urbano", titulo: "Desenvolvimento urbano", categoria: "Desenvolvimento Econômico" },
};

export interface AreaPronta extends AreaDeAtuacao {
  slug: string;
  titulo: string;
  /** Nome da categoria de serviços ligada a esta área (para o ícone e o link "Ver serviços"). */
  categoria: string;
}

export async function getAreasDeAtuacao(): Promise<{ introducao: string; areas: AreaPronta[] }> {
  await sleep();
  const { introducao, areas } = parseAreas(institucional.texto_integral, institucional.areas);
  return {
    introducao,
    areas: areas.map((area) => {
      const dados = DADOS_DA_AREA[area.nome] ?? { slug: area.nome.toLowerCase(), titulo: area.nome, categoria: "" };
      return { ...area, ...dados };
    }),
  };
}

export async function getOrganograma() {
  await sleep();
  return organograma.gabinete_do_secretario;
}

export interface LinkDoProjeto {
  texto: string;
  url: string;
  /** Verdadeiro quando o link leva a uma página deste portal (ficha de serviço). */
  interno: boolean;
}

export interface ProjetoPronto {
  slug: string;
  nome: string;
  paragrafos: string[];
  links: LinkDoProjeto[];
  /** Só nas páginas informativas (IPTU Verde, Revisão do PDDU): frase de abertura e conteúdo em blocos. */
  resumo?: string;
  blocos?: BlocoDePagina[];
}

/** Links de serviço do portal antigo viram links para a ficha do serviço neste portal. */
async function resolverLink(texto: string, url: string): Promise<LinkDoProjeto> {
  const servicoId = url.match(/detalhe-servico\/(\d+)/)?.[1] ?? url.match(/servico\/(\d+)/)?.[1];
  if (servicoId) {
    const servico = await getServicoPorId(servicoId);
    if (servico) {
      const categoria = slugDaCategoria({ id: servico.categoria_id, nome: servico.categoria });
      return { texto, url: `/servicos/${categoria}/${slugDoServico(servico)}`, interno: true };
    }
  }
  return { texto, url, interno: false };
}

async function prepararProjeto(projeto: Projeto): Promise<ProjetoPronto> {
  const validos = (projeto.links ?? []).filter((link) => {
    const status = link.arquivo_status_http;
    // Some com o que está quebrado (404 etc.); redirecionamentos (301/302) abrem normalmente.
    return status === undefined || status === 200 || status === 301 || status === 302;
  });
  const links = await Promise.all(validos.map((link) => resolverLink(link.texto.trim(), link.url)));
  return {
    slug: projeto.slug,
    nome: projeto.nome,
    paragrafos: parseProjeto(projeto.texto, projeto.titulo_na_pagina ?? projeto.nome),
    links: links.filter((link) => link.texto),
  };
}

export async function getProjetos(): Promise<ProjetoPronto[]> {
  await sleep();
  const dosProjetos = await Promise.all(projetos.projetos.map(prepararProjeto));
  // Páginas informativas (IPTU Verde, Revisão do PDDU) aparecem junto dos programas e projetos.
  const informativas: ProjetoPronto[] = paginasInformativas.map((pagina) => ({
    slug: pagina.slug,
    nome: pagina.nome,
    paragrafos: [],
    resumo: pagina.resumo,
    blocos: pagina.blocos,
    links: pagina.links.map((link) => ({ ...link, interno: false })),
  }));
  return [...dosProjetos, ...informativas];
}

export async function getProjetoPorSlug(slug: string): Promise<ProjetoPronto | undefined> {
  const todos = await getProjetos();
  return todos.find((projeto) => projeto.slug === slug);
}
