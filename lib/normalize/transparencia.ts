/** "Processo: X (tipo) Nome do empreendimento: Y Localização: Z Empreendedor: W" -> campos separados. */
export function parseProcesso(texto: string) {
  const pegar = (rotulo: string, proximo: string[]) => {
    const fim = proximo.map((p) => `(?=${p}:)`).join("|") || "$";
    return texto.match(new RegExp(`${rotulo}:\\s*(.*?)\\s*(?:${fim}|$)`))?.[1]?.trim();
  };
  return {
    processo: pegar("Processo", ["Nome do empreendimento"]),
    empreendimento: pegar("Nome do empreendimento", ["Localização"]),
    local: pegar("Localização", ["Empreendedor"]),
    empreendedor: pegar("Empreendedor", []),
  };
}

/** "EIV_parte3" -> "EIV — parte 3"; "Anexo2_Mapa de Localização" -> "Anexo 2 — Mapa de Localização". */
export function rotuloDoArquivo(nome: string): string {
  return nome
    .replace(/^EIV_parte(\d+)$/, "EIV — parte $1")
    .replace(/^RIV$/, "RIV — Relatório de Impacto de Vizinhança")
    .replace(/^Anexo(\d+)_(.+)$/, "Anexo $1 — $2")
    .replace(/_/g, " ");
}
