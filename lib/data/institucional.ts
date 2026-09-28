import paginasRaw from "@/data/paginas-informativas.json";
import dirigentesRaw from "@/data/dirigentes.json";
import institucionalRaw from "@/data/institucional.json";
import organogramaRaw from "@/data/organograma.json";
import projetosRaw from "@/data/projetos.json";
import projetosConteudoRaw from "@/data/projetos-conteudo.json";
import type {
  DirigentesData,
  InstitucionalData,
  OrganogramaData,
  PaginaInformativa,
  Projeto,
  BlocoDePagina,
  BlocoRico,
  ProjetoConteudo,
  TrechoDeTexto,
} from "@/types/institucional";
import { parseAreas, type AreaDeAtuacao } from "@/lib/normalize/institucional";
import { getCategorias, getServicoPorId, slugDaCategoria, slugDoServico } from "@/lib/data/servicos";
import { sleep } from "@/lib/utils/sleep";

const dirigentes = dirigentesRaw as unknown as DirigentesData;
const institucional = institucionalRaw as unknown as InstitucionalData;
const organograma = organogramaRaw as unknown as OrganogramaData;
const paginasInformativas = (paginasRaw as unknown as { paginas: PaginaInformativa[] }).paginas;
const projetos = projetosRaw as unknown as { fonte: string; coletado_em: string; projetos: Projeto[] };
const projetosConteudo = projetosConteudoRaw as unknown as { fonte: string; coletado_em: string; projetos: ProjetoConteudo[] };

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

/** Trecho de texto já com o link resolvido: `interno` = página deste portal; `indisponivel` = o destino não existe mais. */
export interface TrechoPronto {
  texto: string;
  negrito?: boolean;
  italico?: boolean;
  href?: string;
  interno?: boolean;
  indisponivel?: boolean;
}

export type BlocoPronto =
  | { tipo: "paragrafo" | "titulo"; runs: TrechoPronto[] }
  | { tipo: "lista"; ordenada: boolean; itens: TrechoPronto[][] }
  | { tipo: "tabela"; cabecalho: string[]; linhas: string[][] }
  | { tipo: "imagem"; src: string; alt: string; largura?: number; larguraReal: number; alturaReal: number; href?: string };

export interface ProjetoPronto {
  slug: string;
  nome: string;
  /** Ilustração redonda do projeto no site atual (só os seis projetos originais; os demais usam ícone). */
  imagem?: string;
  /** Frase de abertura: nas páginas informativas (IPTU Verde, PDDU) aparece na página; nas demais só descreve. */
  resumo?: string;
  /** Conteúdo dos seis projetos originais, com a estrutura da página do site atual (texto, lista, tabela, imagem). */
  conteudo?: BlocoPronto[];
  /** Páginas informativas (IPTU Verde, Revisão do PDDU): conteúdo em seções. */
  blocos?: BlocoDePagina[];
  links: LinkDoProjeto[];
}

/** As ilustrações que o site atual usa em "Nossos Projetos" (copiadas para public/projetos). */
const IMAGEM_DO_PROJETO: Record<string, string> = {
  "plano-de-incentivos-fiscais": "/projetos/incentivos-fiscais.jpg",
  "eu-curto-meu-passeio": "/projetos/eu-curto-meu-passeio.jpg",
  "conselho-municipal-salvador": "/projetos/conselho-municipal-salvador.jpg",
  tul: "/projetos/tul.jpg",
  revitalizar: "/projetos/revitalizar.jpg",
  pidi: "/projetos/pidi.jpg",
};

/**
 * Links do texto dos projetos: serviço/categoria do portal antigo viram página deste portal; o endereço
 * raiz do Portal de Serviços vira a lista de serviços; links que já não existem (404) ficam só como texto.
 */
async function resolverTrecho(trecho: TrechoDeTexto): Promise<TrechoPronto> {
  const { href, indisponivel, ...resto } = trecho;
  if (indisponivel || !href) return indisponivel ? { ...resto, indisponivel: true } : { ...resto };

  const servicoId = href.match(/servico\/(\d+)/)?.[1];
  if (servicoId) {
    const servico = await getServicoPorId(servicoId);
    if (servico) {
      const categoria = slugDaCategoria({ id: servico.categoria_id, nome: servico.categoria });
      return { ...resto, href: `/servicos/${categoria}/${slugDoServico(servico)}`, interno: true };
    }
  }
  const categoriaId = href.match(/categoria-atendimento\/(\d+)/)?.[1];
  if (categoriaId) {
    const categoria = (await getCategorias()).find((c) => c.id === categoriaId);
    if (categoria) return { ...resto, href: `/servicos/${slugDaCategoria(categoria)}`, interno: true };
  }
  if (/^https:\/\/servicos\.sedur\.salvador\.ba\.gov\.br\/?$/.test(href)) return { ...resto, href: "/servicos", interno: true };
  return { ...resto, href: href.replace(/ /g, "%20") };
}

async function prepararBloco(bloco: BlocoRico): Promise<BlocoPronto> {
  switch (bloco.tipo) {
    case "paragrafo":
    case "titulo":
      return { tipo: bloco.tipo, runs: await Promise.all(bloco.runs.map(resolverTrecho)) };
    case "lista":
      return { tipo: "lista", ordenada: bloco.ordenada, itens: await Promise.all(bloco.itens.map((item) => Promise.all(item.map(resolverTrecho)))) };
    default:
      return bloco;
  }
}

const textoDoBloco = (bloco: BlocoRico) => (bloco.tipo === "paragrafo" ? bloco.runs.map((r) => r.texto).join("") : "");

async function prepararProjeto(projeto: Projeto): Promise<ProjetoPronto> {
  const conteudo = projetosConteudo.projetos.find((c) => c.slug === projeto.slug);
  const primeiro = conteudo?.blocos.map(textoDoBloco).find((texto) => texto.length > 40);
  return {
    slug: projeto.slug,
    nome: projeto.nome,
    imagem: IMAGEM_DO_PROJETO[projeto.slug],
    resumo: primeiro,
    conteudo: conteudo ? await Promise.all(conteudo.blocos.map(prepararBloco)) : undefined,
    links: [],
  };
}

export async function getProjetos(): Promise<ProjetoPronto[]> {
  await sleep();
  const dosProjetos = await Promise.all(projetos.projetos.map(prepararProjeto));
  // Páginas informativas (IPTU Verde, Revisão do PDDU) aparecem junto dos projetos.
  const informativas: ProjetoPronto[] = paginasInformativas.map((pagina) => ({
    slug: pagina.slug,
    nome: pagina.nome,
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
