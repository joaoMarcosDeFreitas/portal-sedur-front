"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { ResultadoBusca } from "@/app/api/busca/route";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

const ID_LISTA = "busca-resultados";
const idOpcao = (indice: number) => `busca-opcao-${indice}`;

/**
 * Busca ao vivo do portal, no padrão "combobox com lista" do WAI-ARIA: o foco fica sempre no campo;
 * ↑/↓ percorrem os resultados (anunciados por `aria-activedescendant`), Enter abre o destacado
 * (ou o primeiro) e Esc fecha a lista. O mouse continua funcionando.
 */
export function SearchBar({ placeholder = "Busque um serviço, norma ou seção do portal", className = "" }: SearchBarProps) {
  const router = useRouter();
  const [termo, setTermo] = useState("");
  const [resultados, setResultados] = useState<ResultadoBusca[]>([]);
  const [aberto, setAberto] = useState(false);
  const [indiceAtivo, setIndiceAtivo] = useState(-1);
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
        setIndiceAtivo(-1);
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
  const listaAberta = aberto && resultadosVisiveis.length > 0;

  useEffect(() => {
    function aoClicarFora(evento: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(evento.target as Node)) {
        setAberto(false);
      }
    }
    document.addEventListener("mousedown", aoClicarFora);
    return () => document.removeEventListener("mousedown", aoClicarFora);
  }, []);

  function abrir(resultado: ResultadoBusca) {
    setAberto(false);
    router.push(resultado.href);
  }

  function aoApertarTecla(evento: KeyboardEvent<HTMLInputElement>) {
    const total = resultadosVisiveis.length;
    switch (evento.key) {
      case "ArrowDown":
        if (total === 0) return;
        evento.preventDefault();
        setAberto(true);
        setIndiceAtivo((atual) => (atual + 1) % total);
        break;
      case "ArrowUp":
        if (total === 0) return;
        evento.preventDefault();
        setAberto(true);
        setIndiceAtivo((atual) => (atual <= 0 ? total - 1 : atual - 1));
        break;
      case "Enter":
        if (!listaAberta) return;
        evento.preventDefault();
        abrir(resultadosVisiveis[indiceAtivo >= 0 ? indiceAtivo : 0]);
        break;
      case "Escape":
        if (!listaAberta) return;
        evento.preventDefault();
        setAberto(false);
        setIndiceAtivo(-1);
        break;
    }
  }

  return (
    <div ref={containerRef} className={`relative w-full ${className}`} role="search">
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
          aria-expanded={listaAberta}
          aria-controls={ID_LISTA}
          aria-autocomplete="list"
          aria-activedescendant={listaAberta && indiceAtivo >= 0 ? idOpcao(indiceAtivo) : undefined}
          autoComplete="off"
          value={termo}
          onChange={(event) => setTermo(event.target.value)}
          onKeyDown={aoApertarTecla}
          onFocus={() => resultadosVisiveis.length > 0 && setAberto(true)}
          placeholder={placeholder}
          className="w-full rounded-full border border-border bg-surface py-3.5 pl-12 pr-5 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Anuncia para leitores de tela que a lista apareceu (o foco não sai do campo). */}
      <div role="status" className="sr-only">
        {listaAberta
          ? `${resultadosVisiveis.length} ${resultadosVisiveis.length === 1 ? "resultado disponível" : "resultados disponíveis"}. Use as setas para cima e para baixo.`
          : ""}
      </div>

      {listaAberta && (
        <ul
          id={ID_LISTA}
          role="listbox"
          aria-label="Resultados da busca"
          className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-surface py-2 shadow-lg"
        >
          {resultadosVisiveis.map((resultado, indice) => (
            <li
              key={`${resultado.tipo}-${resultado.href}`}
              id={idOpcao(indice)}
              role="option"
              aria-selected={indice === indiceAtivo}
              // mouseDown não tira o foco do campo; o clique navega.
              onMouseDown={(evento) => evento.preventDefault()}
              onClick={() => abrir(resultado)}
              onMouseEnter={() => setIndiceAtivo(indice)}
              className={`flex cursor-pointer items-center justify-between gap-3 px-4 py-2.5 text-sm ${
                indice === indiceAtivo ? "bg-surface-muted" : ""
              }`}
            >
              <span className="font-medium text-foreground">{resultado.titulo}</span>
              {resultado.subtitulo && <span className="text-xs text-foreground-muted">{resultado.subtitulo}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
