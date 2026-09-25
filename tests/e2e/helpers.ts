import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

/** Páginas representativas do portal público (uma de cada tipo de tela). */
export const PAGINAS_PUBLICAS = [
  "/",
  "/servicos",
  "/servicos/ambiental",
  "/servicos/ambiental/alteracao-de-razao-social-6876",
  "/servicos/empreendimento/habite-se-632",
  "/servicos/dispensados-de-licenca",
  "/consultas",
  "/consultas/renovacao-de-publicidade-dam?cga=90147",
  "/consultas/classificacao-de-risco-das-atividades",
  "/consultas/classificacao-de-risco-das-atividades/0",
  "/consultas/auto-de-infracao/1",
  "/consultas/solicitacao-de-servicos/2",
  "/legislacao",
  "/legislacao/cnlu",
  "/legislacao/decretos",
  "/legislacao?q=decreto",
  "/noticias",
  "/noticias/100",
  "/licitacoes",
  "/transparencia",
  "/transparencia/alvara-de-obras-em-vias-e-logradouros",
  "/transparencia/alvaras-de-habite-se",
  "/transparencia/alvaras-de-habite-se/0",
  "/transparencia/processos-em-convite",
  "/transparencia/audiencias-publicas",
  "/transparencia/eiv-riv",
  "/transparencia/carnaval",
  "/transparencia/carnaval/publicidade-em-blocos",
  "/transparencia/carnaval/publicidade-em-blocos/4",
  "/institucional",
  "/institucional/areas-de-atuacao",
  "/institucional/areas-de-atuacao/empreendimentos",
  "/institucional/projetos",
  "/institucional/projetos/iptu-verde",
  "/institucional/projetos/revisao-do-pddu",
  "/institucional/dirigentes",
  "/institucional/estrutura-organizacional",
  "/formularios",
  "/canais-de-atendimento",
  "/sistemas-parceiros",
  "/geoservicos",
  "/agendamento",
  "/login",
];

/** Escolhe o tema antes da primeira pintura (o portal guarda em localStorage). */
export async function definirTema(page: Page, tema: "light" | "dark") {
  await page.addInitScript((valor) => {
    try {
      localStorage.setItem("portal-sedur:tema", valor);
    } catch {
      // sem localStorage: o portal usa o tema do sistema
    }
  }, tema);
}

/** Falha se o axe (WCAG 2.0/2.1 A e AA + boas práticas) achar qualquer violação na página atual. */
export async function semViolacoesDeAcessibilidade(page: Page) {
  const resultado = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"])
    .analyze();
  const resumo = resultado.violations.map(
    (v) => `${v.id} (${v.impact}): ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")} — ${v.help}`,
  );
  expect(resumo, "violações de acessibilidade (axe)").toEqual([]);
}

/** Entra com um perfil fictício da tela de login de demonstração. */
export async function entrarComoDemonstracao(page: Page, perfil: RegExp = /Maria Souza/) {
  await page.goto("/login");
  await page.getByRole("button", { name: perfil }).click();
  await expect(page.getByRole("link", { name: /Maria|Construtora/ }).first()).toBeVisible();
}
