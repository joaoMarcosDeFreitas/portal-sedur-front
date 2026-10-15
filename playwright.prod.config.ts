// Roda os mesmos testes e2e contra o site publicado na Vercel (não sobe servidor local).
process.env.E2E_BASE_URL ??= "https://portal-sedur-front.vercel.app";

export { default } from "./playwright.config";
