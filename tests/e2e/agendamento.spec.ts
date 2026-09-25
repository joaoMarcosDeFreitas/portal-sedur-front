import { expect, test, type Page } from "@playwright/test";
import { semViolacoesDeAcessibilidade } from "./helpers";

async function escolherDiaEHorario(page: Page) {
  const dia = page.getByLabel("Dia", { exact: true });
  await expect(dia.locator("option")).toHaveCount(16); // "Selecione o dia" + 15 dias úteis
  await dia.selectOption({ index: 1 });
  const livre = page.getByRole("radio").and(page.locator(":not(:disabled)")).first();
  await livre.check({ force: true });
  return livre.inputValue();
}

test.describe("agendamento de atendimento (simulado)", () => {
  test("marca, recebe o comprovante, vê em 'Meus agendamentos', recarrega e cancela", async ({ page }) => {
    await page.goto("/agendamento");
    await expect(page.getByRole("heading", { level: 1, name: "Agendamento de atendimento" })).toBeVisible();
    await expect(page.getByText("Você ainda não marcou nenhum atendimento neste navegador.")).toBeVisible();

    await page.getByLabel("Assunto do atendimento").selectOption("Publicidade");
    const horario = await escolherDiaEHorario(page);
    await page.getByLabel("Nome", { exact: true }).fill("Fulano de Teste");
    await page.getByRole("button", { name: "Confirmar agendamento" }).click();

    // comprovante recebe o foco (leitor de tela anuncia)
    const titulo = page.getByRole("heading", { level: 2, name: "Agendamento confirmado" });
    await expect(titulo).toBeVisible();
    await expect(titulo).toBeFocused();
    await expect(page.getByText(/^AGD-\d{4}-\d{6}$/)).toBeVisible();

    const item = page.locator("#titulo-meus ~ ul li");
    await expect(item).toHaveCount(1);
    await expect(item).toContainText("Confirmado");
    await expect(item).toContainText(horario);
    await semViolacoesDeAcessibilidade(page);

    // persiste e o horário marcado fica indisponível para nova marcação
    await page.reload();
    await expect(page.locator("#titulo-meus ~ ul li")).toHaveCount(1);
    await page.getByLabel("Dia", { exact: true }).selectOption({ index: 1 });
    await expect(page.getByRole("radio", { name: new RegExp(horario) })).toBeDisabled();

    await page.getByRole("button", { name: /Cancelar/ }).click();
    await expect(page.locator("#titulo-meus ~ ul li")).toContainText("Cancelado");
    await expect(page.getByRole("button", { name: /Cancelar/ })).toHaveCount(0);
    await expect(page.getByRole("radio", { name: new RegExp(horario) })).toBeEnabled();
  });

  test("valida os campos obrigatórios", async ({ page }) => {
    await page.goto("/agendamento");
    await page.getByRole("button", { name: "Confirmar agendamento" }).click();
    for (const erro of ["Escolha o assunto do atendimento.", "Escolha o dia.", "Informe seu nome."]) {
      await expect(page.getByRole("alert").filter({ hasText: erro })).toBeVisible();
    }
    await semViolacoesDeAcessibilidade(page);
  });

  test("só dias úteis, 14 horários de 09:00 a 15:30 e alguns indisponíveis", async ({ page }) => {
    await page.goto("/agendamento");
    const dia = page.getByLabel("Dia", { exact: true });
    await expect(dia.locator("option")).toHaveCount(16);
    const rotulos = await dia.locator("option").allInnerTexts();
    expect(rotulos.slice(1).some((r) => /sábado|domingo/i.test(r))).toBe(false);

    await expect(page.getByText("Escolha um dia para ver os horários.")).toBeVisible();
    await dia.selectOption({ index: 1 });
    const radios = page.getByRole("radio");
    await expect(radios).toHaveCount(14);
    await expect(radios.first()).toHaveAttribute("value", "09:00");
    await expect(radios.last()).toHaveAttribute("value", "15:30");
    const desabilitados = await radios.evaluateAll((rs) => rs.filter((r) => (r as HTMLInputElement).disabled).length);
    expect(desabilitados).toBeGreaterThan(0);
    expect(desabilitados).toBeLessThan(14);
  });

  test("horários escolhem-se com as setas do teclado", async ({ page }) => {
    await page.goto("/agendamento");
    await page.getByLabel("Dia", { exact: true }).selectOption({ index: 2 });
    const primeiroLivre = page.getByRole("radio").and(page.locator(":not(:disabled)")).first();
    await primeiroLivre.focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("radio", { checked: true })).toHaveCount(1);
  });

  test("perfil de demonstração preenche o nome automaticamente", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /Maria Souza/ }).click();
    await page.goto("/agendamento");
    await expect(page.getByLabel("Nome", { exact: true })).toHaveValue("Maria Souza");
  });

  test("Canais de atendimento leva ao agendamento interno; Sistemas parceiros não lista mais o Agendamento", async ({ page }) => {
    await page.goto("/canais-de-atendimento");
    await page.getByRole("link", { name: "Agendar atendimento" }).click();
    await expect(page).toHaveURL(/\/agendamento$/);
    await page.goto("/sistemas-parceiros");
    await expect(page.getByText(/Agendamento SEDUR/)).toHaveCount(0);
  });
});
