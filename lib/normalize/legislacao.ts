/** "23/09/2021" -> "2021-09-23" (ordenável). */
export function dataParaISO(data: string): string {
  const [dia, mes, ano] = data.split("/");
  return ano && mes && dia ? `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}` : "";
}

/**
 * O portal atual escreve o número de várias formas ("Decreto n° 27.946/2016.", "nº", "8613/1990").
 * Aqui só uniformizamos o símbolo e tiramos o ponto final; o conteúdo continua o original.
 */
export function normalizarNumero(numero: string): string {
  const limpo = numero.replace(/\bn[°º]\s?/gi, "nº ").replace(/\s+/g, " ").replace(/[.\s]+$/, "").trim();
  return limpo.charAt(0).toUpperCase() + limpo.slice(1);
}

export function formatarTamanho(bytes?: number): string | undefined {
  if (!bytes) return undefined;
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}
