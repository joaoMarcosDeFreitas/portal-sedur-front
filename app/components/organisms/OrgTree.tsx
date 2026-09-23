import type { UnidadeOrganizacional } from "@/types/institucional";

/** Ramo da árvore do organograma (recursivo): nome da unidade, seus setores e as unidades abaixo dela. */
export function OrgNode({ unidade }: { unidade: UnidadeOrganizacional }) {
  return (
    <li>
      <p className="font-medium text-foreground">{unidade.nome}</p>
      {unidade.setores && unidade.setores.length > 0 && (
        <ul className="mt-1.5 flex flex-wrap gap-1.5">
          {unidade.setores.map((setor) => (
            <li key={setor} className="rounded-full bg-surface-muted px-2.5 py-0.5 text-xs text-foreground-muted">
              {setor}
            </li>
          ))}
        </ul>
      )}
      {unidade.filhos && unidade.filhos.length > 0 && (
        <ul className="mt-3 ml-2 flex flex-col gap-4 border-l border-border-strong pl-5">
          {unidade.filhos.map((filho) => (
            <OrgNode key={filho.nome} unidade={filho} />
          ))}
        </ul>
      )}
    </li>
  );
}
