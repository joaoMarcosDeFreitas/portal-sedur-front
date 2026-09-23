import raw from "@/data/licitacoes.json";
import type { Licitacao, LicitacoesData } from "@/types/licitacao";
import { sleep } from "@/lib/utils/sleep";

const data = raw as unknown as LicitacoesData;

export async function getLicitacoes(): Promise<Licitacao[]> {
  await sleep();
  return [...data.itens].sort((a, b) => (a.data < b.data ? 1 : -1));
}
