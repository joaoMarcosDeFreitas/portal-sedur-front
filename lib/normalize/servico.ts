import type { Servico } from "@/types/servico";
import { limparTexto, temConteudo } from "./texto";

const ROTULO_ABA: Record<keyof Servico["abas"], string> = {
  descricao: "Descrição",
  "documentacao-exigida": "Documentação exigida",
  informacoes: "Informações",
  taxas: "Taxas",
  prazo: "Prazo",
  local: "Local e horário",
};

export interface AbaFicha {
  chave: string;
  rotulo: string;
  conteudo: string;
}

/** Só devolve as abas que realmente têm conteúdo (esconde as "N/A"/vazias do portal atual). */
export function abasComConteudo(servico: Servico): AbaFicha[] {
  return (Object.keys(ROTULO_ABA) as (keyof Servico["abas"])[])
    .map((chave) => ({
      chave,
      rotulo: ROTULO_ABA[chave],
      conteudo: limparTexto(servico.abas[chave]),
    }))
    .filter((aba) => temConteudo(aba.conteudo));
}

/** A aba de documentação exigida vem como texto com quebras de linha — vira lista para exibir. */
export function paraLista(texto: string): string[] {
  return limparTexto(texto)
    .split("\n")
    .map((linha) => linha.trim())
    .filter(Boolean);
}
