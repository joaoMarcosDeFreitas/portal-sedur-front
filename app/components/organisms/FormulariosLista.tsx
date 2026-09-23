"use client";

import { useMemo, useState } from "react";
import { FileText, Search } from "lucide-react";
import { normalizar } from "@/lib/utils/normalizar";

export function FormulariosLista({ formularios }: { formularios: { titulo: string; url: string }[] }) {
  const [texto, setTexto] = useState("");

  const visiveis = useMemo(() => {
    const termos = normalizar(texto).split(/\s+/).filter(Boolean);
    return formularios.filter((f) => termos.every((termo) => normalizar(f.titulo).includes(termo)));
  }, [formularios, texto]);

  return (
    <div>
      <div className="relative max-w-xl">
        <label htmlFor="busca-formularios" className="sr-only">
          Buscar formulários
        </label>
        <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-foreground-muted" aria-hidden="true" />
        <input
          id="busca-formularios"
          type="search"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Busque um formulário pelo nome"
          className="w-full rounded-full border border-border bg-surface py-3.5 pl-12 pr-5 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <p className="mt-6 text-sm text-foreground-muted" aria-live="polite">
        {visiveis.length} {visiveis.length === 1 ? "formulário" : "formulários"}
      </p>

      {visiveis.length === 0 ? (
        <p className="mt-4 max-w-xl text-foreground-muted">Nenhum formulário encontrado para essa busca.</p>
      ) : (
        <ul className="-mx-4 mt-2 grid max-w-4xl sm:grid-cols-2">
          {visiveis.map((formulario) => (
            <li key={formulario.url}>
              <a
                href={formulario.url}
                target="_blank"
                rel="noreferrer"
                className="group flex cursor-pointer items-start gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-surface-muted"
              >
                <FileText className="mt-0.5 size-5 shrink-0 text-brand" strokeWidth={1.75} aria-hidden="true" />
                <span>
                  <span className="block text-foreground group-hover:text-brand">{formulario.titulo}</span>
                  <span className="text-xs text-foreground-muted">PDF</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
