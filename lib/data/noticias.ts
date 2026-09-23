import raw from "@/data/noticias.json";
import type { Noticia, NoticiasData } from "@/types/noticia";
import { sleep } from "@/lib/utils/sleep";

const data = raw as unknown as NoticiasData;

const noticiasOrdenadas = [...data.noticias].sort((a, b) => (a.data < b.data ? 1 : -1));

export async function getNoticias(pagina = 1, porPagina = 12): Promise<{ itens: Noticia[]; total: number }> {
  await sleep();
  const inicio = (pagina - 1) * porPagina;
  return {
    itens: noticiasOrdenadas.slice(inicio, inicio + porPagina),
    total: noticiasOrdenadas.length,
  };
}

export async function getNoticiaPorId(id: number): Promise<Noticia | undefined> {
  await sleep();
  return data.noticias.find((noticia) => noticia.id === id);
}

/** A notícia anterior/próxima na ordem cronológica (corrige a inversão do portal atual). */
export async function getVizinhas(id: number): Promise<{ anterior?: Noticia; proxima?: Noticia }> {
  await sleep();
  const indice = noticiasOrdenadas.findIndex((noticia) => noticia.id === id);
  if (indice === -1) return {};
  return {
    anterior: noticiasOrdenadas[indice - 1],
    proxima: noticiasOrdenadas[indice + 1],
  };
}
