export type Modalidade =
  | "Concorrência"
  | "Dispensa de licitação"
  | "Pregão"
  | "Audiência pública"
  | "Credenciamento"
  | "Chamamento público"
  | "Estudos e anexos"
  | "Outros editais";

// O portal atual não informa a modalidade — ela é deduzida do título (que sempre a cita).
const REGRAS: [RegExp, Modalidade][] = [
  [/dispensa/i, "Dispensa de licitação"],
  [/concorr[eê]ncia/i, "Concorrência"],
  [/preg[aã]o|\bPE\b/i, "Pregão"],
  [/audi[eê]ncia/i, "Audiência pública"],
  [/credenciamento/i, "Credenciamento"],
  [/chamamento/i, "Chamamento público"],
  [/estudo|anexo|mapa|an[aá]lise|caracteriza[cç][aã]o/i, "Estudos e anexos"],
];

export function modalidadeDe(titulo: string): Modalidade {
  return REGRAS.find(([regra]) => regra.test(titulo))?.[1] ?? "Outros editais";
}

/**
 * Chave do processo ("Concorrência 1/2023") quando o título traz número/ano — assim o edital,
 * os avisos e as retificações do mesmo processo aparecem juntos em vez de linhas soltas.
 */
export function chaveDoProcesso(titulo: string, modalidade: Modalidade): string | undefined {
  if (modalidade === "Estudos e anexos" || modalidade === "Outros editais") return undefined;
  const numero = titulo.match(/(\d{1,3})\s*\/\s*(\d{4})/);
  if (!numero) return undefined;
  return `${modalidade} ${Number(numero[1])}/${numero[2]}`;
}

const SIGLAS = new Set(["SEDUR", "RSCC", "SAAS", "PDDU", "TVL", "SMS", "LOUOS", "PE", "II", "III", "IV"]);

/**
 * Os objetos vêm todos em maiúsculas (e com um espaço indevido em "C ONFORME"). Passa para caixa de
 * frase, preservando siglas e nomes próprios conhecidos. Textos que já têm minúsculas ficam como estão.
 */
export function descricaoLegivel(texto: string): string {
  const limpo = texto
    .replace(/\bC ONFORME\b/g, "CONFORME")
    .replace(/\s+([,.;:)])/g, "$1")
    .replace(/\(\s+/g, "(")
    .replace(/\s+/g, " ")
    .trim();
  if (limpo !== limpo.toUpperCase()) return limpo;

  let inicioDeFrase = true;
  return limpo
    .split(" ")
    .map((palavra) => {
      const base = palavra.replace(/[^A-ZÀ-Ú]/g, "");
      let saida = SIGLAS.has(base) ? palavra : palavra.toLowerCase();
      if (inicioDeFrase) saida = saida.charAt(0).toUpperCase() + saida.slice(1);
      inicioDeFrase = /[.:]$/.test(palavra);
      return saida;
    })
    .join(" ")
    .replace(/\b(salvador|bahia)\b/g, (nome) => nome.charAt(0).toUpperCase() + nome.slice(1))
    .replace(/\/ba\b/g, "/BA")
    .replace(/\banexo ([ivx]+)\b/g, (_, romano: string) => `anexo ${romano.toUpperCase()}`);
}
