import { expect, test, type Page } from "@playwright/test";
import { definirTema, semViolacoesDeAcessibilidade } from "./helpers";

const abrirPainel = async (page: Page) => {
  await page.getByRole("button", { name: "Acessibilidade" }).click();
  return page.getByRole("group", { name: "Opções de acessibilidade" });
};

const tamanhoDaFonte = (page: Page) => page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).fontSize));

test.describe("barra de acessibilidade (opções do portal atual)", () => {
  test("painel com as 6 opções, abre e fecha com Esc devolvendo o foco", async ({ page }) => {
    await page.goto("/");
    const gatilho = page.getByRole("button", { name: "Acessibilidade" });
    await expect(gatilho).toHaveAttribute("aria-expanded", "false");
    const painel = await abrirPainel(page);
    await expect(gatilho).toHaveAttribute("aria-expanded", "true");
    for (const nome of ["Diminuir texto", "Escala de cinza", "Alto contraste", "Links sublinhados", "Fonte legível", "Reiniciar"]) {
      await expect(painel.getByRole("button", { name: nome })).toBeVisible();
    }
    await page.keyboard.press("Escape");
    await expect(painel).toBeHidden();
    await expect(gatilho).toBeFocused();
    await expect(gatilho).toHaveAttribute("aria-expanded", "false");
  });

  test("fecha ao clicar fora e ao sair com Tab", async ({ page }) => {
    await page.goto("/");
    const painel = await abrirPainel(page);
    await page.locator("main").click({ position: { x: 5, y: 5 } });
    await expect(painel).toBeHidden();

    await abrirPainel(page);
    await page.getByRole("button", { name: "Reiniciar" }).focus();
    await page.keyboard.press("Tab");
    await expect(painel).toBeHidden();
  });

  test("painel cabe na tela do celular", async ({ browser }) => {
    const contexto = await browser.newContext({ viewport: { width: 360, height: 700 }, isMobile: true, hasTouch: true });
    const page = await contexto.newPage();
    await page.goto("/");
    const painel = await abrirPainel(page);
    const caixa = (await painel.boundingBox())!;
    expect(caixa.x).toBeGreaterThanOrEqual(0);
    expect(caixa.x + caixa.width).toBeLessThanOrEqual(360);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
    await contexto.close();
  });

  test("Diminuir texto e Aumentar texto mudam o tamanho e não se misturam", async ({ page }) => {
    await page.goto("/");
    const normal = await tamanhoDaFonte(page);
    const painel = await abrirPainel(page);
    await painel.getByRole("button", { name: "Diminuir texto" }).click();
    expect(await tamanhoDaFonte(page)).toBeLessThan(normal);
    await expect(painel.getByRole("button", { name: "Diminuir texto" })).toHaveAttribute("aria-pressed", "true");

    await page.getByRole("button", { name: "Aumentar texto" }).click();
    expect(await tamanhoDaFonte(page)).toBeGreaterThan(normal);
    await expect(page.getByRole("button", { name: "Texto normal" })).toBeVisible();
    await page.getByRole("button", { name: "Texto normal" }).click();
    expect(await tamanhoDaFonte(page)).toBe(normal);
  });

  test("Escala de cinza aplica o filtro na página inteira", async ({ page }) => {
    await page.goto("/");
    const painel = await abrirPainel(page);
    await painel.getByRole("button", { name: "Escala de cinza" }).click();
    await expect(page.locator("html")).toHaveCSS("filter", "grayscale(1)");
    await painel.getByRole("button", { name: "Escala de cinza" }).click();
    await expect(page.locator("html")).toHaveCSS("filter", "none");
  });

  test("Alto contraste: fundo preto, texto branco, links amarelos e logo clara", async ({ page }) => {
    await definirTema(page, "light");
    await page.goto("/servicos");
    const painel = await abrirPainel(page);
    await painel.getByRole("button", { name: "Alto contraste" }).click();
    await expect(page.locator("body")).toHaveCSS("background-color", "rgb(0, 0, 0)");
    await expect(page.locator("body")).toHaveCSS("color", "rgb(255, 255, 255)");
    await expect(page.locator("main h1")).toHaveCSS("color", "rgb(255, 255, 255)");
    await expect(page.locator("aside img[src*='sedur-logo-clara']").first()).toBeVisible();
    await expect(page.locator("aside img[src*='sedur-logo-escura']").first()).toBeHidden();
    // a cor de marca (links, item ativo) vira amarelo
    await expect(page.locator("aside nav a[aria-current=page]")).toHaveCSS("color", "rgb(255, 230, 0)");
  });

  test("Links sublinhados: todo link fica sublinhado", async ({ page }) => {
    await page.goto("/servicos");
    const link = page.locator("main a").first();
    await expect(link).toHaveCSS("text-decoration-line", "none");
    const painel = await abrirPainel(page);
    await painel.getByRole("button", { name: "Links sublinhados" }).click();
    await expect(link).toHaveCSS("text-decoration-line", "underline");
  });

  test("Fonte legível troca a família de todo o texto", async ({ page }) => {
    await page.goto("/servicos");
    const antes = await page.locator("main h1").evaluate((el) => getComputedStyle(el).fontFamily);
    const painel = await abrirPainel(page);
    await painel.getByRole("button", { name: "Fonte legível" }).click();
    const depois = await page.locator("main h1").evaluate((el) => getComputedStyle(el).fontFamily);
    expect(depois).toMatch(/Verdana/);
    expect(depois).not.toBe(antes);
  });

  test("Reiniciar desfaz todas as opções (e não mexe no tema)", async ({ page }) => {
    await definirTema(page, "dark");
    await page.goto("/");
    const painel = await abrirPainel(page);
    for (const nome of ["Diminuir texto", "Escala de cinza", "Alto contraste", "Links sublinhados", "Fonte legível"]) {
      await painel.getByRole("button", { name: nome }).click();
    }
    const html = page.locator("html");
    await expect(html).toHaveAttribute("data-contraste", "alto");
    await painel.getByRole("button", { name: "Reiniciar" }).click();
    for (const atributo of ["data-cinza", "data-contraste", "data-links", "data-fonte"]) {
      await expect(html).not.toHaveAttribute(atributo, /.+/);
    }
    await expect(html).toHaveAttribute("data-text-size", "normal");
    await expect(html).toHaveAttribute("data-theme", "dark");
    for (const nome of ["Diminuir texto", "Escala de cinza", "Alto contraste", "Links sublinhados", "Fonte legível"]) {
      await expect(painel.getByRole("button", { name: nome })).toHaveAttribute("aria-pressed", "false");
    }
  });

  test("as escolhas ficam salvas: valem em outras páginas e ao recarregar, já na 1ª pintura", async ({ page }) => {
    await page.goto("/");
    const painel = await abrirPainel(page);
    await painel.getByRole("button", { name: "Alto contraste" }).click();
    await painel.getByRole("button", { name: "Links sublinhados" }).click();
    await page.getByRole("button", { name: "Aumentar texto" }).click();

    await page.goto("/legislacao");
    await expect(page.locator("html")).toHaveAttribute("data-contraste", "alto");
    await expect(page.locator("html")).toHaveAttribute("data-links", "sublinhados");
    await expect(page.locator("html")).toHaveAttribute("data-text-size", "grande");

    // antes mesmo de o React carregar (script do <head>): sem piscar
    await page.goto("/servicos", { waitUntil: "commit" });
    await expect(page.locator("html")).toHaveAttribute("data-contraste", "alto");

    await page.reload();
    const painel2 = await abrirPainel(page);
    await expect(painel2.getByRole("button", { name: "Alto contraste" })).toHaveAttribute("aria-pressed", "true");
    await expect(painel2.getByRole("button", { name: "Links sublinhados" })).toHaveAttribute("aria-pressed", "true");
    await expect(painel2.getByRole("button", { name: "Escala de cinza" })).toHaveAttribute("aria-pressed", "false");
  });

  test("preferência guardada com valor inválido não quebra a página", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("portal-sedur:acessibilidade", "{isso não é json"));
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("html")).not.toHaveAttribute("data-contraste", /.+/);
    await expect(page.getByRole("button", { name: "Aumentar texto" })).toBeVisible();
  });
});

