import { expect, test } from "@playwright/test";

const SEIS = ["Plano de Incentivos Fiscais", "Eu Curto Meu Passeio", "Conselho Municipal Salvador", "TUL", "Revitalizar", "PIDI"];
const VOLTAR = { name: "Voltar", exact: true } as const;

test.describe("Nossos Projetos na home e na barra lateral", () => {
  test("a home mostra a seção com os 8 projetos (6 com a ilustração do site atual) e o link 'Ver todos'", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 2, name: "Nossos Projetos" })).toBeVisible();
    const secao = page.locator("section", { has: page.getByRole("heading", { level: 2, name: "Nossos Projetos" }) });
    await expect(secao.locator("a[href^='/projetos/']")).toHaveCount(8);
    await expect(secao.locator("img")).toHaveCount(6);
    for (const nome of SEIS) await expect(secao.getByRole("link", { name: nome, exact: true })).toBeVisible();
    await secao.getByRole("link", { name: "Ver todos" }).click();
    await expect(page).toHaveURL(/\/projetos$/);
  });

  test("a barra lateral tem 'Nossos Projetos', que fica marcado nas páginas do projeto", async ({ page }) => {
    await page.goto("/servicos");
    const menu = page.getByRole("navigation", { name: "Navegação principal" });
    await menu.getByRole("link", { name: "Nossos Projetos" }).click();
    await expect(page).toHaveURL(/\/projetos$/);
    await expect(page.getByRole("heading", { level: 1, name: "Nossos Projetos" })).toBeVisible();
    await page.goto("/projetos/tul");
    await expect(menu.getByRole("link", { name: "Nossos Projetos" })).toHaveAttribute("aria-current", "page");
  });

  test("os endereços antigos (/institucional/projetos…) redirecionam", async ({ page }) => {
    await page.goto("/institucional/projetos");
    await expect(page).toHaveURL(/\/projetos$/);
    await page.goto("/institucional/projetos/revitalizar");
    await expect(page).toHaveURL(/\/projetos\/revitalizar$/);
    await expect(page.getByRole("heading", { level: 1, name: "Revitalizar" })).toBeVisible();
  });

  test("Institucional continua com 4 portas e a dos projetos leva a /projetos", async ({ page }) => {
    await page.goto("/institucional");
    await page.getByRole("link", { name: "Nossos Projetos" }).last().click();
    await expect(page).toHaveURL(/\/projetos$/);
  });

  test("a busca encontra os projetos", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("combobox").fill("projetos");
    await expect(page.getByRole("option", { name: /Nossos Projetos/ }).first()).toBeVisible();
  });
});

test.describe("conteúdo migrado dos projetos", () => {
  test("Revitalizar: tabela dos 13 bairros, passo a passo, mapa e links mortos só como texto", async ({ page }) => {
    await page.goto("/projetos/revitalizar");
    await expect(page.getByRole("heading", { level: 1, name: "Revitalizar" })).toBeVisible();
    const tabela = page.getByRole("table");
    await expect(tabela.locator("tbody tr")).toHaveCount(13);
    await expect(tabela.getByRole("columnheader")).toHaveCount(3);
    await expect(page.getByText("1º passo", { exact: false }).first()).toBeVisible();
    await expect(page.getByText("7º passo", { exact: false }).first()).toBeVisible();
    await expect(page.getByRole("img", { name: /poligonal de abrangência/ })).toBeVisible();
    await expect(page.getByText("(link indisponível no portal atual)")).toHaveCount(2);
    // nenhum link para o Portal de Serviços antigo (que não existe mais aqui)
    await expect(page.locator("main a[href*='servicosonline']")).toHaveCount(0);
  });

  test("Plano de Incentivos Fiscais: leis em PDF em nova aba e link para a ficha do serviço deste portal", async ({ page }) => {
    await page.goto("/projetos/plano-de-incentivos-fiscais");
    const pdfs = page.locator("main a[href$='.pdf']");
    expect(await pdfs.count()).toBeGreaterThanOrEqual(7);
    await expect(pdfs.first()).toHaveAttribute("target", "_blank");
    await expect(pdfs.first()).toContainText(/abre em nova aba/i);
    await page.getByRole("link", { name: "Adesão ao Plano de Incentivos Fiscais" }).click();
    await expect(page).toHaveURL(/\/servicos\/desenvolvimento-economico\/adesao-ao-plano-de-incentivos-fiscais-6992$/);
  });

  test("Eu Curto Meu Passeio: o banner abre o PDF do programa", async ({ page }) => {
    await page.goto("/projetos/eu-curto-meu-passeio");
    const banner = page.getByRole("link", { name: /Eu Curto Meu Passeio: abrir o material do programa/ });
    await expect(banner).toHaveAttribute("href", "https://sedur.salvador.ba.gov.br/arquivos/pdf/meupasseio2021.pdf");
    await expect(banner).toHaveAttribute("target", "_blank");
  });

  test("TUL: lista, manual (imagem) e a carta de serviços leva à categoria daqui", async ({ page }) => {
    await page.goto("/projetos/tul");
    await expect(page.locator("main ul li").first()).toBeVisible();
    await expect(page.getByRole("img", { name: "Capa do Manual da TUL" })).toBeVisible();
    await page.getByRole("link", { name: /carta de serviço/ }).click();
    await expect(page).toHaveURL(/\/servicos\/desenvolvimento-economico$/);
  });

  test("Conselho e PIDI: documentos para baixar", async ({ page }) => {
    await page.goto("/projetos/conselho-municipal-salvador");
    expect(await page.locator("main a[href$='.pdf']").count()).toBeGreaterThanOrEqual(6);
    await page.goto("/projetos/pidi");
    await expect(page.getByRole("link", { name: /EDITAL – PIDI Nº 0[12]\/2016/ })).toHaveCount(2);
  });

  test("as ilustrações carregam (não ficam quebradas)", async ({ page }) => {
    await page.goto("/projetos");
    const imagens = page.locator("main img");
    await expect(imagens).toHaveCount(6);
    // O Next carrega as imagens fora da tela só quando chegam perto (lazy): rola até cada uma antes de conferir.
    for (let i = 0; i < 6; i += 1) await imagens.nth(i).scrollIntoViewIfNeeded();
    await expect
      .poll(() => imagens.evaluateAll((els) => els.filter((el) => !(el as HTMLImageElement).complete || (el as HTMLImageElement).naturalWidth === 0).length))
      .toBe(0);
  });
});

