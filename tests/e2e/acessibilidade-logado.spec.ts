import { test } from "@playwright/test";
import { definirTema, entrarComoDemonstracao, semViolacoesDeAcessibilidade } from "./helpers";

// axe nas telas da área do cidadão (só existem depois do login de demonstração): formulários das duas ações,
// acompanhamento em cada estado e lista. Claro/escuro × desktop/celular.
for (const tema of ["light", "dark"] as const) {
  for (const [dispositivo, viewport] of [
    ["desktop", { width: 1280, height: 900 }],
    ["celular", { width: 390, height: 800 }],
  ] as const) {
    test.describe(`axe logado — tema ${tema}, ${dispositivo}`, () => {
      test.use({ viewport });

      test("Emissão de DAM: formulário, erro de área, acompanhamento aguardando e pago", async ({ page }) => {
        await definirTema(page, tema);
        await entrarComoDemonstracao(page);

        await page.goto("/solicitar/6876/emitir-dam");
        await page.getByRole("button", { name: "Emitir DAM" }).waitFor();
        await semViolacoesDeAcessibilidade(page);

        await page.getByRole("button", { name: "Emitir DAM" }).click();
        await page.getByRole("button", { name: "Pagar com PIX" }).waitFor();
        await semViolacoesDeAcessibilidade(page);

        await page.getByRole("button", { name: "Pagar com PIX" }).click();
        await page.getByText("Comprovante disponível").waitFor();
        await semViolacoesDeAcessibilidade(page);
      });

      test("Abrir processo: formulário, validação, em análise e concluída; lista", async ({ page }) => {
        await definirTema(page, tema);
        await entrarComoDemonstracao(page);

        await page.goto("/solicitar/7053/abrir-processo");
        await page.getByRole("button", { name: "Abrir processo" }).waitFor();
        await semViolacoesDeAcessibilidade(page);

        await page.getByRole("button", { name: "Abrir processo" }).click();
        await page.getByRole("alert").first().waitFor();
        await semViolacoesDeAcessibilidade(page);

        await page.getByLabel("Endereço do imóvel").fill("Rua Teste, 10");
        await page.getByLabel("Bairro").fill("Pituba");
        await page.getByRole("checkbox", { name: /Declaro/ }).check();
        await page.getByRole("button", { name: "Abrir processo" }).click();
        await page.getByRole("button", { name: /Simular conclusão/ }).waitFor();
        await semViolacoesDeAcessibilidade(page);

        await page.getByRole("button", { name: /Simular conclusão/ }).click();
        await page.getByText("Documento disponível").waitFor();
        await semViolacoesDeAcessibilidade(page);

        await page.goto("/minhas-solicitacoes");
        await page.getByRole("link", { name: /Abertura de processo/ }).waitFor();
        await semViolacoesDeAcessibilidade(page);
      });
    });
  }
}