// axe com cada modo ligado (o alto contraste troca todas as cores; os demais mudam fonte, filtro e sublinhado).
const PAGINAS_DOS_MODOS = [
  "/",
  "/servicos",
  "/servicos/ambiental/alteracao-de-razao-social-6876",
  "/consultas/classificacao-de-risco-das-atividades",
  "/consultas/classificacao-de-risco-das-atividades/0",
  "/legislacao",
  "/noticias",
  "/licitacoes",
  "/transparencia/alvara-de-obras-em-vias-e-logradouros",
  "/agendamento",
  "/institucional/estrutura-organizacional",
  "/sistemas-parceiros",
  "/login",
];

for (const modo of ["Alto contraste", "Escala de cinza", "Links sublinhados", "Fonte legível"]) {
  for (const tema of ["light", "dark"] as const) {
    test.describe(`axe com "${modo}" — tema ${tema}`, () => {
      for (const url of PAGINAS_DOS_MODOS) {
        test(url, async ({ page }) => {
          await definirTema(page, tema);
          await page.goto(url);
          const painel = await abrirPainel(page);
          await painel.getByRole("button", { name: modo }).click();
          await page.keyboard.press("Escape");
          await semViolacoesDeAcessibilidade(page);
        });
      }
    });
  }
}

test.describe("axe com o painel de acessibilidade aberto", () => {
  for (const tema of ["light", "dark"] as const) {
    test(`tema ${tema}`, async ({ page }) => {
      await definirTema(page, tema);
      await page.goto("/servicos");
      await abrirPainel(page);
      await semViolacoesDeAcessibilidade(page);
    });
  }
});