test.describe("botão Voltar", () => {
  test("não aparece na página inicial", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", VOLTAR)).toHaveCount(0);
  });

  test("volta para a página em que a pessoa estava, passo a passo", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("navigation", { name: "Navegação principal" }).getByRole("link", { name: "Serviços" }).click();
    await expect(page).toHaveURL(/\/servicos$/);
    await page.getByRole("link", { name: "Ambiental" }).first().click();
    await expect(page).toHaveURL(/\/servicos\/ambiental$/);
    await page.getByRole("link", { name: /Alteração de Razão Social/ }).first().click();
    await expect(page).toHaveURL(/alteracao-de-razao-social-6876$/);

    // Espera a página de destino aparecer (não só o endereço mudar) antes de voltar de novo, como uma pessoa faria.
    const titulo = page.getByRole("heading", { level: 1 });
    await page.getByRole("button", VOLTAR).click();
    await expect(page).toHaveURL(/\/servicos\/ambiental$/);
    await expect(titulo).toHaveText("Ambiental");
    await page.getByRole("button", VOLTAR).click();
    await expect(page).toHaveURL(/\/servicos$/);
    await expect(titulo).toHaveText(/Serviços/);
    await page.getByRole("button", VOLTAR).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("heading", { level: 2, name: "Acessos rápidos" })).toBeVisible();
    await expect(page.getByRole("button", VOLTAR)).toHaveCount(0);
  });

  test("ao abrir a página direto por um link, volta para a página de cima", async ({ page }) => {
    await page.goto("/servicos/ambiental/alteracao-de-razao-social-6876");
    await page.getByRole("button", VOLTAR).click();
    await expect(page).toHaveURL(/\/servicos\/ambiental$/);
  });

  test("projeto aberto direto: volta para a lista de projetos", async ({ page }) => {
    await page.goto("/projetos/tul");
    await page.getByRole("button", VOLTAR).click();
    await expect(page).toHaveURL(/\/projetos$/);
  });

  test("ficha de consulta aberta direto: voltar reabre a lista com os filtros", async ({ page }) => {
    await page.goto("/consultas/auto-de-infracao/1?numero=091135");
    await page.getByRole("button", VOLTAR).click();
    await expect(page).toHaveURL(/\/consultas\/auto-de-infracao\?numero=091135$/);
  });

  test("está no topo do conteúdo, antes do título, nas páginas do portal", async ({ page }) => {
    for (const url of ["/servicos", "/noticias/100", "/projetos/revitalizar", "/agendamento", "/login"]) {
      await page.goto(url);
      const botao = page.getByRole("button", VOLTAR);
      await expect(botao, url).toHaveCount(1);
      const [yBotao, yTitulo] = await Promise.all([
        botao.evaluate((el) => el.getBoundingClientRect().top),
        page.getByRole("heading", { level: 1 }).first().evaluate((el) => el.getBoundingClientRect().top),
      ]);
      expect(yBotao, url).toBeLessThan(yTitulo);
    }
  });

  test("funciona só com o teclado", async ({ page }) => {
    await page.goto("/projetos/tul");
    await page.getByRole("button", VOLTAR).focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/projetos$/);
  });
});
