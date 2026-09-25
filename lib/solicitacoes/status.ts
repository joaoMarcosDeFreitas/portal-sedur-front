import type { Solicitacao, StatusSolicitacao, TipoSolicitacao } from "@/types/solicitacao";

export const ROTULO_STATUS: Record<StatusSolicitacao, string> = {
  aguardando_pagamento: "Aguardando pagamento",
  em_analise: "Em análise",
  concluida: "Concluída",
};

export const TOM_STATUS: Record<StatusSolicitacao, "warning" | "primary" | "success"> = {
  aguardando_pagamento: "warning",
  em_analise: "primary",
  concluida: "success",
};

export function formatarData(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR");
}

export function formatarDataHora(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

/** Nome do que foi pedido, igual ao botão da ficha ou do portal atual. */
export const ROTULO_TIPO: Record<TipoSolicitacao, string> = {
  dam: "Emissão de DAM",
  processo: "Abertura de processo",
};

/** Uma emissão de DAM paga não está "concluída" como um processo: o que se mostra é "Pago". */
export function rotuloDoStatus(s: Pick<Solicitacao, "tipo" | "status">): string {
  return s.tipo === "dam" && s.status === "concluida" ? "Pago" : ROTULO_STATUS[s.status];
}
