/** Cola pedaços de frase quebrados no HTML original e arruma o espaço antes da pontuação. */
function juntar(pedacos: string[]): string {
  return pedacos
    .join(" ")
    .replace(/\s+([,.;:])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

export interface AreaDeAtuacao {
  nome: string;
  paragrafo: string;
  topicos: string[];
}

/**
 * "Área de atuação" vem como um texto só: o nome de cada área (em maiúsculas) abre um bloco, e as
 * linhas seguintes são pedaços de frase ou tópicos ("• Segurança").
 */
export function parseAreas(textoIntegral: string, nomes: string[]): { introducao: string; areas: AreaDeAtuacao[] } {
  const linhas = textoIntegral.split("\n").map((l) => l.trim()).filter(Boolean);
  const introducao: string[] = [];
  const blocos: { nome: string; linhas: string[] }[] = [];

  for (const linha of linhas) {
    if (nomes.includes(linha)) {
      blocos.push({ nome: linha, linhas: [] });
    } else if (blocos.length === 0) {
      introducao.push(linha);
    } else {
      blocos[blocos.length - 1].linhas.push(linha);
    }
  }

  return {
    introducao: juntar(introducao),
    areas: blocos.map((bloco) => ({
      nome: bloco.nome,
      paragrafo: juntar(bloco.linhas.filter((l) => !l.startsWith("•"))),
      topicos: bloco.linhas.filter((l) => l.startsWith("•")).map((l) => l.replace(/^•\s*/, "")),
    })),
  };
}

/** Texto de um projeto: tira título/"Voltar"/"Imprimir" e reagrupa as frases em parágrafos. */
export function parseProjeto(texto: string, titulo: string): string[] {
  const linhas = texto
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && l !== titulo && l !== "Voltar" && l !== "Imprimir");

  const paragrafos: string[] = [];
  let atual: string[] = [];
  for (const linha of linhas) {
    atual.push(linha);
    // Uma linha longa que termina em ponto fecha o parágrafo (as curtas são pedaços de link/citação).
    if (linha.length > 50 && /[.!?:]$/.test(linha)) {
      paragrafos.push(juntar(atual));
      atual = [];
    }
  }
  if (atual.length > 0) paragrafos.push(juntar(atual));
  return paragrafos;
}

/** Iniciais para o avatar ("Sosthenes Tavares de Macêdo Almeida" -> "SA"). */
export function iniciais(nome: string): string {
  const partes = nome.split(/\s+/).filter((p) => p.length > 2 || /^[A-Z]/.test(p));
  const primeira = partes[0]?.[0] ?? "?";
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return `${primeira}${ultima}`.toUpperCase();
}
