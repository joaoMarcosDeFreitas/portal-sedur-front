import { expect, test } from "@playwright/test";
import { PAGINAS_PUBLICAS } from "./helpers";

// Endereços inexistentes. Os primeiros respondem 404 de verdade (rotas com lista fechada de endereços). Os de
// consultas, painéis e legislação leem filtros da URL e são montados a cada visita: aí o Next só entrega a 404 vazia
// (sem JavaScript, página em branco), então a tela "não encontrada" é mostrada pela própria página (status 200, com noindex).
const INEXISTENTES_COM_404 = [
  "/pagina-inexistente",
  "/noticias/999999",
  "/servicos/nao-existe",
  "/servicos/ambiental/nao-existe-1",
  "/institucional/projetos/nao-existe",
  "/institucional/areas-de-atuacao/nao-existe",
  "/solicitar/6876/abrir-processo",
  "/solicitar/999999/emitir-dam",
];
const INEXISTENTES_COM_TELA = [
  "/consultas/nao-existe",
  "/consultas/auto-de-infracao/999999",
  "/transparencia/nao-existe",
  "/transparencia/alvaras-de-habite-se/999999",
  "/transparencia/carnaval/publicidade-em-blocos/999999",
  "/legislacao/nao-existe",
  "/legislacao/cnlu/nao-existe",
];

// Fumaça de todas as páginas: abre, tem estrutura mínima e não gera erro no navegador.
for (const url of PAGINAS_PUBLICAS) {
  test(`abre sem erro e com estrutura correta: ${url}`, async ({ page }) => {
    const erros: string[] = [];
    page.on("pageerror", (e) => erros.push(`pageerror: ${e.message}`));
    page.on("console", (m) => m.type() === "error" && erros.push(`console: ${m.text()}`));
    page.on("response", (r) => {
      if (r.status() >= 400 && new URL(r.url()).origin === new URL(page.url() || "http://localhost:3100").origin) {
        erros.push(`HTTP ${r.status()} ${r.url()}`);
      }
    });

    const resposta = await page.goto(url);
    expect(resposta?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page).toHaveTitle(/\S+ \| Portal SEDUR$|^Portal SEDUR — /);
    await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
    expect(erros, "erros do navegador").toEqual([]);
  });
}

test.describe("páginas de erro", () => {
  test("endereço sem rota: 404 com página completa e título próprio", async ({ page }) => {
    const resposta = await page.goto("/pagina-inexistente");
    expect(resposta?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1, name: "Não encontramos essa página" })).toBeVisible();
    await expect(page).toHaveTitle("Página não encontrada | Portal SEDUR");
    await expect(page.getByRole("link", { name: "Ir para a página inicial" })).toBeVisible();
  });

  test.describe("registro que não existe dentro do portal", () => {
    for (const url of [...INEXISTENTES_COM_404, ...INEXISTENTES_COM_TELA]) {
      test(url, async ({ page }) => {
        const resposta = await page.goto(url);
        expect(resposta?.status()).toBe(INEXISTENTES_COM_404.includes(url) ? 404 : 200);
        // Com JavaScript, a 404 aparece dentro do portal (sidebar + conteúdo).
        await expect(page.getByRole("heading", { level: 1, name: "Não encontramos essa página" })).toBeVisible();
        await expect(page.locator("main")).toHaveCount(1);
      });
    }
  });
});

// Sem JavaScript (navegador antigo, bloqueador de scripts, rede ruim): nenhum endereço pode mostrar página em branco.
test.describe("sem JavaScript: nunca uma página em branco", () => {
  test.use({ javaScriptEnabled: false });

  for (const url of [...INEXISTENTES_COM_404, ...INEXISTENTES_COM_TELA]) {
    test(`404 completa: ${url}`, async ({ page }) => {
      const resposta = await page.goto(url);
      expect(resposta?.status()).toBe(INEXISTENTES_COM_404.includes(url) ? 404 : 200);
      await expect(page.getByRole("heading", { level: 1, name: "Não encontramos essa página" })).toBeVisible();
      await expect(page.getByRole("link", { name: "Ir para a página inicial" })).toBeVisible();
      await expect(page).toHaveTitle("Página não encontrada | Portal SEDUR");
      // fora dos buscadores (o 404 verdadeiro já recebe isso do Next)
      await expect(page.locator("meta[name=robots]")).toHaveAttribute("content", /noindex/);
    });
  }

  for (const url of ["/", "/servicos", "/servicos/ambiental/alteracao-de-razao-social-6876", "/noticias/100", "/legislacao/decretos", "/consultas/classificacao-de-risco-das-atividades", "/institucional/projetos/iptu-verde"]) {
    test(`páginas de conteúdo já vêm prontas do servidor: ${url}`, async ({ page }) => {
      await page.goto(url);
      await expect(page.locator("h1")).toHaveCount(1);
      expect((await page.locator("main").innerText()).length).toBeGreaterThan(200);
    });
  }
});
