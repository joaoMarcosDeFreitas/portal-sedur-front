import raw from "@/data/legislacao.json";
import type { DocumentoLegislacao, LegislacaoData, SecaoLegislacao } from "@/types/legislacao";
import { slugify } from "@/lib/utils/slugify";
import { sleep } from "@/lib/utils/sleep";

const data = raw as unknown as LegislacaoData;

export function slugDaSecao(secao: Pick<SecaoLegislacao, "id" | "nome">): string {
  return secao.id || slugify(secao.nome);
}

export async function getSecoes(): Promise<SecaoLegislacao[]> {
  await sleep();
  return data.secoes;
}

export async function getSecaoPorSlug(slug: string): Promise<SecaoLegislacao | undefined> {
  await sleep();
  return data.secoes.find((secao) => slugDaSecao(secao) === slug);
}

/** Junta os itens de uma seção, incluindo os das subseções (quando existirem). */
export function documentosDaSecao(secao: SecaoLegislacao): DocumentoLegislacao[] {
  if (secao.itens) return secao.itens;
  return (secao.subsecoes ?? []).flatMap((sub) => sub.itens);
}

export async function buscarDocumentos(termo: string): Promise<DocumentoLegislacao[]> {
  await sleep();
  const alvo = termo.trim().toLowerCase();
  if (!alvo) return [];
  return data.secoes
    .flatMap((secao) => documentosDaSecao(secao))
    .filter(
      (doc) =>
        doc.descricao.toLowerCase().includes(alvo) || doc.numero.toLowerCase().includes(alvo),
    );
}

export async function totalDeDocumentos(): Promise<number> {
  await sleep();
  return data.secoes.reduce((total, secao) => total + documentosDaSecao(secao).length, 0);
}
