import { expect, test } from "@playwright/test";

const FUNCIONANDO = ["Portal Sedur", "SIGS", "GLPI", "e-Salvador", "Alfresco", "BI", "PDDU"];
const COM_AVISO = ["Revista SEDUR", "SAPS", "Webmail", "SedurMap"];

test.describe("Acesso interno", () => {
  test("mostra os 11 sistemas e explica para quem é a área", async ({ page }) => {
    await page.goto("/acesso-interno");
    await expect(page.getByRole("heading", { level: 1, name: "Acesso interno" })).toBeVisible();
    await expect(page.getByText("Área para servidores da SEDUR")).toBeVisible();
    await expect(page.locator("main ul li a")).toHaveCount(11);
  });

  for (const nome of FUNCIONANDO) {
    test(`${nome}: abre o sistema real em outra aba`, async ({ page }) => {
      await page.goto("/acesso-interno");
      const link = page.getByRole("link", { name: new RegExp(`^${nome}`) });
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("href", /^https?:\/\//);
    });
  }

  for (const nome of COM_AVISO) {
    test(`${nome}: leva à página que avisa que o link não abriu`, async ({ page }) => {
      await page.goto("/acesso-interno");
      await page.getByRole("link", { name: new RegExp(`^${nome}`) }).click();
      await expect(page).toHaveURL(/\/acesso-interno\/[a-z-]+$/);
      await expect(page.getByRole("heading", { level: 1, name: "Este link não levou a nenhuma página" })).toBeVisible();
      await expect(page.getByRole("note")).toContainText("computador pessoal");
      await expect(page.getByRole("note")).toContainText(nome);
      await page.getByRole("link", { name: "Voltar ao Acesso interno" }).click();
      await expect(page).toHaveURL(/\/acesso-interno$/);
    });
  }

  test("sistema que funciona não tem página de aviso (404)", async ({ page }) => {
    const resposta = await page.goto("/acesso-interno/sigs");
    expect(resposta?.status()).toBe(404);
  });

  test("o rodapé leva ao Acesso interno deste portal", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Acesso interno (rede SEDUR)" }).click();
    await expect(page).toHaveURL(/\/acesso-interno$/);
  });

  test("a barra lateral tem 'Acesso interno' no fim do menu, marcado na página", async ({ page }) => {
    await page.goto("/");
    const menu = page.getByRole("navigation", { name: "Navegação principal" });
    const itens = menu.getByRole("link");
    await expect(itens.last()).toHaveText("Acesso interno");
    await itens.last().click();
    await expect(page).toHaveURL(/\/acesso-interno$/);
    await expect(menu.getByRole("link", { name: "Acesso interno" })).toHaveAttribute("aria-current", "page");
  });

  test("a busca encontra o Acesso interno", async ({ page }) => {
    const resposta = await page.request.get("/api/busca?q=acesso interno");
    const corpo = JSON.stringify(await resposta.json());
    expect(corpo).toContain("/acesso-interno");
  });
});
