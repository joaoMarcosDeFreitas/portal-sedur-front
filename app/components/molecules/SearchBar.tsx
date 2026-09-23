"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ResultadoBusca } from "@/app/api/busca/route";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

export function SearchBar({ placeholder = "Busque um serviço, norma ou seção do portal", className = "" }: SearchBarProps) {
  const [termo, setTermo] = useState("");
  const [resultados, setResultados] = useState<ResultadoBusca[]>([]);
  const [aberto, setAberto] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Busca ao digitar (com um pequeno atraso pra não disparar uma chamada por tecla).
  useEffect(() => {
    if (!termo.trim()) {
      return;
    }
    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        const resposta = await fetch(`/api/busca?q=${encodeURIComponent(termo)}`, {
          signal: controller.signal,
        });
        const dados = await resposta.json();
        setResultados(dados.resultados ?? []);
        setAberto(true);
      } catch {
        // busca cancelada (nova tecla digitada) — ignora
      }
    }, 200);
    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [termo]);

  const resultadosVisiveis = termo.trim() ? resultados : [];

  useEffect(() => {
    function aoClicarFora(evento: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(evento.target as Node)) {
        setAberto(false);
      }
    }
    document.addEventListener("mousedown", aoClicarFora);
    return () => document.removeEventListener("mousedown", aoClicarFora);
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <label htmlFor="busca-portal" className="sr-only">
        {placeholder}
      </label>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-foreground-muted"
          aria-hidden="true"
        />
        <input
          id="busca-portal"
          type="search"
          role="combobox"
          aria-expanded={aberto}
          aria-controls="busca-resultados"
          autoComplete="off"
          value={termo}
          onChange={(event) => setTermo(event.target.value)}
          onFocus={() => resultadosVisiveis.length > 0 && setAberto(true)}
          placeholder={placeholder}
          className="w-full rounded-full border border-border bg-surface py-3.5 pl-12 pr-5 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      {aberto && resultadosVisiveis.length > 0 && (
        <ul
          id="busca-resultados"
          role="listbox"
          className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-surface py-2 shadow-lg"
        >
          {resultadosVisiveis.map((resultado) => (
            <li key={`${resultado.tipo}-${resultado.href}`} role="option" aria-selected="false">
              <Link
                href={resultado.href}
                onClick={() => setAberto(false)}
                className="flex cursor-pointer items-center justify-between gap-3 px-4 py-2.5 text-sm hover:bg-surface-muted"
              >
                <span className="font-medium text-foreground">{resultado.titulo}</span>
                {resultado.subtitulo && (
                  <span className="text-xs text-foreground-muted">{resultado.subtitulo}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
