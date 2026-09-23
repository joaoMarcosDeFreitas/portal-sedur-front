import raw from "@/data/transparencia-site.json";
import type { TransparenciaSiteData } from "@/types/institucional";
import { sleep } from "@/lib/utils/sleep";

const data = raw as unknown as TransparenciaSiteData;

/**
 * O portal atual tem duas seções de "Transparência" que não se conversam (a do site
 * institucional e a do Portal de Serviços). Este módulo cobre a do site; a do Portal de
 * Serviços vem de `lib/data/sistema-servicos.ts#getPainelDeTransparencia`. As páginas do
 * mock apresentam as duas juntas, unificadas, conforme o plano.
 */
export async function getItensDeTransparenciaDoSite() {
  await sleep();
  return data.itens_do_menu;
}
