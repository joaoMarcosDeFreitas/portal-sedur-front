import raw from "@/data/licitacoes.json";
import type { LicitacoesData } from "@/types/licitacao";
import { chaveDoProcesso, descricaoLegivel, modalidadeDe, type Modalidade } from "@/lib/normalize/licitacao";
import { formatarTamanho } from "@/lib/normalize/legislacao";
import { sleep } from "@/lib/utils/sleep";

const data = raw as unknown as LicitacoesData;

export interface DocumentoLicitacao {
  titulo: string;
  /** ISO (AAAA-MM-DD). */
  data: string;
  url?: string;
  tamanho?: string;
}

/** Um processo (edital + avisos + retificações) ou um documento avulso. */
export interface EntradaLicitacao {
  id: string;
  titulo: string;
  modalidade: Modalidade;
  ano: string;
  /** Data mais recente entre os documentos. */
  data: string;
  descricao: string;
  documentos: DocumentoLicitacao[];
}

export async function getEntradasDeLicitacoes(): Promise<EntradaLicitacao[]> {
  await sleep();
  const porChave = new Map<string, EntradaLicitacao>();
  const entradas: EntradaLicitacao[] = [];

  data.itens.forEach((item, indice) => {
    const modalidade = modalidadeDe(item.titulo);
    const chave = chaveDoProcesso(item.titulo, modalidade);
    const disponivel = Boolean(item.arquivo) && item.arquivo_status_http === 200 && !item.problemas.includes("arquivo_nao_encontrado_404");
    const documento: DocumentoLicitacao = {
      titulo: item.titulo.replace(/\s+/g, " ").trim(),
      data: item.data,
      url: disponivel ? item.arquivo : undefined,
      tamanho: disponivel ? formatarTamanho(item.arquivo_bytes) : undefined,
    };
    const existente = chave ? porChave.get(chave) : undefined;

    if (existente) {
      existente.documentos.push(documento);
      if (item.data > existente.data) existente.data = item.data;
      // O objeto mais completo costuma estar no edital: fica com a descrição mais longa.
      const nova = descricaoLegivel(item.descricao);
      if (nova.length > existente.descricao.length) existente.descricao = nova;
      return;
    }

    const entrada: EntradaLicitacao = {
      id: `licitacao-${indice}`,
      titulo: chave ?? documento.titulo,
      modalidade,
      ano: item.data.slice(0, 4),
      data: item.data,
      descricao: descricaoLegivel(item.descricao),
      documentos: [documento],
    };
    entradas.push(entrada);
    if (chave) porChave.set(chave, entrada);
  });

  entradas.forEach((entrada) => entrada.documentos.sort((a, b) => (a.data < b.data ? 1 : -1)));
  return entradas.sort((a, b) => (a.data < b.data ? 1 : -1));
}
