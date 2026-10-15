import raw from "@/data/acesso-interno.json";
import { sleep } from "@/lib/utils/sleep";

export interface SistemaInterno {
  slug: string;
  nome: string;
  /** Endereço real do sistema (só funciona para quem está na rede/com login da SEDUR). */
  url: string;
  /** `false` = o link não abriu durante a produção deste site: o cartão leva à página de aviso. */
  disponivel: boolean;
}

const sistemas = raw.sistemas as SistemaInterno[];

/** Os 11 sistemas do "Acesso Interno", na ordem da tela original. */
export async function getSistemasInternos(): Promise<SistemaInterno[]> {
  await sleep();
  return sistemas;
}

export async function getSistemaInterno(slug: string): Promise<SistemaInterno | undefined> {
  await sleep();
  return sistemas.find((sistema) => sistema.slug === slug);
}
