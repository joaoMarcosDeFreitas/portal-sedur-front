import type { Servico } from "@/types/servico";
import { normalizar } from "@/lib/utils/normalizar";
import { limparTexto, temConteudo } from "./texto";

const ROTULO_ABA: Record<keyof Servico["abas"], string> = {
  descricao: "Descrição",
  "documentacao-exigida": "Documentação exigida",
  informacoes: "Informações",
  taxas: "Taxas",
  prazo: "Prazo",
  local: "Local e horário",
};

export interface AbaFicha {
  chave: string;
  rotulo: string;
  conteudo: string;
}

/** Só devolve as abas que realmente têm conteúdo (esconde as "N/A"/vazias do portal atual). */
export function abasComConteudo(servico: Servico): AbaFicha[] {
  return (Object.keys(ROTULO_ABA) as (keyof Servico["abas"])[])
    .map((chave) => ({
      chave,
      rotulo: ROTULO_ABA[chave],
      conteudo: limparTexto(servico.abas[chave]),
    }))
    .filter((aba) => temConteudo(aba.conteudo));
}

/** Texto com quebras de linha vira lista de linhas não vazias. */
export function paraLista(texto: string): string[] {
  return limparTexto(texto)
    .split("\n")
    .map((linha) => linha.trim())
    .filter(Boolean);
}

/** Junta linhas quebradas no meio da frase (o portal atual quebra o texto em pedaços). */
export function paraParagrafo(texto: string): string {
  return paraLista(texto).join(" ");
}

export interface DocumentoExigido {
  titulo: string;
  observacoes: string[];
  indispensavel: boolean;
}

const MARCADOR_INDISPENSAVEL = /^ITEM INDISPENS[ÁA]VEL/i;
const PREFIXO_OBSERVACAO = /^Observa[çc][ãa]o:\s*/i;
// Linhas que continuam a observação anterior (itens "a)", "I -", "1." ou "Para fins...").
const CONTINUACAO = /^([IVX]+\s*[-–.)]|[a-z]\)|\d+\s*[-–.)])|^Para fins/;

/**
 * A aba "Documentação exigida" vem como texto corrido: cada documento é uma linha, seguida
 * de linhas "Observação: ..."; a linha "ITEM INDISPENSÁVEL PARA ANÁLISE" vem *depois* do
 * documento a que se refere (confirmado nos dados: aparece até como última linha da lista).
 */
export function parseDocumentos(texto: string): DocumentoExigido[] {
  const linhas = paraLista(texto);
  const corpo = /^lista de documentos/i.test(linhas[0] ?? "") ? linhas.slice(1) : linhas;

  const documentos: DocumentoExigido[] = [];
  let emObservacao = false;

  for (const linha of corpo) {
    const atual = documentos[documentos.length - 1];

    if (MARCADOR_INDISPENSAVEL.test(linha)) {
      if (atual) atual.indispensavel = true;
      continue;
    }
    if (PREFIXO_OBSERVACAO.test(linha) && atual) {
      atual.observacoes.push(linha.replace(PREFIXO_OBSERVACAO, ""));
      emObservacao = true;
      continue;
    }
    if (emObservacao && atual && CONTINUACAO.test(linha)) {
      atual.observacoes.push(linha);
      continue;
    }
    documentos.push({ titulo: linha, observacoes: [], indispensavel: false });
    emObservacao = false;
  }

  return documentos;
}

export interface ItemTaxa {
  descricao: string;
  valor: string;
}

export interface TaxasFicha {
  itens: ItemTaxa[];
  nota?: string;
}

/**
 * A aba "Taxas" vem como "Descrição / Valor (R$)" seguido de pares (descrição, "R$ x") e, no
 * fim, um parágrafo legal repetido em todas as fichas (mantido como nota de rodapé).
 */
export function parseTaxas(texto: string): TaxasFicha {
  const linhas = paraLista(texto);
  const inicioNota = linhas.findIndex((linha) => /^Valores definidos com base/i.test(linha));
  const tabela = inicioNota === -1 ? linhas : linhas.slice(0, inicioNota);
  const nota = inicioNota === -1 ? undefined : paraParagrafo(linhas.slice(inicioNota).join("\n"));

  const corpo = tabela.filter((linha) => !/^(Descrição|Valor \(R\$\))$/i.test(linha));
  const itens: ItemTaxa[] = [];
  for (let i = 0; i < corpo.length; i += 1) {
    const proxima = corpo[i + 1];
    if (proxima?.startsWith("R$")) {
      itens.push({ descricao: corpo[i], valor: proxima });
      i += 1;
    }
  }
  return { itens, nota };
}

/** Prazo: a 1ª linha é o prazo em si; as demais são observações (ex.: diligências). */
export function parsePrazo(texto: string): { principal: string; observacoes: string[] } {
  const [principal = "", ...observacoes] = paraLista(texto);
  return { principal, observacoes };
}

/** Chave para comparar textos ignorando acento, caixa e pontuação. */
const chave = (texto: string) => normalizar(texto).replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();

/**
 * Links (modelos em PDF etc.) que pertencem a um documento exigido: o texto do link é o próprio
 * nome do documento (ou parte dele). Conferido nos dados: os 48 links de documentos das fichas casam.
 */
export function linksDoDocumento<T extends { texto: string }>(titulo: string, links: T[]): T[] {
  const alvo = chave(titulo);
  return links.filter((link) => {
    const texto = chave(link.texto);
    return texto.length > 0 && (alvo.includes(texto) || texto.includes(alvo));
  });
}
