import { test } from "@playwright/test";
import { definirTema, PAGINAS_PUBLICAS, semViolacoesDeAcessibilidade } from "./helpers";

// axe-core (WCAG 2.0/2.1 A e AA) em todas as páginas representativas: tema claro e escuro, desktop e celular.
for (const tema of ["light", "dark"] as const) {
  for (const [dispositivo, viewport] of [
    ["desktop", { width: 1280, height: 900 }],
    ["celular", { width: 390, height: 800 }],
  ] as const) {
    test.describe(`axe — tema ${tema}, ${dispositivo}`, () => {
      test.use({ viewport });

      for (const url of PAGINAS_PUBLICAS) {
        test(url, async ({ page }) => {
          await definirTema(page, tema);
          await page.goto(url);
          await page.locator("h1").first().waitFor();
          await semViolacoesDeAcessibilidade(page);
        });
      }
    });
  }
}
