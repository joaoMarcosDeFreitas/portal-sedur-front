"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Tema = "light" | "dark";
type TamanhoTexto = "normal" | "grande";

const CHAVE_TEMA = "portal-sedur:tema";

export function UtilityBar() {
  const [tema, setTema] = useState<Tema>("light");
  const [tamanho, setTamanho] = useState<TamanhoTexto>("normal");

  // O tema inicial já foi aplicado por um script no <head> (evita piscar); aqui só sincroniza o
  // estado do React com esse valor lido do DOM logo após montar — é exatamente o caso de uso que
  // useEffect deve cobrir (sincronizar com um sistema externo), por isso o lint é ignorado aqui.
  useEffect(() => {
    const atual = document.documentElement.getAttribute("data-theme");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (atual === "dark") setTema("dark");
  }, []);

  function alternarTema() {
    const novoTema: Tema = tema === "light" ? "dark" : "light";
    setTema(novoTema);
    document.documentElement.setAttribute("data-theme", novoTema);
    try {
      localStorage.setItem(CHAVE_TEMA, novoTema);
    } catch {
      // localStorage indisponível (navegação privada, etc.) — tudo bem, só não persiste
    }
  }

  function alternarTamanho() {
    const novoTamanho: TamanhoTexto = tamanho === "normal" ? "grande" : "normal";
    setTamanho(novoTamanho);
    document.documentElement.dataset.textSize = novoTamanho;
  }

  return (
    <div>
      <div className="flex w-full items-center justify-end gap-4 px-4 py-1.5 text-xs text-foreground-muted lg:px-8">
        <a href="#conteudo-principal" className="sr-only focus:not-sr-only focus:underline">
          Pular para o conteúdo
        </a>
        <button type="button" onClick={alternarTamanho} className="cursor-pointer hover:text-foreground" aria-pressed={tamanho === "grande"}>
          {tamanho === "normal" ? "Aumentar texto" : "Texto normal"}
        </button>
        <button
          type="button"
          onClick={alternarTema}
          className="flex cursor-pointer items-center gap-1.5 hover:text-foreground"
          aria-pressed={tema === "dark"}
        >
          {tema === "light" ? (
            <>
              <Moon className="size-3.5" aria-hidden="true" /> Tema escuro
            </>
          ) : (
            <>
              <Sun className="size-3.5" aria-hidden="true" /> Tema claro
            </>
          )}
        </button>
      </div>
    </div>
  );
}
