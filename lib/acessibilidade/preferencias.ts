import { useSyncExternalStore } from "react";
import { createLocalStore } from "@/lib/store/local-store";

/**
 * Preferências da barra de acessibilidade (as mesmas opções do portal atual: aumentar/diminuir texto, escala
 * de cinza, alto contraste, links sublinhados, fonte legível e reiniciar). Cada uma vira um atributo em <html>
 * que o CSS (`globals.css`) usa. "Contraste negativo" e "fundo claro" do portal atual são o tema escuro/claro,
 * que já existem no botão de tema. Ficam salvas no navegador e o script do <head> (layout.tsx) as aplica antes
 * da primeira pintura, para a página não piscar.
 */
export interface Preferencias {
  texto: "pequeno" | "normal" | "grande";
  cinza: boolean;
  contraste: boolean;
  sublinhados: boolean;
  fonteLegivel: boolean;
}

export const PADRAO: Preferencias = { texto: "normal", cinza: false, contraste: false, sublinhados: false, fonteLegivel: false };

export const CHAVE_PREFERENCIAS = "portal-sedur:acessibilidade";

const store = createLocalStore<Preferencias>(CHAVE_PREFERENCIAS, PADRAO);

/** Escreve as preferências como atributos de <html> (é o que o CSS lê). */
export function aplicarPreferencias(prefs: Preferencias, raiz: HTMLElement = document.documentElement) {
  raiz.dataset.textSize = prefs.texto;
  const alternar = (atributo: string, valor: string | false) => {
    if (valor) raiz.setAttribute(atributo, valor);
    else raiz.removeAttribute(atributo);
  };
  alternar("data-cinza", prefs.cinza && "1");
  alternar("data-contraste", prefs.contraste && "alto");
  alternar("data-links", prefs.sublinhados && "sublinhados");
  alternar("data-fonte", prefs.fonteLegivel && "legivel");
}

export function usePreferencias(): Preferencias {
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
}

/** Muda uma ou mais preferências: guarda, aplica na página na hora e avisa quem está ouvindo. */
export function atualizarPreferencias(mudanca: Partial<Preferencias>) {
  const proxima = { ...store.getSnapshot(), ...mudanca };
  store.set(proxima);
  aplicarPreferencias(proxima);
}

/** "Reiniciar": volta tudo ao padrão (o tema claro/escuro não é mexido). */
export function reiniciarPreferencias() {
  store.set(PADRAO);
  aplicarPreferencias(PADRAO);
}
