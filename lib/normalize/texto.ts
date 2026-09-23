const VALORES_VAZIOS = new Set(["", "n/a", "n\\a", "-", "não informado"]);

/**
 * O portal atual usa "N/A" (ou campo em branco) quando uma aba de serviço não tem conteúdo,
 * e o texto original tem um caractere de travessão quebrado ("¿") por problema de codificação.
 * Aqui a gente limpa isso na leitura, em vez de mostrar o dado bruto na tela.
 */
export function limparTexto(texto?: string | null): string {
  if (!texto) return "";
  return texto.replace(/¿/g, "–").trim();
}

export function temConteudo(texto?: string | null): boolean {
  const limpo = limparTexto(texto).toLowerCase();
  return !VALORES_VAZIOS.has(limpo);
}
