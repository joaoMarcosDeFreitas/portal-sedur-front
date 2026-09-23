import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  paginaAtual: number;
  totalPaginas: number;
  /** Monta o link de uma página (ex.: mantendo os filtros da URL). */
  hrefDe: (pagina: number) => string;
}

const LINK = "flex size-10 cursor-pointer items-center justify-center rounded-full text-sm text-foreground-muted hover:bg-surface-muted";

/** Paginação por links (funciona sem JavaScript): anterior, janela de páginas e próxima. */
export function Pagination({ paginaAtual, totalPaginas, hrefDe }: PaginationProps) {
  if (totalPaginas <= 1) return null;
  const inicio = Math.max(1, Math.min(paginaAtual - 2, totalPaginas - 4));
  const fim = Math.min(totalPaginas, inicio + 4);
  const numeros = Array.from({ length: fim - inicio + 1 }, (_, i) => inicio + i);

  return (
    <nav aria-label="Paginação" className="flex items-center gap-1">
      {paginaAtual > 1 && (
        <Link href={hrefDe(paginaAtual - 1)} className={LINK} aria-label="Página anterior">
          <ChevronLeft className="size-4" aria-hidden="true" />
        </Link>
      )}
      {numeros.map((numero) => (
        <Link
          key={numero}
          href={hrefDe(numero)}
          aria-current={numero === paginaAtual ? "page" : undefined}
          className={`${LINK} ${numero === paginaAtual ? "bg-primary-600 font-medium !text-neutral-50 hover:bg-primary-700" : ""}`}
        >
          {numero}
        </Link>
      ))}
      {paginaAtual < totalPaginas && (
        <Link href={hrefDe(paginaAtual + 1)} className={LINK} aria-label="Próxima página">
          <ChevronRight className="size-4" aria-hidden="true" />
        </Link>
      )}
    </nav>
  );
}
