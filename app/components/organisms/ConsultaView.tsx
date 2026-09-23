import Link from "next/link";
import { Info } from "lucide-react";
import { Container } from "@/app/components/atoms/Container";
import { Text } from "@/app/components/atoms/Text";
import { Button } from "@/app/components/atoms/Button";
import { Breadcrumb, type MigalhaItem } from "@/app/components/molecules/Breadcrumb";
import { Pagination } from "@/app/components/molecules/Pagination";
import { filtrarLinhas, type ConsultaDef } from "@/lib/data/consultas";

const CAMPO =
  "w-full rounded-xl border border-border-strong bg-surface px-4 py-3 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary-500";

const POR_PAGINA = 20;

interface ConsultaViewProps {
  def: ConsultaDef;
  /** Valores dos filtros vindos da URL (formulário GET). */
  valores: Record<string, string>;
  pagina: number;
  caminho: string;
  migalhas: MigalhaItem[];
}

/**
 * Página de uma consulta/painel. Dois comportamentos, iguais aos do portal atual:
 * "catalogo" mostra a lista já de início (com filtro e paginação); "busca" só responde depois
 * de consultar um identificador e, se não achar, mostra a mensagem de "não encontrado".
 */
export function ConsultaView({ def, valores, pagina, caminho, migalhas }: ConsultaViewProps) {
  const modoBusca = def.modo === "busca";
  const filtrando = def.campos.some((campo) => valores[campo.id]);
  const consultou = !modoBusca || filtrando;
  const linhas = consultou ? filtrarLinhas(def, valores) : [];
  const real = def.dados === "real";

  const totalPaginas = Math.max(1, Math.ceil(linhas.length / POR_PAGINA));
  const paginaAtual = Math.min(Math.max(1, pagina), totalPaginas);
  const inicio = (paginaAtual - 1) * POR_PAGINA;
  const visiveis = linhas.slice(inicio, inicio + POR_PAGINA);

  const hrefDe = (p: number) => {
    const busca = new URLSearchParams();
    for (const campo of def.campos) if (valores[campo.id]) busca.set(campo.id, valores[campo.id]);
    if (p > 1) busca.set("pagina", String(p));
    const texto = busca.toString();
    return texto ? `${caminho}?${texto}` : caminho;
  };

  return (
    <Container className="py-12">
      <Breadcrumb itens={migalhas} />
      <Text as="h1" variant="h1" className="mt-6 max-w-3xl">
        {def.tituloPagina ?? def.titulo}
      </Text>
      {def.referencia && (
        <Text variant="small" tone="muted" className="mt-2">
          {def.referencia}
        </Text>
      )}
      <Text tone="muted" className="mt-3 max-w-2xl">
        {def.descricao}
      </Text>

      <form action={caminho} className="mt-8 flex flex-wrap items-end gap-4">
        {def.campos.map((campo) => (
          <div key={campo.id} className="flex min-w-40 flex-1 flex-col gap-1.5 sm:max-w-64">
            <label htmlFor={campo.id} className="text-sm font-medium text-foreground">
              {campo.rotulo}
            </label>
            {campo.opcoes ? (
              <select id={campo.id} name={campo.id} defaultValue={valores[campo.id] ?? ""} className={`${CAMPO} cursor-pointer`}>
                <option value="">Todos</option>
                {campo.opcoes.map((opcao) => (
                  <option key={opcao} value={opcao}>
                    {opcao}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={campo.id}
                name={campo.id}
                defaultValue={valores[campo.id] ?? ""}
                placeholder={campo.placeholder}
                className={CAMPO}
              />
            )}
          </div>
        ))}
        <div className="flex items-center gap-3">
          <Button type="submit">{def.botao ?? (modoBusca ? "Consultar" : "Pesquisar")}</Button>
          {filtrando && (
            <Link href={caminho} className="cursor-pointer text-sm text-brand hover:underline">
              Limpar
            </Link>
          )}
        </div>
      </form>

      <p className="mt-8 flex items-center gap-2 text-xs text-foreground-muted">
        <Info className="size-4 shrink-0" aria-hidden="true" />
        {real
          ? "Dados oficiais da SEDUR, conforme o Portal de Serviços atual (levantamento de setembro de 2026)."
          : "Demonstração: os resultados abaixo são fictícios e servem para mostrar como a consulta funcionará."}
      </p>

      {!consultou ? (
        <p className="mt-6 max-w-xl text-foreground-muted">Preencha o campo acima e clique em consultar para ver o resultado.</p>
      ) : linhas.length === 0 ? (
        <p role="status" className="mt-6 max-w-xl font-medium text-foreground">
          {def.naoEncontrado ?? "Nenhum registro encontrado. Tente outros filtros."}
        </p>
      ) : (
        <>
          <p className="mt-4 text-sm text-foreground-muted" aria-live="polite">
            {linhas.length > POR_PAGINA
              ? `Mostrando ${inicio + 1} a ${inicio + visiveis.length} de ${linhas.length.toLocaleString("pt-BR")} resultados`
              : `${linhas.length} ${linhas.length === 1 ? "resultado" : "resultados"}`}
          </p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead>
                <tr className="align-bottom text-xs uppercase tracking-wide text-foreground-muted">
                  {def.colunas.map((coluna) => (
                    <th key={coluna.id} scope="col" className="px-4 py-3 font-semibold">
                      {coluna.rotulo}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visiveis.map((linha) => (
                  <tr key={linha.id} className="align-top hover:bg-surface-muted">
                    {def.colunas.map((coluna, indice) => (
                      <td key={coluna.id} className={`px-4 py-3 ${indice === 0 ? "whitespace-nowrap font-medium text-foreground" : "text-foreground-muted"}`}>
                        {coluna.longa ? (
                          linha[coluna.id] ? (
                            <details className="max-w-xs">
                              <summary className="cursor-pointer text-brand hover:underline">Ver condições</summary>
                              <p className="mt-2 whitespace-pre-line text-xs leading-relaxed">{linha[coluna.id]}</p>
                            </details>
                          ) : (
                            "—"
                          )
                        ) : (
                          linha[coluna.id]
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8">
            <Pagination paginaAtual={paginaAtual} totalPaginas={totalPaginas} hrefDe={hrefDe} />
          </div>
        </>
      )}
    </Container>
  );
}
