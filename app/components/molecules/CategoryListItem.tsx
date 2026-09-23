import Link from "next/link";
import type { CategoriaServico } from "@/types/servico";
import { slugDaCategoria } from "@/lib/data/servicos";
import { CategoryIcon } from "@/app/components/atoms/CategoryIcon";

/** Ícone em cima, título embaixo, sem cartão em volta — pensado para ficar lado a lado, quebrando linha. */
export function CategoryListItem({ categoria }: { categoria: CategoriaServico }) {
  return (
    <Link
      href={`/servicos/${slugDaCategoria(categoria)}`}
      className="group flex w-28 cursor-pointer flex-col items-center gap-3 rounded-xl px-2 py-3 text-center transition-colors hover:bg-surface-muted sm:w-32"
    >
      <span className="flex size-14 items-center justify-center rounded-full bg-primary-600/10 text-brand transition-colors group-hover:bg-primary-600/15">
        <CategoryIcon nome={categoria.nome} className="size-6" />
      </span>
      <span className="font-heading text-sm font-medium text-foreground">{categoria.nome}</span>
    </Link>
  );
}
