import { createElement } from "react";
import type { LucideIcon } from "lucide-react";

/**
 * Renderiza um ícone escolhido por um mapa (`lib/ui/*-icons.ts`). Usa `createElement` porque o
 * ESLint do React Compiler reprova `<Icone />` quando o componente vem do retorno de uma função.
 */
export function MappedIcon({ icone, className }: { icone: LucideIcon; className?: string }) {
  return createElement(icone, { className, strokeWidth: 1.75, "aria-hidden": true });
}
