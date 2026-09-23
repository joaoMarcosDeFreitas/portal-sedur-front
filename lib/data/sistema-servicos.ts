import raw from "@/data/servicos-sistema.json";
import type { Consulta, SistemaServicosData } from "@/types/sistema-servicos";
import { sleep } from "@/lib/utils/sleep";
import { slugify } from "@/lib/utils/slugify";

const data = raw as unknown as SistemaServicosData;

export async function getConsultas(): Promise<Consulta[]> {
  await sleep();
  return data.consultas;
}

export async function getConsultaPorSlug(slug: string) {
  await sleep();
  return data.consultas.find((consulta) => slugify(consulta.nome) === slug);
}

export async function getPainelDeTransparencia() {
  await sleep();
  return data.transparencia_do_portal;
}

export async function getGeoservicos() {
  await sleep();
  return data.geoservicos;
}

export async function getCanaisDeAtendimento() {
  await sleep();
  return data.canais_de_atendimento;
}

export async function getSistemasParceiros() {
  await sleep();
  return data.sistemas_parceiros;
}

export async function getServicosDispensadosDeLicenca() {
  await sleep();
  return data.servicos_dispensados_de_licenca;
}
