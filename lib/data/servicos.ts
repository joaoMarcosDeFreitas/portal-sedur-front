import raw from "@/data/servicos.json";
import type { CategoriaServico, Servico, ServicosData } from "@/types/servico";
import type { TipoSolicitacao } from "@/types/solicitacao";
import { slugify } from "@/lib/utils/slugify";
import { sleep } from "@/lib/utils/sleep";

const data = raw as unknown as ServicosData;

export function slugDaCategoria(categoria: Pick<CategoriaServico, "id" | "nome">): string {
  return slugify(categoria.nome);
}

export function slugDoServico(servico: Pick<Servico, "id" | "nome">): string {
  return `${slugify(servico.nome)}-${servico.id}`;
}

export async function getCategorias(): Promise<CategoriaServico[]> {
  await sleep();
  return data.categorias;
}

export async function getCategoriaPorSlug(slug: string): Promise<CategoriaServico | undefined> {
  await sleep();
  return data.categorias.find((categoria) => slugDaCategoria(categoria) === slug);
}

export async function getServicosDaCategoria(categoriaId: string): Promise<Servico[]> {
  await sleep();
  return data.servicos.filter((servico) => servico.categoria_id === categoriaId);
}

export async function getServicoPorSlug(
  categoriaSlug: string,
  servicoSlug: string,
): Promise<Servico | undefined> {
  await sleep();
  const categoria = data.categorias.find((c) => slugDaCategoria(c) === categoriaSlug);
  if (!categoria) return undefined;
  return data.servicos.find(
    (servico) => servico.categoria_id === categoria.id && slugDoServico(servico) === servicoSlug,
  );
}

export async function getTodosOsServicos(): Promise<Servico[]> {
  await sleep();
  return data.servicos;
}

export async function getServicoPorId(id: string): Promise<Servico | undefined> {
  await sleep();
  return data.servicos.find((servico) => servico.id === id);
}

export interface LinkResolvido {
  texto: string;
  url: string;
  /** Verdadeiro quando leva a outra ficha deste portal (em vez de sair para um arquivo ou site). */
  interno: boolean;
}

/**
 * Links que vêm dentro das abas das fichas (modelos de requerimento em PDF, manuais, material de
 * apoio). Os que apontam para outro serviço do portal antigo (`.../servico/6879`) viram link para a
 * ficha correspondente aqui; os demais seguem para o arquivo, sempre em https (o http antigo só
 * redireciona) e com os espaços do endereço codificados.
 */
export async function resolverLinkDeFicha(link: { texto: string; url: string }): Promise<LinkResolvido> {
  const texto = link.texto.trim();
  const id = link.url.match(/carta-servicos\/servico\/(\d+)/)?.[1];
  if (id) {
    const servico = await getServicoPorId(id);
    if (servico) {
      const categoria = slugDaCategoria({ id: servico.categoria_id, nome: servico.categoria });
      return { texto, url: `/servicos/${categoria}/${slugDoServico(servico)}`, interno: true };
    }
  }
  return { texto, url: link.url.replace(/^http:/, "https:").replace(/ /g, "%20"), interno: false };
}

/** Ação que a ficha oferece (botão): o que faz, como o portal atual chama e para onde leva aqui. */
export interface AcaoDaFicha {
  tipo: TipoSolicitacao;
  /** Trecho do endereço (`/solicitar/<id>/<segmento>`). */
  segmento: "emitir-dam" | "abrir-processo";
  /** Texto do botão, como no portal atual ("Emissão de DAM", "Abrir processo"). */
  rotulo: string;
  href: string;
}

const ACAO_POR_TIPO_DO_PORTAL: Record<string, Pick<AcaoDaFicha, "tipo" | "segmento" | "rotulo">> = {
  emitir_dam: { tipo: "dam", segmento: "emitir-dam", rotulo: "Emissão de DAM" },
  abrir_processo: { tipo: "processo", segmento: "abrir-processo", rotulo: "Abrir processo" },
};

/**
 * Os botões que a ficha realmente tem no portal atual: dos 151 serviços, 81 só emitem DAM, 50 só abrem
 * processo, 5 têm os dois e 15 não têm botão nenhum (só informação). Não inventamos ação para ninguém.
 */
export function acoesDoServico(servico: Pick<Servico, "id" | "acoes">): AcaoDaFicha[] {
  return (servico.acoes ?? []).flatMap((acao) => {
    const definicao = ACAO_POR_TIPO_DO_PORTAL[acao.tipo];
    return definicao ? [{ ...definicao, href: `/solicitar/${servico.id}/${definicao.segmento}` }] : [];
  });
}
