import Link from "next/link";
import type { ReactNode } from "react";

interface IconTileProps {
  href: string;
  rotulo: string;
  icone: ReactNode;
  /** Abre num arquivo/site de fora deste portal (nova aba). */
  externo?: boolean;
}

const CLASSES =
  "group flex w-28 cursor-pointer flex-col items-center gap-3 rounded-xl px-0 py-3 text-center transition-colors sm:px-2 hover:bg-surface-muted sm:w-32";

/** Ícone em cima, título embaixo, sem cartão em volta — para ficar lado a lado, quebrando linha. */
export function IconTile({ href, rotulo, icone, externo = false }: IconTileProps) {
  const conteudo = (
    <>
      <span className="flex size-14 items-center justify-center rounded-full bg-primary-600/10 text-brand transition-colors group-hover:bg-primary-600/15">
        {icone}
      </span>
      <span className="w-full break-words font-heading text-xs font-medium tracking-tight text-foreground sm:text-sm sm:tracking-normal">{rotulo}</span>
    </>
  );

  return externo ? (
    <a href={href} target="_blank" rel="noreferrer" className={CLASSES}>
      {conteudo}
    </a>
  ) : (
    <Link href={href} className={CLASSES}>
      {conteudo}
    </Link>
  );
}
