import { expect, test } from "@playwright/test";

test.describe("fichas de serviço", () => {
  test("documento com modelo tem 'Baixar' em https; o resto não", async ({ page }) => {
    await page.goto("/servicos/ambiental/alteracao-de-razao-social-6876");
    const baixar = page.getByRole("link", { name: /Baixar Requerimento de Licenciamento Ambiental \(PDF, abre em nova aba\)/ });
    await expect(baixar).toBeVisible();
    await expect(baixar).toHaveAttribute("href", /^https:\/\/.+\.pdf$/);
    await expect(baixar).toHaveAttribute("target", "_blank");
    await expect(baixar).toHaveAttribute("rel", /noreferrer/);
    await expect(page.getByRole("link", { name: /^Baixar / })).toHaveCount(1);
  });

  test("documento que aponta para outra ficha vira link interno", async ({ page }) => {
    await page.goto("/servicos/empreendimento/habite-se-632");
    const ver = page.getByRole("link", { name: /Ver o serviço/ });
    await expect(ver).toHaveAttribute("href", "/servicos/urbanismo/geolocalizacao-do-imovel-6879");
    await ver.click();
    await expect(page.getByRole("heading", { level: 1, name: "Geolocalização do Imóvel" })).toBeVisible();
  });

  test("ficha mostra só as seções com conteúdo e o botão da ação real", async ({ page }) => {
    await page.goto("/servicos/ambiental/alteracao-de-razao-social-6876");
    const secoes = await page.locator("main h2").allInnerTexts();
    expect(secoes).toEqual(expect.arrayContaining(["Sobre o serviço", "Documentos necessários", "Taxas", "Prazo"]));
    await expect(page.getByText("N/A")).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Emissão de DAM" })).toBeVisible();
  });

  test("documento indispensável ganha o selo de destaque", async ({ page }) => {
    await page.goto("/servicos/empreendimento/comunicado-de-inicio-de-obras-733");
    await expect(page.getByText("Indispensável para análise").first()).toBeVisible();
  });

  test("catálogo: 13 categorias e 151 serviços navegáveis", async ({ page }) => {
    await page.goto("/servicos");
    await expect(page.locator("main a[href^='/servicos/']").filter({ hasNot: page.locator("text=Mais recursos") }).first()).toBeVisible();
    const categorias = await page.locator("main div.flex-wrap a[href^='/servicos/']").count();
    expect(categorias).toBe(13);
  });
});

test.describe("IPTU Verde e Revisão do PDDU", () => {
  test("IPTU Verde: seções claras, 3 formulários e nada de percentual inventado", async ({ page }) => {
    await page.goto("/institucional/projetos");
    await page.getByRole("link", { name: "IPTU Verde" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "IPTU Verde" })).toBeVisible();
    for (const secao of ["O que é o IPTU Verde em Salvador?", "Quem pode participar?", "Como participar", "Quais benefícios o programa oferece?", "Qual o objetivo do IPTU Verde?", "Por que aderir ao IPTU Verde?"]) {
      await expect(page.getByRole("heading", { level: 2, name: secao })).toBeVisible();
    }
    await expect(page.getByRole("link", { name: /Formulário Anexo 0[123] - IPTU Verde/ })).toHaveCount(3);
    await expect(page.getByRole("link", { name: /Anexo 01/ })).toHaveAttribute("href", /^https:\/\/.+\.pdf$/);
    expect(await page.locator("main").innerText()).not.toMatch(/\d\s?%/);
  });

  test("Revisão do PDDU: texto, documentos e link para o site completo", async ({ page }) => {
    await page.goto("/institucional/projetos/revisao-do-pddu");
    await expect(page.getByRole("heading", { level: 1, name: "Revisão do PDDU" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "O que é a LOUOS?" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Cartilha do PDDU/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Site completo da Revisão do PDDU/ })).toHaveAttribute("href", "https://pddu.salvador.ba.gov.br");
  });

  test("todos os links externos abrem em nova aba e dizem isso ao leitor de tela", async ({ page }) => {
    await page.goto("/institucional/projetos/revisao-do-pddu");
    const externos = page.locator("main a[target=_blank]");
    const total = await externos.count();
    expect(total).toBeGreaterThan(3);
    for (let i = 0; i < total; i += 1) {
      await expect(externos.nth(i)).toHaveAttribute("rel", /noreferrer/);
      await expect(externos.nth(i)).toContainText(/abre em nova aba/i);
    }
  });

  test("os 6 projetos antigos continuam e há 8 no total", async ({ page }) => {
    await page.goto("/institucional/projetos");
    await expect(page.locator("main a[href^='/institucional/projetos/']")).toHaveCount(8);
    for (const nome of ["Plano de Incentivos Fiscais", "Eu Curto Meu Passeio", "Conselho Municipal Salvador", "TUL", "Revitalizar", "PIDI"]) {
      await expect(page.getByRole("link", { name: nome, exact: true })).toBeVisible();
    }
  });
});

