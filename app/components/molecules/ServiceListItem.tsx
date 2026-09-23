import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Servico } from "@/types/servico";
import { slugDaCategoria, slugDoServico } from "@/lib/data/servicos";

/** Linha de serviço numa lista da categoria: nome + seta, sem cartão nem borda. */
export function ServiceListItem({ servico }: { servico: Servico }) {
  const href = `/servicos/${slugDaCategoria({ id: servico.categoria_id, nome: servico.categoria })}/${slugDoServico(servico)}`;
  return (
    <Link
      href={href}
      className="group flex cursor-pointer items-center justify-between gap-4 rounded-xl px-4 py-3 transition-colors hover:bg-surface-muted"
    >
      <span className="text-foreground">{servico.nome}</span>
      <ChevronRight
        className="size-4 shrink-0 text-foreground-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brand"
        aria-hidden="true"
      />
    </Link>
  );
}
