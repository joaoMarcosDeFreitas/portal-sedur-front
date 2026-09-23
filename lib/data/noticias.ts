import raw from "@/data/noticias.json";
import type { Noticia, NoticiasData } from "@/types/noticia";
import { normalizar } from "@/lib/utils/normalizar";
import { sleep } from "@/lib/utils/sleep";

const data = raw as unknown as NoticiasData;

// Da mais recente para a mais antiga; datas iguais desempatam pelo id (maior = mais nova).
const ORDENADAS = [...data.noticias].sort((a, b) =>
  a.data === b.data ? b.id - a.id : a.data < b.data ? 1 : -1,
);

// Índice de busca: título + texto (quando o texto foi coletado).
const INDICE = new Map(
  ORDENADAS.map((noticia) => [noticia.id, normalizar(`${noticia.titulo} ${(noticia.paragrafos ?? []).join(" ")}`)]),
);

export interface ConsultaNoticias {
  q?: string;
  ano?: string;
  pagina?: number;
  porPagina?: number;
}

export async function buscarNoticias({ q = "", ano, pagina = 1, porPagina = 12 }: ConsultaNoticias) {
  await sleep();
  const termos = normalizar(q).split(/\s+/).filter(Boolean);
  const filtradas = ORDENADAS.filter(
    (noticia) =>
      (!ano || noticia.data.startsWith(ano)) && termos.every((termo) => INDICE.get(noticia.id)?.includes(termo)),
  );
  const inicio = (pagina - 1) * porPagina;
  return {
    itens: filtradas.slice(inicio, inicio + porPagina),
    total: filtradas.length,
    paginas: Math.max(1, Math.ceil(filtradas.length / porPagina)),
  };
}

export async function getAnosDasNoticias(): Promise<string[]> {
  await sleep();
  return [...new Set(ORDENADAS.map((noticia) => noticia.data.slice(0, 4)))];
}

export async function getTodasAsNoticias(): Promise<Noticia[]> {
  await sleep();
  return ORDENADAS;
}

export async function getNoticiaPorId(id: number): Promise<Noticia | undefined> {
  await sleep();
  return ORDENADAS.find((noticia) => noticia.id === id);
}

/** Vizinhas em ordem cronológica: `maisRecente` vem antes na lista, `maisAntiga` depois. */
export async function getVizinhas(id: number): Promise<{ maisRecente?: Noticia; maisAntiga?: Noticia }> {
  await sleep();
  const indice = ORDENADAS.findIndex((noticia) => noticia.id === id);
  if (indice === -1) return {};
  return { maisRecente: ORDENADAS[indice - 1], maisAntiga: ORDENADAS[indice + 1] };
}
