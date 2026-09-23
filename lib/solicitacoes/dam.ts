import type { ItemTaxa } from "@/lib/normalize/servico";

const COBRADA_POR_AREA = /m²|m2/i;

/** "R$ 2.104,18" -> 2104.18 */
export function parseValor(texto: string): number {
  const numero = texto.replace(/[^\d,]/g, "").replace(",", ".");
  return Number(numero) || 0;
}

export function formatarValor(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** Algumas taxas são "por m²": nesses serviços o cidadão informa a área da intervenção. */
export function exigeArea(taxas: ItemTaxa[]): boolean {
  return taxas.some((taxa) => COBRADA_POR_AREA.test(taxa.descricao));
}

export function calcularValorDam(taxas: ItemTaxa[], area: number): number {
  return taxas.reduce((total, taxa) => {
    const multiplicador = COBRADA_POR_AREA.test(taxa.descricao) ? Math.max(area, 0) : 1;
    return total + parseValor(taxa.valor) * multiplicador;
  }, 0);
}
