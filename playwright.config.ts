import { defineConfig } from "@playwright/test";

// Testes de ponta a ponta: sobem o site de produção (`next build` + `next start`) numa porta própria e
// usam um navegador de verdade. Por padrão usa o Microsoft Edge já instalado (não baixa nada);
// em outra máquina: `PW_CHANNEL=chromium` (depois de `npx playwright install chromium`) ou `PW_CHANNEL=chrome`.
const PORTA = 3100;
const canal = process.env.PW_CHANNEL ?? "msedge";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  use: {
    baseURL: `http://localhost:${PORTA}`,
    channel: canal === "chromium" ? undefined : canal,
    locale: "pt-BR",
    timezoneId: "America/Bahia",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: `npm run build && npx next start -p ${PORTA}`,
    url: `http://localhost:${PORTA}`,
    // VLibras (widget externo do governo) fica desligado nos testes: não depender de serviço de fora nem misturar o
    // conteúdo dele na verificação de acessibilidade. O valor é embutido no build, por isso vai no comando do build.
    env: { NEXT_PUBLIC_VLIBRAS: "off" },
    // Se já houver um servidor na porta (ex.: você subiu o build), reaproveita.
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
  },
});
