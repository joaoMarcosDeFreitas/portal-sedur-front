/**
 * Simula a latência de uma chamada de rede real para os dados mockados. Durante o `next build`
 * não espera nada (senão as centenas de páginas estáticas demorariam à toa).
 */
export function sleep(ms = 250): Promise<void> {
  if (process.env.NEXT_PHASE === "phase-production-build") return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, ms));
}
