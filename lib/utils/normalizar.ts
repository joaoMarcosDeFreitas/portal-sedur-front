/** Minúsculas e sem acento, pra comparar texto digitado pelo usuário sem exigir acento certo. */
export function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}
