import { expect, test } from "@playwright/test";

test.describe("consultas", () => {
  test("DAM por CGA: nada antes de consultar, resultado, detalhes e voltar", async ({ page }) => {
    await page.goto("/consultas/renovacao-de-publicidade-dam");
    await expect(page.getByRole("heading", { level: 1, name: "Consulta de DAMs em aberto por CGA" })).toBeVisible();
    await expect(page.getByText("Preencha o campo acima e clique em consultar")).toBeVisible();
    await expect(page.getByRole("table")).toHaveCount(0);

    await page.getByLabel("CGA", { exact: true }).fill("90147");
    await page.getByRole("button", { name: "Consultar" }).click();
    await expect(page).toHaveURL(/cga=90147/);
    await expect(page.getByRole("table")).toBeVisible();
    await expect(page.locator("tbody tr")).toHaveCount(1);
    await expect(page.getByText("Demonstração: os resultados abaixo são fictícios")).toBeVisible();

    await page.getByRole("link", { name: /Ver detalhes de DAM|^Detalhes/ }).click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/^DAM /);
    await expect(page.getByText("Em aberto").first()).toBeVisible();
    await expect(page.getByText("Demonstração: os dados desta ficha são fictícios")).toBeVisible();

    await page.getByRole("link", { name: "Voltar aos resultados" }).click();
    await expect(page.getByLabel("CGA", { exact: true })).toHaveValue("90147");
    await expect(page.locator("tbody tr")).toHaveCount(1);
  });

  test("CGA que não existe mostra a mensagem do portal atual; parcial não acha", async ({ page }) => {
    await page.goto("/consultas/renovacao-de-publicidade-dam?cga=9014");
    await expect(page.getByText("Não foi encontrado DAM em aberto para o CGA informado!")).toBeVisible();
    await page.getByRole("link", { name: "Limpar" }).click();
    await expect(page.getByLabel("CGA", { exact: true })).toHaveValue("");
    await expect(page.getByText("Preencha o campo acima")).toBeVisible();
  });

  test("solicitação de serviços: campos reais (Origem, Ano, Número) e não encontrada", async ({ page }) => {
    await page.goto("/consultas/solicitacao-de-servicos?origem=SEDUR&ano=1999&numero=1");
    await expect(page.getByLabel("Origem")).toBeVisible();
    await expect(page.getByLabel("Ano")).toBeVisible();
    await expect(page.getByLabel("Número")).toBeVisible();
    await expect(page.getByText("Solicitação não encontrada.")).toBeVisible();
  });

  test("classificação de risco: dados reais, paginação e filtro", async ({ page }) => {
    await page.goto("/consultas/classificacao-de-risco-das-atividades");
    await expect(page.getByText("Dados oficiais da SEDUR")).toBeVisible();
    await expect(page.getByText("Mostrando 1 a 20 de 1.332 resultados")).toBeVisible();
    await expect(page.locator("tbody tr")).toHaveCount(20);

    await page.getByRole("link", { name: "Próxima página" }).click();
    await expect(page).toHaveURL(/pagina=2/);
    await expect(page.getByText("Mostrando 21 a 40 de 1.332 resultados")).toBeVisible();

    await page.getByLabel("Filtrar").fill("extracao de sal");
    await page.getByRole("button", { name: "Pesquisar" }).click();
    await expect(page.getByText("0892-4/02").first()).toBeVisible();
    await expect(page.getByText(/Mostrando|\d+ resultados?/).first()).toBeVisible();
  });

  test("detalhe do risco: 4 níveis com selo e condicionantes por extenso", async ({ page }) => {
    await page.goto("/consultas/classificacao-de-risco-das-atividades/0");
    await expect(page.getByRole("heading", { level: 1, name: "Extração de sal-gema" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Classificação de risco" })).toBeVisible();
    for (const rotulo of ["Risco urbanístico", "Risco sanitário (VISA)", "Risco ambiental", "Risco municipal unificado"]) {
      await expect(page.getByText(rotulo, { exact: true })).toBeVisible();
    }
    await expect(page.getByRole("heading", { level: 2, name: "Condicionante para baixo risco A" })).toBeVisible();
    await expect(page.getByText("Desde que seja escritório da empresa")).toBeVisible();
  });

  test("atividades para escritórios virtuais: catálogo completo (318)", async ({ page }) => {
    await page.goto("/consultas/atividades-para-escritorios-virtuais");
    await expect(page.getByText(/de 318 resultados/)).toBeVisible();
  });

  test("auto de infração: ficha com linha do tempo", async ({ page }) => {
    await page.goto("/consultas/auto-de-infracao/1");
    await expect(page.getByRole("heading", { level: 2, name: "Andamento" })).toBeVisible();
    await expect(page.getByText("Auto lavrado")).toBeVisible();
  });
});

test.describe("painéis de transparência (campos do portal atual)", () => {
  test("processo em 3 campos: filtro exato pelo processo de uma linha", async ({ page }) => {
    await page.goto("/transparencia/alvaras-de-habite-se");
    const processo = (await page.locator("tbody tr").first().locator("td").nth(2).innerText()).trim(); // SEDUR/ano/num
    const [origem, ano, numero] = processo.split("/");
    await page.getByRole("group", { name: /Processo \(Origem/ }).getByLabel("Origem").fill(origem);
    await page.getByRole("group", { name: /Processo \(Origem/ }).getByLabel("Ano").fill(ano);
    await page.getByRole("group", { name: /Processo \(Origem/ }).getByLabel("Nº do processo").fill(numero);
    await page.getByRole("button", { name: "Consultar" }).click();
    await expect(page.locator("tbody tr")).toHaveCount(1);
    await expect(page.locator("tbody tr").first()).toContainText(processo);
  });

  test("período de datas (Deferimento) restringe o resultado e fica na URL", async ({ page }) => {
    await page.goto("/transparencia/alvara-de-obras-em-vias-e-logradouros");
    const antes = await page.locator("tbody tr").count();
    const grupo = page.getByRole("group", { name: "Deferimento" });
    await grupo.getByLabel("De").fill("2025-01-01");
    await grupo.getByLabel("Até").fill("2025-12-31");
    await page.getByRole("button", { name: "Consultar" }).click();
    await expect(page).toHaveURL(/deferimento_de=2025-01-01/);
    const datas = await page.locator("tbody tr td:nth-child(6)").allInnerTexts();
    expect(datas.length).toBeGreaterThan(0);
    expect(datas.length).toBeLessThan(antes);
    expect(datas.every((d) => d.trim().endsWith("/2025"))).toBe(true);
  });

  test("Processos em Convite: 17 grupos reais + 'Selecione uma opção'", async ({ page }) => {
    await page.goto("/transparencia/processos-em-convite");
    const opcoes = await page.getByLabel("Grupo de Serviço").locator("option").allInnerTexts();
    expect(opcoes).toHaveLength(18);
    expect(opcoes[0]).toBe("Selecione uma opção");
    await page.getByLabel("Grupo de Serviço").selectOption("AMBIENTAL");
    await page.getByRole("button", { name: "Consultar" }).click();
    await expect(page).toHaveURL(/grupo=AMBIENTAL/);
    const grupos = await page.locator("tbody tr td:nth-child(2)").allInnerTexts();
    expect(grupos.length).toBeGreaterThan(0);
    expect(grupos.every((g) => g.trim() === "AMBIENTAL")).toBe(true);
  });

  test("meses começam com 'Selecione' (Construção por Mês e Eventos)", async ({ page }) => {
    for (const url of ["/transparencia/alvaras-de-construcao-por-mes", "/transparencia/eventos-licenciados"]) {
      await page.goto(url);
      await expect(page.getByLabel("Mês").locator("option").first()).toHaveText("Selecione");
      await expect(page.getByLabel("Mês").locator("option")).toHaveCount(13);
    }
  });
});

test.describe("Fiscalização Carnaval 2026", () => {
  test("4 painéis: só Publicidade em Blocos funciona; os outros 3 estão 'Em construção'", async ({ page }) => {
    await page.goto("/transparencia");
    await page.getByRole("link", { name: "Fiscalização Carnaval 2026" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Fiscalização Carnaval 2026" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Publicidade em Blocos/ })).toBeVisible();
    for (const nome of ["Exploração de Atividades", "Instalação de Praticável", "Instalação de Balcão"]) {
      await expect(page.getByText(nome, { exact: true })).toBeVisible();
    }
    await expect(page.getByText("Em construção", { exact: true })).toHaveCount(3);
    await expect(page.getByRole("link", { name: /Exploração de Atividades|Praticável|Balcão/ })).toHaveCount(0);
  });

  test("painel: 15 datas (04/02–18/02), 3 circuitos, filtro e detalhe do alvará", async ({ page }) => {
    await page.goto("/transparencia/carnaval/publicidade-em-blocos");
    const datas = await page.getByLabel("Data").locator("option").allInnerTexts();
    expect(datas).toHaveLength(16);
    expect(datas[1]).toBe("04/02");
    expect(datas.at(-1)).toBe("18/02");
    expect((await page.getByLabel("Circuito").locator("option").allInnerTexts()).slice(1)).toEqual(["Batatinha", "Dodô", "Osmar"]);

    await page.getByLabel("Circuito").selectOption("Osmar");
    await page.getByRole("button", { name: "Consultar" }).click();
    await expect(page).toHaveURL(/circuito=Osmar/);
    const circuitos = await page.locator("tbody tr td:nth-child(3)").allInnerTexts();
    expect(circuitos.length).toBeGreaterThan(0);
    expect(new Set(circuitos.map((c) => c.trim()))).toEqual(new Set(["Osmar"]));

    await page.getByRole("link", { name: /Ver detalhes de Alvará/ }).first().click();
    await expect(page).toHaveURL(/publicidade-em-blocos\/\d+\?circuito=Osmar/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Alvará CARN-2026-");
    await expect(page.getByText("Emitido", { exact: true })).toBeVisible();
  });
});
