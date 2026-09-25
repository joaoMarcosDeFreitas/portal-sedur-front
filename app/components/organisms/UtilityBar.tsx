"use client";

import { Accessibility, ALargeSmall, Contrast, Droplet, Moon, RotateCcw, Sun, Type, Underline } from "lucide-react";
import { useEffect, useRef, useState, type FocusEvent } from "react";
import {
  atualizarPreferencias,
  reiniciarPreferencias,
  usePreferencias,
} from "@/lib/acessibilidade/preferencias";

type Tema = "light" | "dark";

const CHAVE_TEMA = "portal-sedur:tema";

const ITEM_DO_PAINEL =
  "toque w-full cursor-pointer gap-2.5 rounded-lg px-3 text-left text-sm text-foreground hover:bg-surface-muted aria-pressed:bg-primary-600/10 aria-pressed:font-medium aria-pressed:text-brand";

/**
 * Faixa fina do topo com as opções de acessibilidade do portal atual: aumentar texto e tema claro/escuro
 * ficam sempre à vista; o painel "Acessibilidade" traz as demais (diminuir texto, escala de cinza, alto
 * contraste, links sublinhados, fonte legível e reiniciar). "Contraste negativo" e "fundo claro" do portal
 * atual são o tema escuro e o tema claro.
 */
export function UtilityBar() {
  const [tema, setTema] = useState<Tema>("light");
  const [painelAberto, setPainelAberto] = useState(false);
  const preferencias = usePreferencias();
  const areaRef = useRef<HTMLDivElement>(null);
  const gatilhoRef = useRef<HTMLButtonElement>(null);

  // O tema inicial já foi aplicado por um script no <head> (evita piscar); aqui só sincroniza o
  // estado do React com esse valor lido do DOM logo após montar — é exatamente o caso de uso que
  // useEffect deve cobrir (sincronizar com um sistema externo), por isso o lint é ignorado aqui.
  useEffect(() => {
    const atual = document.documentElement.getAttribute("data-theme");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (atual === "dark") setTema("dark");
  }, []);

  // Esc fecha o painel e devolve o foco ao botão; clique fora também fecha.
  useEffect(() => {
    if (!painelAberto) return;
    function aoApertarTecla(evento: KeyboardEvent) {
      if (evento.key === "Escape") {
        setPainelAberto(false);
        gatilhoRef.current?.focus();
      }
    }
    function aoClicarFora(evento: MouseEvent) {
      if (areaRef.current && !areaRef.current.contains(evento.target as Node)) setPainelAberto(false);
    }
    document.addEventListener("keydown", aoApertarTecla);
    document.addEventListener("mousedown", aoClicarFora);
    return () => {
      document.removeEventListener("keydown", aoApertarTecla);
      document.removeEventListener("mousedown", aoClicarFora);
    };
  }, [painelAberto]);

  // Tab para fora do painel também o fecha (o foco não fica preso, nem o painel aberto atrás de outra coisa).
  function aoPerderFoco(evento: FocusEvent<HTMLDivElement>) {
    if (!evento.currentTarget.contains(evento.relatedTarget as Node | null)) setPainelAberto(false);
  }

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

  return (
    <div>
      <div className="flex w-full items-center justify-end gap-4 px-4 py-1.5 text-xs text-foreground-muted lg:px-8">
        <button
          type="button"
          onClick={() => atualizarPreferencias({ texto: preferencias.texto === "grande" ? "normal" : "grande" })}
          className="toque cursor-pointer hover:text-foreground"
          aria-pressed={preferencias.texto === "grande"}
        >
          {preferencias.texto === "grande" ? "Texto normal" : "Aumentar texto"}
        </button>
        <button
          type="button"
          onClick={alternarTema}
          className="toque cursor-pointer gap-1.5 hover:text-foreground"
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

        <div ref={areaRef} className="relative" onBlur={aoPerderFoco}>
          <button
            ref={gatilhoRef}
            type="button"
            onClick={() => setPainelAberto((aberto) => !aberto)}
            className="toque cursor-pointer gap-1.5 hover:text-foreground"
            aria-expanded={painelAberto}
            aria-controls="painel-acessibilidade"
          >
            <Accessibility className="size-3.5" aria-hidden="true" /> Acessibilidade
          </button>

          {painelAberto && (
            <div
              id="painel-acessibilidade"
              role="group"
              aria-label="Opções de acessibilidade"
              className="absolute right-0 top-full z-40 mt-1 w-64 rounded-2xl border border-border bg-surface p-2 shadow-lg"
            >
              <button
                type="button"
                className={ITEM_DO_PAINEL}
                aria-pressed={preferencias.texto === "pequeno"}
                onClick={() => atualizarPreferencias({ texto: preferencias.texto === "pequeno" ? "normal" : "pequeno" })}
              >
                <ALargeSmall className="size-4 shrink-0" aria-hidden="true" /> Diminuir texto
              </button>
              <button
                type="button"
                className={ITEM_DO_PAINEL}
                aria-pressed={preferencias.cinza}
                onClick={() => atualizarPreferencias({ cinza: !preferencias.cinza })}
              >
                <Droplet className="size-4 shrink-0" aria-hidden="true" /> Escala de cinza
              </button>
              <button
                type="button"
                className={ITEM_DO_PAINEL}
                aria-pressed={preferencias.contraste}
                onClick={() => atualizarPreferencias({ contraste: !preferencias.contraste })}
              >
                <Contrast className="size-4 shrink-0" aria-hidden="true" /> Alto contraste
              </button>
              <button
                type="button"
                className={ITEM_DO_PAINEL}
                aria-pressed={preferencias.sublinhados}
                onClick={() => atualizarPreferencias({ sublinhados: !preferencias.sublinhados })}
              >
                <Underline className="size-4 shrink-0" aria-hidden="true" /> Links sublinhados
              </button>
              <button
                type="button"
                className={ITEM_DO_PAINEL}
                aria-pressed={preferencias.fonteLegivel}
                onClick={() => atualizarPreferencias({ fonteLegivel: !preferencias.fonteLegivel })}
              >
                <Type className="size-4 shrink-0" aria-hidden="true" /> Fonte legível
              </button>
              <button type="button" className={ITEM_DO_PAINEL} onClick={reiniciarPreferencias}>
                <RotateCcw className="size-4 shrink-0" aria-hidden="true" /> Reiniciar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
