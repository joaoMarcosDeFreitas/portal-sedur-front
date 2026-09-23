import Link from "next/link";
import type { Noticia } from "@/types/noticia";

function formatarData(data: string) {
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

export function NewsCard({ noticia }: { noticia: Noticia }) {
  return (
    <Link
      href={`/noticias/${noticia.id}`}
      className="flex cursor-pointer flex-col gap-2 rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-primary-300 hover:bg-surface-muted"
    >
      <span className="font-sans text-xs font-semibold uppercase tracking-wide text-brand">
        {formatarData(noticia.data)}
      </span>
      <p className="font-heading text-base font-semibold leading-snug text-foreground">{noticia.titulo}</p>
    </Link>
  );
}
