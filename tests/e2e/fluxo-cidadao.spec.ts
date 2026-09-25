import { expect, test } from "@playwright/test";
import { entrarComoDemonstracao } from "./helpers";

// Cada ficha tem só os botões que o portal atual realmente oferece (dados reais de `servicos.json`):
const SO_DAM = "/servicos/ambiental/alteracao-de-razao-social-6876"; // "Emissão de DAM"
const SO_PROCESSO = "/servicos/ambiental/autorizacao-de-poda-7053"; // "Abrir processo"
const OS_DOIS = "/servicos/empreendimento/aop-de-parametros-urbanisticos-1354"; // os dois botões
const NENHUM = "/servicos/auxiliares/defesa-de-auto-de-infracao-7004"; // sem botão (só informação)

test.describe("botões de cada ficha (conforme o portal atual)", () => {
  test("só DAM: um botão 'Emissão de DAM' e a explicação da sigla", async ({ page }) => {
    await page.goto(SO_DAM);
    await expect(page.getByRole("link", { name: "Emissão de DAM" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Abrir processo" })).toHaveCount(0);
    await expect(page.getByText(/DAM é o Documento de Arrecadação Municipal/)).toBeVisible();
  });

  test("só processo: um botão 'Abrir processo' e nada de DAM", async ({ page }) => {
    await page.goto(SO_PROCESSO);
    await expect(page.getByRole("link", { name: "Abrir processo" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Emissão de DAM" })).toHaveCount(0);
    await expect(page.getByText(/DAM é o Documento/)).toHaveCount(0);
  });

  test("os dois botões existem quando o serviço tem as duas ações", async ({ page }) => {
    await page.goto(OS_DOIS);
    await expect(page.getByRole("link", { name: "Emissão de DAM" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Abrir processo" })).toBeVisible();
  });

  test("sem ação: nenhum botão, e um aviso claro com caminho para o atendimento", async ({ page }) => {
    await page.goto(NENHUM);
    await expect(page.getByRole("link", { name: /Emissão de DAM|Abrir processo|Solicitar/ })).toHaveCount(0);
    await expect(page.getByText("Este serviço não tem botão de solicitação no Portal de Serviços.")).toBeVisible();
    await page.locator("main").getByRole("link", { name: "canais de atendimento" }).click();
    await expect(page).toHaveURL(/\/canais-de-atendimento$/);
  });

  test("ações que a ficha não oferece dão 404 completo; o endereço antigo redireciona", async ({ page }) => {
    for (const url of ["/solicitar/6876/abrir-processo", "/solicitar/7053/emitir-dam", "/solicitar/7004/emitir-dam", "/solicitar/7004/abrir-processo"]) {
      const resposta = await page.goto(url);
      expect(resposta?.status(), url).toBe(404);
      await expect(page.getByRole("heading", { level: 1, name: "Não encontramos essa página" })).toBeVisible();
    }
    // `/solicitar/<id>` (endereço antigo) leva à 1ª ação; sem ação, volta à ficha
    await entrarComoDemonstracao(page);
    await page.goto("/solicitar/6876");
    await expect(page).toHaveURL(/\/solicitar\/6876\/emitir-dam$/);
    await page.goto("/solicitar/7004");
    await expect(page).toHaveURL(/\/servicos\/auxiliares\/defesa-de-auto-de-infracao-7004$/);
  });
});

test.describe("Emissão de DAM (simulada)", () => {
  test("ficha → login → conferir taxa → emitir → pagar → pago (sem processo e sem análise)", async ({ page }) => {
    await page.goto(SO_DAM);
    await page.getByRole("link", { name: "Emissão de DAM" }).click();

    // sem sessão: vai ao login e volta para onde estava
    await expect(page).toHaveURL(/\/login\?proximo=%2Fsolicitar%2F6876%2Femitir-dam/);
    await page.getByRole("button", { name: /Construtora Exemplo/ }).click();
    await expect(page).toHaveURL(/\/solicitar\/6876\/emitir-dam$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Emissão de DAM: Alteração de Razão Social");

    // a taxa aparece e o DAM é a soma (R$ 701,39 + R$ 24,21); não pede imóvel nem declaração
    await expect(page.getByText("R$ 701,39")).toBeVisible();
    await expect(page.getByText(/725,60/)).toBeVisible();
    await expect(page.getByLabel("Endereço do imóvel")).toHaveCount(0);
    await expect(page.getByRole("checkbox")).toHaveCount(0);
    await page.getByRole("button", { name: "Emitir DAM" }).click();

    await expect(page).toHaveURL(/\/minhas-solicitacoes\/DAM-\d{4}-\d{6}$/);
    const protocolo = page.url().split("/").pop()!;
    await expect(page.getByText("Aguardando pagamento").first()).toBeVisible();
    await expect(page.getByText(/Emissão de DAM · Protocolo/)).toBeVisible();
    await page.getByRole("button", { name: "Pagar com PIX" }).click();

    // pago: termina aqui (não vira "análise" nem pede "concluir")
    await expect(page.getByText(/Pago em/)).toBeVisible();
    await expect(page.getByText("Pago", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Comprovante disponível")).toBeVisible();
    await expect(page.getByText("Análise técnica")).toHaveCount(0);
    await expect(page.getByRole("button", { name: /Simular conclusão/ })).toHaveCount(0);

    await page.goto("/minhas-solicitacoes");
    const linha = page.getByRole("link", { name: new RegExp(protocolo) });
    await expect(linha).toContainText("Emissão de DAM");
    await expect(linha).toContainText("Pago");
    await page.reload();
    await expect(page.getByRole("link", { name: new RegExp(protocolo) })).toBeVisible();
  });
});

test.describe("Abrir processo (simulado)", () => {
  test("ficha → endereço e documentos → protocolo → análise → conclusão (sem DAM)", async ({ page }) => {
    await entrarComoDemonstracao(page);
    await page.goto(SO_PROCESSO);
    await page.getByRole("link", { name: "Abrir processo" }).click();
    await expect(page).toHaveURL(/\/solicitar\/7053\/abrir-processo$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Abrir processo: Autorização de Poda");

    // validação
    await page.getByRole("button", { name: "Abrir processo" }).click();
    await expect(page.getByRole("alert").filter({ hasText: "Informe o endereço do imóvel." })).toBeVisible();
    await expect(page.getByRole("alert").filter({ hasText: "Informe o bairro." })).toBeVisible();
    await expect(page.getByRole("alert").filter({ hasText: "Confirme a declaração para enviar." })).toBeVisible();

    await page.getByLabel("Endereço do imóvel").fill("Rua Teste, 10");
    await page.getByLabel("Bairro").fill("Pituba");
    await page.getByRole("button", { name: "Anexar" }).first().click();
    await expect(page.getByRole("button", { name: "Anexado" })).toHaveCount(1);
    await expect(page.getByText(/Valor (estimado )?d[ao] (taxa|DAM)/)).toHaveCount(0); // processo não gera DAM
    await page.getByRole("checkbox", { name: /Declaro/ }).check();
    await page.getByRole("button", { name: "Abrir processo" }).click();

    await expect(page).toHaveURL(/\/minhas-solicitacoes\/SEDUR-\d{4}-\d{6}$/);
    const protocolo = page.url().split("/").pop()!;
    await expect(page.getByText("Em análise").first()).toBeVisible();
    await expect(page.getByText(/Abertura de processo · Protocolo/)).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Pagamento (DAM)" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: /Pagar/ })).toHaveCount(0);

    await page.getByRole("button", { name: /Simular conclusão/ }).click();
    await expect(page.getByText("Concluída", { exact: true }).first()).toBeVisible();

    await page.goto("/minhas-solicitacoes");
    const linha = page.getByRole("link", { name: new RegExp(protocolo) });
    await expect(linha).toContainText("Abertura de processo");
    await expect(linha).toContainText("Concluída");
  });

  test("serviço com as duas ações: cada botão faz o seu pedido separado", async ({ page }) => {
    await entrarComoDemonstracao(page);
    await page.goto(OS_DOIS);
    await page.getByRole("link", { name: "Emissão de DAM" }).click();
    await expect(page).toHaveURL(/\/solicitar\/1354\/emitir-dam$/);
    await page.getByRole("button", { name: "Emitir DAM" }).click();
    await expect(page).toHaveURL(/\/minhas-solicitacoes\/DAM-/);

    await page.goto(OS_DOIS);
    await page.getByRole("link", { name: "Abrir processo" }).click();
    await expect(page).toHaveURL(/\/solicitar\/1354\/abrir-processo$/);
  });
});

test.describe("sessão simulada", () => {
  test("área privada exige login e volta à página pedida", async ({ page }) => {
    await page.goto("/minhas-solicitacoes");
    await expect(page).toHaveURL(/\/login\?proximo=%2Fminhas-solicitacoes/);
    await page.getByRole("button", { name: /Maria Souza/ }).click();
    await expect(page).toHaveURL(/\/minhas-solicitacoes$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("a sessão sobrevive ao recarregar e 'Sair' encerra e volta à home", async ({ page }) => {
    await entrarComoDemonstracao(page);
    await page.reload();
    await expect(page.getByRole("link", { name: /Maria/ }).first()).toBeVisible();
    await page.getByRole("button", { name: "Sair" }).click();
    await expect(page.getByRole("link", { name: "Entrar" })).toBeVisible();
    await page.goto("/minhas-solicitacoes");
    await expect(page).toHaveURL(/\/login/);
  });

  test("login só aceita caminho interno em ?proximo (sem redirecionamento aberto)", async ({ page }) => {
    await page.goto("/login?proximo=https://exemplo-malicioso.com");
    await page.getByRole("button", { name: /Maria Souza/ }).click();
    await expect(page).not.toHaveURL(/exemplo-malicioso/);
    await expect(page).toHaveURL(/localhost:3100/);
  });

  test("nada é enviado a servidor: a demonstração só grava no navegador", async ({ page }) => {
    const requisicoes: string[] = [];
    page.on("request", (r) => r.method() !== "GET" && requisicoes.push(`${r.method()} ${r.url()}`));
    await entrarComoDemonstracao(page);
    await page.goto(SO_DAM);
    await page.getByRole("link", { name: "Emissão de DAM" }).click();
    await page.getByRole("button", { name: "Emitir DAM" }).click();
    await expect(page).toHaveURL(/\/minhas-solicitacoes\/DAM-/);
    expect(requisicoes, "requisições de escrita ao servidor").toEqual([]);
  });
});
