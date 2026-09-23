import { createElement } from "react";
import { iconeDaSecao, iconeDaSubsecao } from "@/lib/ui/legislacao-icons";

interface LegislacaoIconProps {
  secaoId: string;
  subsecaoId?: string;
  className?: string;
}

/** Ícone de um tipo (ou subtipo) de norma. Usa `createElement` pelo mesmo motivo do `CategoryIcon`. */
export function LegislacaoIcon({ secaoId, subsecaoId, className }: LegislacaoIconProps) {
  const icone = subsecaoId ? iconeDaSubsecao(subsecaoId, secaoId) : iconeDaSecao(secaoId);
  return createElement(icone, { className, strokeWidth: 1.75, "aria-hidden": true });
}
