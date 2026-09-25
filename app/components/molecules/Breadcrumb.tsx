import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface MigalhaItem {
  rotulo: string;
  href?: string;
}

/** Trilha de navegação ("Serviços / Ambiental / ..."); o último item é a página atual. */
export function Breadcrumb({ itens }: { itens: MigalhaItem[] }) {
  return (
    <nav aria-label="Você está em">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-foreground-muted">
        {itens.map((item, indice) => {
          const ultimo = indice === itens.length - 1;
          return (
            <li key={`${item.rotulo}-${indice}`} className="flex items-center gap-1.5">
              {item.href && !ultimo ? (
                <Link href={item.href} className="toque cursor-pointer hover:text-brand hover:underline">
                  {item.rotulo}
                </Link>
              ) : (
                <span aria-current={ultimo ? "page" : undefined} className={ultimo ? "text-foreground" : undefined}>
                  {item.rotulo}
                </span>
              )}
              {!ultimo && <ChevronRight className="size-3.5" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
