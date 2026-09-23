const MESES = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

/** "2026-09-11" -> "11 de setembro de 2026" (sem depender de fuso horário). */
export function dataPorExtenso(iso: string): string {
  const [ano, mes, dia] = iso.split("-").map(Number);
  if (!ano || !mes || !dia) return iso;
  return `${dia} de ${MESES[mes - 1]} de ${ano}`;
}

/** "2026-09-11" -> "11/09/2026" */
export function dataCurta(iso: string): string {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}
