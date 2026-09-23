import Link from "next/link";
import type { Noticia } from "@/types/noticia";
import { dataCurta } from "@/lib/normalize/data";

export function NewsCard({ noticia, mostrarResumo = false }: { noticia: Noticia; mostrarResumo?: boolean }) {
  const resumo = mostrarResumo ? noticia.paragrafos?.[0] : undefined;
  return (
    <Link
      href={`/noticias/${noticia.id}`}
      className="flex cursor-pointer flex-col gap-2 rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-primary-300 hover:bg-surface-muted"
    >
      <span className="font-sans text-xs font-semibold uppercase tracking-wide text-brand">
        {dataCurta(noticia.data)}
      </span>
      <p className="font-heading text-base font-semibold leading-snug text-foreground">{noticia.titulo}</p>
      {resumo && <p className="line-clamp-3 text-sm leading-relaxed text-foreground-muted">{resumo}</p>}
    </Link>
  );
}
