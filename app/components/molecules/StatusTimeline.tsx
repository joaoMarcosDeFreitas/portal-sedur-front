import { Check } from "lucide-react";

export type EstadoEtapa = "feito" | "atual" | "pendente";

export interface EtapaTimeline {
  titulo: string;
  detalhe?: string;
  estado: EstadoEtapa;
}

/** Linha do tempo vertical do andamento de uma solicitação. */
export function StatusTimeline({ etapas }: { etapas: EtapaTimeline[] }) {
  return (
    <ol className="flex flex-col">
      {etapas.map((etapa, indice) => {
        const ultima = indice === etapas.length - 1;
        return (
          <li key={etapa.titulo} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span
                className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  etapa.estado === "feito"
                    ? "bg-primary-600 text-neutral-50"
                    : etapa.estado === "atual"
                      ? "bg-accent-700 text-neutral-50"
                      : "bg-surface-muted text-foreground-muted"
                }`}
              >
                {etapa.estado === "feito" ? <Check className="size-4" aria-hidden="true" /> : indice + 1}
              </span>
              {!ultima && (
                <span
                  className={`my-1 w-px flex-1 ${etapa.estado === "feito" ? "bg-primary-600/50" : "bg-border-strong"}`}
                />
              )}
            </div>
            <div className={ultima ? "pb-0" : "pb-6"}>
              <p className={etapa.estado === "pendente" ? "text-foreground-muted" : "font-medium text-foreground"}>
                {etapa.titulo}
                {etapa.estado === "atual" && <span className="sr-only"> (etapa atual)</span>}
              </p>
              {etapa.detalhe && <p className="mt-0.5 text-sm text-foreground-muted">{etapa.detalhe}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
