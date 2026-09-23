import raw from "@/data/servicos.json";
import type { CategoriaServico, Servico, ServicosData } from "@/types/servico";
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
