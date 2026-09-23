import type { StatusSolicitacao } from "@/types/solicitacao";

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
