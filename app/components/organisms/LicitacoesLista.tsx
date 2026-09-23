"use client";

import { useMemo, useState } from "react";
import { Download, Search } from "lucide-react";
import { Badge } from "@/app/components/atoms/Badge";
import type { EntradaLicitacao } from "@/lib/data/licitacoes";
import { dataCurta } from "@/lib/normalize/data";
import { normalizar } from "@/lib/utils/normalizar";

const TODAS = "Todas";

function BotaoFiltro({ ativo, onClick, children }: { ativo: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      aria-pressed={ativo}
      onClick={onClick}
      className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
        ativo
          ? "border-primary-600 bg-primary-600 text-neutral-50"
          : "border-border-strong text-foreground-muted hover:bg-surface-muted hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

export function LicitacoesLista({ entradas }: { entradas: EntradaLicitacao[] }) {
  const [texto, setTexto] = useState("");
  const [modalidade, setModalidade] = useState(TODAS);
  const [ano, setAno] = useState("");

  const modalidades = useMemo(() => [...new Set(entradas.map((e) => e.modalidade))], [entradas]);
  const anos = useMemo(() => [...new Set(entradas.map((e) => e.ano))].sort().reverse(), [entradas]);

  const visiveis = useMemo(() => {
    const termos = normalizar(texto).split(/\s+/).filter(Boolean);
    return entradas.filter((entrada) => {
      if (modalidade !== TODAS && entrada.modalidade !== modalidade) return false;
      if (ano && entrada.ano !== ano) return false;
      const alvo = normalizar(`${entrada.titulo} ${entrada.descricao} ${entrada.documentos.map((d) => d.titulo).join(" ")}`);
      return termos.every((termo) => alvo.includes(termo));
    });
  }, [entradas, texto, modalidade, ano]);

  return (
    <div>
      <div className="flex max-w-2xl flex-wrap items-center gap-3">
        <div className="relative min-w-60 flex-1">
          <label htmlFor="busca-licitacoes" className="sr-only">
            Buscar licitações
          </label>
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-foreground-muted" aria-hidden="true" />
          <input
            id="busca-licitacoes"
            type="search"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Buscar por número, modalidade ou objeto"
            className="w-full rounded-full border border-border bg-surface py-3 pl-12 pr-5 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <label htmlFor="ano-licitacoes" className="sr-only">
          Ano
        </label>
        <select
          id="ano-licitacoes"
          value={ano}
          onChange={(e) => setAno(e.target.value)}
          className="cursor-pointer rounded-full border border-border bg-surface px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Todos os anos</option>
          {anos.map((opcao) => (
            <option key={opcao} value={opcao}>
              {opcao}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filtrar por modalidade">
        {[TODAS, ...modalidades].map((opcao) => (
          <BotaoFiltro key={opcao} ativo={modalidade === opcao} onClick={() => setModalidade(opcao)}>
            {opcao}
          </BotaoFiltro>
        ))}
      </div>

      <p className="mt-6 text-sm text-foreground-muted" aria-live="polite">
        {visiveis.length} {visiveis.length === 1 ? "resultado" : "resultados"}
      </p>

      {visiveis.length === 0 ? (
        <p className="mt-6 max-w-xl text-foreground-muted">Nenhuma licitação encontrada para esses filtros.</p>
      ) : (
        <ul className="-mx-4 mt-2 flex max-w-4xl flex-col">
          {visiveis.map((entrada) => (
            <li key={entrada.id} className="rounded-xl px-4 py-5 hover:bg-surface-muted">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-heading text-base font-semibold text-foreground">{entrada.titulo}</h2>
                <Badge tone="primary">{entrada.modalidade}</Badge>
                <span className="text-xs text-foreground-muted">{dataCurta(entrada.data)}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-foreground-muted">{entrada.descricao}</p>
              <ul className="mt-3 flex flex-col gap-1.5">
                {entrada.documentos.map((documento, indice) => (
                  <li key={`${documento.titulo}-${indice}`} className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                    {documento.url ? (
                      <a
                        href={documento.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex cursor-pointer items-center gap-2 text-brand hover:underline"
                      >
                        <Download className="size-4 shrink-0" aria-hidden="true" />
                        {entrada.documentos.length > 1 ? documento.titulo : "Baixar edital"}
                        {documento.tamanho ? ` · ${documento.tamanho}` : ""}
                      </a>
                    ) : (
                      <span className="text-foreground-muted">
                        {entrada.documentos.length > 1 ? `${documento.titulo} — ` : ""}Documento em atualização
                      </span>
                    )}
                    {entrada.documentos.length > 1 && (
                      <span className="text-xs text-foreground-muted">{dataCurta(documento.data)}</span>
                    )}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
