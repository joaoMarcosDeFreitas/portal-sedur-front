import { Download } from "lucide-react";
import type { ItemLegislacao } from "@/lib/data/legislacao";

/** Uma norma da legislação: número, data, ementa e o botão para abrir o PDF (quando existe). */
export function DocumentoRow({ documento }: { documento: ItemLegislacao }) {
  return (
    <li className="flex flex-col gap-3 rounded-xl px-4 py-4 hover:bg-surface-muted sm:flex-row sm:items-start sm:justify-between sm:gap-6">
      <div className="min-w-0">
        <p className="font-heading font-semibold text-foreground">{documento.numero || "Sem número"}</p>
        <p className="mt-0.5 text-xs text-foreground-muted">
          {documento.data} · {documento.subsecao ? `${documento.secao} — ${documento.subsecao}` : documento.secao}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-foreground-muted">{documento.descricao}</p>
      </div>
      <div className="shrink-0">
        {documento.url ? (
          <a
            href={documento.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border-strong px-4 py-2 text-sm font-medium text-brand hover:bg-primary-600/10"
          >
            <Download className="size-4" aria-hidden="true" />
            PDF{documento.tamanho ? ` · ${documento.tamanho}` : ""}
          </a>
        ) : (
          <span className="text-xs text-foreground-muted">Documento em atualização</span>
        )}
      </div>
    </li>
  );
}
