import { createElement } from "react";
import { iconeDaCategoria } from "@/lib/ui/category-icons";

/**
 * Usa `createElement` (não `<Icone />`) porque o ícone é resolvido dinamicamente por
 * categoria: o ESLint do React Compiler marca como "componente criado durante a
 * renderização" quando uma variável de componente vinda de uma função é usada como tag
 * JSX, mesmo sendo sempre a mesma referência estável do mapa de ícones.
 */
export function CategoryIcon({ nome, className }: { nome: string; className?: string }) {
  return createElement(iconeDaCategoria(nome), { className, strokeWidth: 1.75, "aria-hidden": true });
}
