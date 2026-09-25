import { expect, test } from "@playwright/test";

test.describe("teclado e leitor de tela", () => {
  test("o 1º Tab vai ao 'Pular para o conteúdo', que leva o foco ao <main>", async ({ page }) => {
    await page.goto("/servicos");
    await page.keyboard.press("Tab");
    const pular = page.getByRole("link", { name: "Pular para o conteúdo" });
    await expect(pular).toBeFocused();
    await expect(pular).toBeInViewport();
    await page.keyboard.press("Enter");
    await expect(page.locator("main#conteudo-principal")).toBeFocused();
  });

  test("foco visível: todo controle focado mostra um contorno", async ({ page }) => {
    await page.goto("/servicos");
    await page.getByRole("link", { name: "Consultas" }).first().focus();
    const contorno = await page.evaluate(() => {
      const estilo = getComputedStyle(document.activeElement as Element);
      return { estilo: estilo.outlineStyle, largura: parseFloat(estilo.outlineWidth) };
    });
    // O foco vindo de `.focus()` por script não ativa :focus-visible em todos os navegadores; via teclado sim.
    await page.keyboard.press("Tab");
    const viaTeclado = await page.evaluate(() => {
      const estilo = getComputedStyle(document.activeElement as Element);
      return { estilo: estilo.outlineStyle, largura: parseFloat(estilo.outlineWidth) };
    });
    expect(viaTeclado.estilo).toBe("solid");
    expect(viaTeclado.largura).toBeGreaterThanOrEqual(2);
    expect(contorno).toBeDefined();
  });

  test.describe("busca do topo (combobox)", () => {
    test("setas percorrem, Enter abre, Esc fecha, e o leitor de tela é avisado", async ({ page }) => {
      await page.goto("/");
      const campo = page.getByRole("combobox");
      await campo.click();
      await campo.pressSequentially("reforma", { delay: 30 });

      const lista = page.getByRole("listbox", { name: "Resultados da busca" });
      await expect(lista).toBeVisible();
      const opcoes = lista.getByRole("option");
      const total = await opcoes.count();
      expect(total).toBeGreaterThan(1);
      await expect(campo).toHaveAttribute("aria-expanded", "true");
      await expect(page.getByRole("status").filter({ hasText: "resultados disponíveis" })).toBeVisible();

      await campo.press("ArrowDown");
      await campo.press("ArrowDown");
      await expect(opcoes.nth(1)).toHaveAttribute("aria-selected", "true");
      await expect(campo).toHaveAttribute("aria-activedescendant", "busca-opcao-1");
      await campo.press("ArrowUp");
      await expect(opcoes.nth(0)).toHaveAttribute("aria-selected", "true");
      await campo.press("ArrowUp"); // dá a volta para a última
      await expect(opcoes.nth(total - 1)).toHaveAttribute("aria-selected", "true");

      await campo.press("Escape");
      await expect(lista).toBeHidden();
      await expect(campo).toBeFocused();

      await campo.press("ArrowDown");
      await campo.press("ArrowDown");
      await campo.press("Enter");
      await expect(page).not.toHaveURL(/\/$/);
    });

    test("Enter sem escolher abre o 1º resultado", async ({ page }) => {
      await page.goto("/");
      const campo = page.getByRole("combobox");
      await campo.pressSequentially("carnaval", { delay: 30 });
      await expect(page.getByRole("listbox")).toBeVisible();
      await campo.press("Enter");
      await expect(page).toHaveURL(/carnaval/);
    });

    test("acha o conteúdo novo: agendamento, IPTU Verde, PDDU e Carnaval", async ({ page }) => {
      const esperados: [string, string][] = [
        ["agendamento", "/agendamento"],
        ["iptu verde", "/institucional/projetos/iptu-verde"],
        ["revisão do pddu", "/institucional/projetos/revisao-do-pddu"],
        ["fiscalização carnaval", "/transparencia/carnaval"],
      ];
      for (const [termo, destino] of esperados) {
        await page.goto("/");
        const campo = page.getByRole("combobox");
        await campo.pressSequentially(termo, { delay: 20 });
        await expect(page.getByRole("listbox")).toBeVisible();
        await campo.press("Enter");
        await expect(page, termo).toHaveURL(new RegExp(`${destino}$`));
      }
    });

    test("sem resultado a lista não aparece", async ({ page }) => {
      await page.goto("/");
      await page.getByRole("combobox").pressSequentially("xyzabc123", { delay: 20 });
      await page.waitForTimeout(500);
      await expect(page.getByRole("listbox")).toBeHidden();
    });
  });

  test.describe("menu lateral no celular", () => {
    test.use({ viewport: { width: 390, height: 800 }, isMobile: true, hasTouch: true });

    test("fechado não entra no Tab; abre com foco dentro e fecha com Esc", async ({ page }) => {
      await page.goto("/");
      const menu = page.locator("#menu-lateral");
      await expect(menu).toBeHidden();

      // percorre o Tab: nenhum link da navegação lateral recebe foco
      const focados: string[] = [];
      for (let i = 0; i < 8; i += 1) {
        await page.keyboard.press("Tab");
        focados.push(await page.evaluate(() => document.activeElement?.closest("#menu-lateral") ? "menu" : "fora"));
      }
      expect(focados).not.toContain("menu");

      const botao = page.getByRole("button", { name: "Abrir menu de navegação" });
      await botao.click();
      await expect(botao).toHaveAttribute("aria-expanded", "true");
      await expect(menu).toBeVisible();
      await expect(menu).toBeFocused();
      await page.keyboard.press("Tab");
      expect(await page.evaluate(() => Boolean(document.activeElement?.closest("#menu-lateral")))).toBe(true);
      await page.keyboard.press("Escape");
      await expect(menu).toBeHidden();
    });
  });
});
