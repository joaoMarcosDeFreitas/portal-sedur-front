import raw from "@/data/legislacao.json";
import type { DocumentoLegislacao, LegislacaoData, SecaoLegislacao } from "@/types/legislacao";
import { dataParaISO, formatarTamanho, normalizarNumero } from "@/lib/normalize/legislacao";
import { normalizar } from "@/lib/utils/normalizar";
import { sleep } from "@/lib/utils/sleep";

const data = raw as unknown as LegislacaoData;

/** Documento pronto para exibir/serializar (o que vai para o cliente). */
export interface ItemLegislacao {
  id: string;
  numero: string;
  data: string;
  descricao: string;
  secaoId: string;
  secao: string;
  subsecaoId?: string;
  subsecao?: string;
  /** Só existe quando o arquivo abre de verdade (sem link quebrado, vazio ou 404). */
  url?: string;
  tamanho?: string;
}

export interface ResumoSubsecao {
  /** Vai na URL: "comunicados", "resolucoes"... */
  id: string;
  nome: string;
  total: number;
}

export interface ResumoSecao {
  id: string;
  nome: string;
  total: number;
  /** Só existe nos tipos que se dividem (CNLU, Desapropriação, LOUOS, PDDU, Taxas/Multas). */
  subsecoes?: ResumoSubsecao[];
}

/** "sub_797-comunicados" -> "comunicados" */
const idDaSubsecao = (idOriginal: string) => idOriginal.replace(/^sub_\d+-/, "");

interface DocumentoNaSecao {
  doc: DocumentoLegislacao;
  subsecaoId?: string;
  subsecao?: string;
}

function documentosDaSecao(secao: SecaoLegislacao): DocumentoNaSecao[] {
  if (secao.itens) return secao.itens.map((doc) => ({ doc }));
  return (secao.subsecoes ?? []).flatMap((sub) =>
    sub.itens.map((doc) => ({ doc, subsecaoId: idDaSubsecao(sub.id), subsecao: sub.nome })),
  );
}

function arquivoDisponivel(doc: DocumentoLegislacao): boolean {
  return Boolean(doc.arquivo) && doc.problemas.length === 0 && doc.arquivo_status_http === 200;
}

interface Indexado {
  item: ItemLegislacao;
  iso: string;
  busca: string;
}

// Achata as 14 seções uma vez só. Linhas em branco do portal atual (sem número e sem descrição)
// não viram documento.
const TODOS: Indexado[] = data.secoes
  .flatMap((secao) =>
    documentosDaSecao(secao).map(({ doc, subsecaoId, subsecao }, indice): Indexado => {
      const numero = normalizarNumero(doc.numero);
      const disponivel = arquivoDisponivel(doc);
      return {
        item: {
          id: `${secao.id}-${subsecaoId ? `${subsecaoId}-` : ""}${indice}`,
          numero,
          data: doc.data,
          descricao: doc.descricao.trim(),
          secaoId: secao.id,
          secao: secao.nome,
          subsecaoId,
          subsecao,
          url: disponivel ? doc.arquivo : undefined,
          tamanho: disponivel ? formatarTamanho(doc.arquivo_bytes) : undefined,
        },
        iso: dataParaISO(doc.data),
        busca: normalizar(`${numero} ${doc.descricao} ${secao.nome} ${subsecao ?? ""}`),
      };
    }),
  )
  .filter(({ item }) => item.numero || item.descricao)
  .sort((a, b) => (a.iso < b.iso ? 1 : a.iso > b.iso ? -1 : 0));

const contar = (secaoId: string, subsecaoId?: string) =>
  TODOS.filter(({ item }) => item.secaoId === secaoId && (!subsecaoId || item.subsecaoId === subsecaoId)).length;

export async function getResumoSecoes(): Promise<ResumoSecao[]> {
  await sleep();
  return data.secoes.map((secao) => ({
    id: secao.id,
    nome: secao.nome,
    total: contar(secao.id),
    subsecoes: secao.subsecoes?.map((sub) => ({
      id: idDaSubsecao(sub.id),
      nome: sub.nome,
      total: contar(secao.id, idDaSubsecao(sub.id)),
    })),
  }));
}

export interface ConsultaLegislacao {
  q?: string;
  secao?: string;
  subsecao?: string;
  pagina?: number;
  porPagina?: number;
}

export interface RespostaLegislacao {
  itens: ItemLegislacao[];
  total: number;
}

/** Busca por número/descrição (sem exigir acento), tipo e subtipo, do mais recente ao mais antigo. */
export async function buscarLegislacao({
  q = "",
  secao,
  subsecao,
  pagina = 1,
  porPagina = 20,
}: ConsultaLegislacao): Promise<RespostaLegislacao> {
  await sleep(120);
  const termos = normalizar(q).split(/\s+/).filter(Boolean);
  const filtrados = TODOS.filter(
    ({ item, busca }) =>
      (!secao || item.secaoId === secao) &&
      (!subsecao || item.subsecaoId === subsecao) &&
      termos.every((termo) => busca.includes(termo)),
  );
  const inicio = (pagina - 1) * porPagina;
  return {
    total: filtrados.length,
    itens: filtrados.slice(inicio, inicio + porPagina).map(({ item }) => item),
  };
}
