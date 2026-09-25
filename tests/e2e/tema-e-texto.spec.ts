import { expect, test } from "@playwright/test";
import { definirTema } from "./helpers";

test.describe("tema claro/escuro e tamanho do texto", () => {
  test("o botão alterna o tema, aplica na hora e o portal lembra ao recarregar", async ({ page }) => {
    // Sem `definirTema` (que regravaria o tema a cada carga): parte do padrão claro do sistema e testa a persistência de verdade.
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    const botao = page.getByRole("button", { name: "Tema escuro" });
    await expect(botao).toHaveAttribute("aria-pressed", "false");
    await botao.click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.getByRole("button", { name: "Tema claro" })).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("body")).toHaveCSS("background-color", /rgb\(20, 27, 34\)/);

    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await page.goto("/servicos");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });

  test("sem escolha salva, segue o tema do sistema (escuro)", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });

  test("o tema salvo é aplicado antes da 1ª pintura (sem piscar)", async ({ page }) => {
    await definirTema(page, "dark");
    await page.goto("/", { waitUntil: "commit" });
    // o script inline do <head> roda antes do React: o atributo já existe assim que o documento começa
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });

  test("logo muda com o tema (versão escura no claro e clara no escuro)", async ({ page }) => {
    await definirTema(page, "light");
    await page.goto("/");
    await expect(page.locator("aside img[src*='sedur-logo-escura']").first()).toBeVisible();
    await page.getByRole("button", { name: "Tema escuro" }).click();
    await expect(page.locator("aside img[src*='sedur-logo-clara']").first()).toBeVisible();
  });

  test("'Aumentar texto' escala a fonte da página e 'Texto normal' desfaz", async ({ page }) => {
    await page.goto("/");
    const tamanho = () => page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).fontSize));
    const normal = await tamanho();
    await page.getByRole("button", { name: "Aumentar texto" }).click();
    expect(await tamanho()).toBeGreaterThan(normal);
    await expect(page.getByRole("button", { name: "Texto normal" })).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: "Texto normal" }).click();
    expect(await tamanho()).toBe(normal);
  });

  test("texto aumentado não gera rolagem horizontal no celular", async ({ browser }) => {
    const contexto = await browser.newContext({ viewport: { width: 360, height: 800 }, isMobile: true });
    const page = await contexto.newPage();
    await page.goto("/");
    await page.getByRole("button", { name: "Aumentar texto" }).click();
    // a escolha fica salva: as próximas páginas já abrem com o texto grande
    for (const url of ["/", "/servicos/ambiental/alteracao-de-razao-social-6876", "/agendamento", "/transparencia/alvara-de-obras-em-vias-e-logradouros"]) {
      await page.goto(url);
      await expect(page.locator("html")).toHaveAttribute("data-text-size", "grande");
      const transbordo = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(transbordo, url).toBeLessThanOrEqual(0);
    }
    await contexto.close();
  });
});