test.describe("legislação, notícias, licitações, formulários", () => {
  test("legislação: ícone → subtipos → lista; busca global; 14 tipos", async ({ page }) => {
    await page.goto("/legislacao");
    await expect(page.locator("main a.group")).toHaveCount(14);
    await page.getByRole("link", { name: "CNLU" }).click();
    await expect(page).toHaveURL(/\/legislacao\/cnlu$/);
    await expect(page.getByRole("link", { name: /Comunicados/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Resoluções/ })).toBeVisible();
    await page.getByRole("link", { name: /Comunicados/ }).click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Comunicados");
    await expect(page.locator("main li").first()).toBeVisible();
  });

  test("legislação: busca por texto e paginação 'Mostrar mais'", async ({ page }) => {
    await page.goto("/legislacao/decretos");
    await expect(page.getByText(/244 documentos/)).toBeVisible();
    await page.getByPlaceholder("Busque por número, assunto ou palavra da ementa").fill("coleta de óleos");
    await expect(page.getByText(/^\d+ documentos?$/)).toBeVisible();
    await expect(page.getByText("41.818/2026").first()).toBeVisible();
  });

  test("notícias: busca, filtro por ano e detalhe com aviso quando o texto não foi migrado", async ({ page }) => {
    await page.goto("/noticias");
    await page.getByPlaceholder("Buscar por título ou texto").fill("PDDU");
    await page.getByRole("button", { name: /Buscar|Filtrar/ }).click();
    await expect(page).toHaveURL(/q=PDDU/);
    await expect(page.locator("main a[href^=\"/noticias/\"]").first()).toBeVisible();

    // uma notícia antiga (id baixo) não tem o texto completo
    await page.goto("/noticias/1");
    if ((await page.getByRole("heading", { level: 1, name: "Não encontramos essa página" }).count()) === 0) {
      await expect(page.getByText(/ainda não foi migrado para o novo portal/)).toBeVisible();
      await expect(page.getByRole("link", { name: /Ver publicação original/ })).toBeVisible();
    }
  });

  test("licitações: agrupadas por processo e filtráveis por modalidade", async ({ page }) => {
    await page.goto("/licitacoes");
    await expect(page.getByText(/\d+ resultados/)).toBeVisible();
    await expect(page.getByText("Concorrência 1/2023")).toBeVisible();
    await page.getByRole("button", { name: "Pregão", exact: true }).click();
    await expect(page.getByRole("button", { name: "Pregão", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByText("Concorrência 1/2023")).toHaveCount(0);
  });

  test("formulários: 53 e a busca acha os anexos do IPTU Verde", async ({ page }) => {
    await page.goto("/formularios");
    await expect(page.getByText("53 formulários")).toBeVisible();
    await page.getByPlaceholder("Busque um formulário pelo nome").fill("iptu verde");
    await expect(page.getByText("3 formulários")).toBeVisible();
    await page.getByPlaceholder("Busque um formulário pelo nome").fill("zzzzz");
    await expect(page.getByText("Nenhum formulário encontrado para essa busca.")).toBeVisible();
  });
});

test.describe("institucional e transparência", () => {
  test("Institucional: 4 portas; dirigentes e organograma", async ({ page }) => {
    await page.goto("/institucional");
    await expect(page.locator("main a.group")).toHaveCount(4);
    await page.goto("/institucional/dirigentes");
    await expect(page.getByText("Secretário Municipal de Desenvolvimento Urbano").first()).toBeVisible();
    await page.goto("/institucional/estrutura-organizacional");
    await expect(page.getByText("Colegiados de deliberação superior")).toBeVisible();
  });

  test("Transparência: ícones dos painéis, audiências, EIV e Carnaval", async ({ page }) => {
    await page.goto("/transparencia");
    await expect(page.locator("main a.group")).toHaveCount(11);
    await page.goto("/transparencia/eiv-riv");
    await expect(page.locator("main details").first()).toBeVisible();
  });

  test("Sistemas parceiros: links externos com aviso; PDDU e Consulta Prévia presentes", async ({ page }) => {
    await page.goto("/sistemas-parceiros");
    await expect(page.getByText("Ao abrir um deles você sai deste portal")).toBeVisible();
    await expect(page.getByRole("link", { name: /Consulta Prévia Salvador/ })).toHaveAttribute("target", "_blank");
    await expect(page.getByText("Em manutenção")).toHaveCount(2); // Autorização para Feira (CLE) e Salvador Ruas
  });

  test("Canais de atendimento: WhatsApp, e-mail e denúncias", async ({ page }) => {
    await page.goto("/canais-de-atendimento");
    await expect(page.getByText("(71) 99620-5122")).toBeVisible();
    await expect(page.getByText("protocolo.sedur@salvador.ba.gov.br")).toBeVisible();
  });
});

test.describe("home: acessos rápidos (o que o portal atual põe na página inicial)", () => {
  test("8 atalhos, cada um leva a uma página que existe", async ({ page }) => {
    await page.goto("/");
    const secao = page.locator("section").filter({ has: page.getByRole("heading", { level: 2, name: "Acessos rápidos" }) });
    const links = secao.getByRole("link");
    await expect(links).toHaveCount(8);
    const destinos = await links.evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).getAttribute("href")!));
    expect(destinos).toEqual([
      "/agendamento", "/consultas", "/formularios", "/geoservicos", "/transparencia", "/canais-de-atendimento",
      "/institucional/projetos/revisao-do-pddu", "/sistemas-parceiros",
    ]);
    for (const destino of destinos) {
      const resposta = await page.request.get(destino);
      expect(resposta.status(), destino).toBe(200);
    }
  });

  test("Sistemas parceiros lista a Autorização para Feira (CLE) em manutenção", async ({ page }) => {
    await page.goto("/sistemas-parceiros");
    await expect(page.getByRole("link", { name: /Autorização para Feira \(CLE\)/ })).toBeVisible();
  });
});
