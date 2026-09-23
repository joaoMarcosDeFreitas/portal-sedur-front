"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/app/components/atoms/Button";
import { DocumentoRow } from "@/app/components/molecules/DocumentoRow";
import type { ItemLegislacao, RespostaLegislacao, ResumoSecao } from "@/lib/data/legislacao";

interface LegislacaoExplorerProps {
  /** Tipos para os botões de filtro (só usados quando o tipo não está travado). */
  secoes: ResumoSecao[];
  qInicial: string;
  secaoInicial: string;
  /** Quando a pessoa já escolheu um tipo/subtipo pelos ícones, a lista fica restrita a ele. */
  travarTipo?: boolean;
  subsecao?: string;
  inicial: RespostaLegislacao;
}

const chaveDe = (q: string, secao: string, subsecao: string, pagina: number) => `${q}|${secao}|${subsecao}|${pagina}`;

/**
 * Busca + lista de normas. A 1ª página vem renderizada do servidor; as demais vêm de
 * /api/legislacao e ficam em cache por (busca, tipo, subtipo, página).
 */
export function LegislacaoExplorer({
  secoes,
  qInicial,
  secaoInicial,
  travarTipo = false,
  subsecao = "",
  inicial,
}: LegislacaoExplorerProps) {
  const [texto, setTexto] = useState(qInicial);
  const [q, setQ] = useState(qInicial);
  const [secao, setSecao] = useState(secaoInicial);
  const [paginas, setPaginas] = useState(1);
  const [cache, setCache] = useState<Record<string, RespostaLegislacao>>({
    [chaveDe(qInicial, secaoInicial, subsecao, 1)]: inicial,
  });

  // A busca só dispara depois de uma pausa na digitação.
  useEffect(() => {
    const timeout = setTimeout(() => {
      setQ(texto.trim());
      setPaginas(1);
    }, 250);
    return () => clearTimeout(timeout);
  }, [texto]);

  // Busca a página que estiver faltando no cache.
  const faltando = Array.from({ length: paginas }, (_, i) => i + 1).find((p) => !cache[chaveDe(q, secao, subsecao, p)]);
  useEffect(() => {
    if (faltando === undefined) return;
    const controller = new AbortController();
    const parametros = new URLSearchParams({ q, secao, subsecao, pagina: String(faltando) });
    fetch(`/api/legislacao?${parametros}`, { signal: controller.signal })
      .then((resposta) => resposta.json() as Promise<RespostaLegislacao>)
      .then((dados) => setCache((atual) => ({ ...atual, [chaveDe(q, secao, subsecao, faltando)]: dados })))
      .catch(() => {});
    return () => controller.abort();
  }, [faltando, q, secao, subsecao]);

  const primeira = cache[chaveDe(q, secao, subsecao, 1)];
  const itens: ItemLegislacao[] = Array.from(
    { length: paginas },
    (_, i) => cache[chaveDe(q, secao, subsecao, i + 1)]?.itens ?? [],
  ).flat();
  const total = primeira?.total ?? 0;
  const carregando = faltando !== undefined;

  return (
    <div>
      <div className="relative max-w-xl">
        <label htmlFor="busca-legislacao" className="sr-only">
          Buscar na legislação
        </label>
        <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-foreground-muted" aria-hidden="true" />
        <input
          id="busca-legislacao"
          type="search"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Busque por número, assunto ou palavra da ementa"
          className="w-full rounded-full border border-border bg-surface py-3.5 pl-12 pr-5 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {!travarTipo && (
        <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filtrar por tipo de norma">
          {[{ id: "", nome: "Todas" }, ...secoes].map((opcao) => {
            const ativa = secao === opcao.id;
            return (
              <button
                key={opcao.id || "todas"}
                type="button"
                aria-pressed={ativa}
                onClick={() => {
                  setSecao(opcao.id);
                  setPaginas(1);
                }}
                className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                  ativa
                    ? "border-primary-600 bg-primary-600 text-neutral-50"
                    : "border-border-strong text-foreground-muted hover:bg-surface-muted hover:text-foreground"
                }`}
              >
                {opcao.nome}
              </button>
            );
          })}
        </div>
      )}

      <p className="mt-6 text-sm text-foreground-muted" aria-live="polite">
        {primeira ? `${total.toLocaleString("pt-BR")} ${total === 1 ? "documento" : "documentos"}` : "Buscando…"}
      </p>

      {primeira && itens.length === 0 ? (
        <p className="mt-6 max-w-xl text-foreground-muted">
          Nenhum documento encontrado. Tente outra palavra{travarTipo ? "." : " ou remova o filtro de tipo."}
        </p>
      ) : (
        <ul className="-mx-4 mt-2 flex max-w-4xl flex-col">
          {itens.map((documento) => (
            <DocumentoRow key={documento.id} documento={documento} />
          ))}
        </ul>
      )}

      {itens.length < total && (
        <div className="mt-6">
          <Button variant="secondary" disabled={carregando} onClick={() => setPaginas((p) => p + 1)}>
            {carregando ? "Carregando…" : "Mostrar mais"}
          </Button>
        </div>
      )}
    </div>
  );
}
