import dirigentesRaw from "@/data/dirigentes.json";
import institucionalRaw from "@/data/institucional.json";
import organogramaRaw from "@/data/organograma.json";
import projetosRaw from "@/data/projetos.json";
import type {
  DirigentesData,
  InstitucionalData,
  OrganogramaData,
  Projeto,
} from "@/types/institucional";
import { sleep } from "@/lib/utils/sleep";

const dirigentes = dirigentesRaw as unknown as DirigentesData;
const institucional = institucionalRaw as unknown as InstitucionalData;
const organograma = organogramaRaw as unknown as OrganogramaData;
const projetos = projetosRaw as unknown as { fonte: string; coletado_em: string; projetos: Projeto[] };

export async function getDirigentes() {
  await sleep();
  return dirigentes.dirigentes;
}

export async function getAreaDeAtuacao() {
  await sleep();
  return institucional;
}

export async function getOrganograma() {
  await sleep();
  return organograma.gabinete_do_secretario;
}

export async function getProjetos(): Promise<Projeto[]> {
  await sleep();
  return projetos.projetos;
}

export async function getProjetoPorSlug(slug: string): Promise<Projeto | undefined> {
  await sleep();
  return projetos.projetos.find((projeto) => projeto.slug === slug);
}
