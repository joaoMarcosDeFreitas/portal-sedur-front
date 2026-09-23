import type { CategoriaServico } from "@/types/servico";
import { slugDaCategoria } from "@/lib/data/servicos";
import { CategoryIcon } from "@/app/components/atoms/CategoryIcon";
import { IconTile } from "@/app/components/molecules/IconTile";

/** Categoria de serviço no formato ícone + título (ver `IconTile`). */
export function CategoryListItem({ categoria }: { categoria: CategoriaServico }) {
  return (
    <IconTile
      href={`/servicos/${slugDaCategoria(categoria)}`}
      rotulo={categoria.nome}
      icone={<CategoryIcon nome={categoria.nome} className="size-6" />}
    />
  );
}
