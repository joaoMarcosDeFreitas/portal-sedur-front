/** Simula a latência de uma chamada de rede real para os dados mockados. */
export function sleep(ms = 250): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
